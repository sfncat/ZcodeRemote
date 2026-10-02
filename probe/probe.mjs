// ZCode 远程控制协议探针
// 用途: 以 role=terminal 连接云端中继，验证"一次绑定"凭证跨会话有效性，
//       抓取 bootstrap/workspace-list 响应样例，可选打开 workspace bridge 抓 rpc-frame。
// 仅使用 Node 内置模块 (Node >= 22, 需要全局 WebSocket)。
import { createHash, createHmac, createDecipheriv } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { homedir, userInfo, platform as osPlatform } from 'node:os';

const ZCODE_DIR = join(homedir(), '.zcode', 'v2');
const RELAY_WS = 'wss://zcode.z.ai/ws';
const MAX_FRAME = 512 * 1024; // 保守的 maxPhysicalFrameBytes

const args = process.argv.slice(2);
const FLAG_OPEN_BRIDGE = args.includes('--bridge');
const DUMP_DIR = join(import.meta.dirname, '..', 'research', 'samples');
mkdirSync(DUMP_DIR, { recursive: true });

function log(...a) { console.log(new Date().toISOString().slice(11, 23), ...a); }
function redact(s) { return typeof s === 'string' && s.length > 12 ? s.slice(0, 6) + '…' + s.slice(-4) : s; }

// ---------- 1. 读取本地凭证 ----------
function loadCredentials() {
  const settings = JSON.parse(readFileSync(join(ZCODE_DIR, 'setting.json'), 'utf8'));
  const deviceSid = settings?.webRemoteControlExternalRelayDevice?.deviceSid;
  if (!deviceSid) throw new Error('setting.json 中没有 deviceSid（从未启用过远程控制？）');

  const telemetry = JSON.parse(readFileSync(join(ZCODE_DIR, 'telemetry-state.json'), 'utf8'));
  // deviceMid 可能在不同键下，扫描一层
  let deviceMid = telemetry?.deviceMid || telemetry?.mid;
  if (!deviceMid) {
    for (const [k, v] of Object.entries(telemetry)) {
      if (typeof v === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v)) {
        deviceMid = v; log(`[cred] 从 telemetry-state.json 的键 "${k}" 推断 deviceMid`);
        break;
      }
    }
  }

  const creds = JSON.parse(readFileSync(join(ZCODE_DIR, 'credentials.json'), 'utf8'));
  const enc = creds['web-remote-control:external-relay:pass_hash'];
  if (!enc) throw new Error('credentials.json 中没有 pass_hash');
  const passHash = decryptCredential(enc);
  log(`[cred] deviceSid=${redact(deviceSid)} deviceMid=${redact(deviceMid || '?')} passHash=${redact(passHash)} (len=${passHash.length})`);
  return { deviceSid, deviceMid, passHash };
}

// 桌面端凭据加密: enc:v1:<b64url(iv12)>.<b64url(tag16)>.<b64url(cipher)> AES-256-GCM
// key = sha256(ZCODE_CREDENTIAL_SECRET || "zcode-credential-fallback:<platform>:<homedir>:<username>")
function decryptCredential(enc) {
  if (!enc.startsWith('enc:v1:')) return enc; // 未加密
  const secret = process.env.ZCODE_CREDENTIAL_SECRET
    ?? `zcode-credential-fallback:${osPlatform()}:${homedir()}:${userInfo().username}`;
  const key = createHash('sha256').update(secret).digest();
  const [ivB64, tagB64, dataB64] = enc.slice('enc:v1:'.length).split('.');
  const iv = Buffer.from(ivB64, 'base64url');
  const tag = Buffer.from(tagB64, 'base64url');
  const data = Buffer.from(dataB64, 'base64url');
  const d = createDecipheriv('aes-256-gcm', key, iv);
  d.setAuthTag(tag);
  return Buffer.concat([d.update(data), d.final()]).toString('utf8');
}

// ---------- 2. 中继协议 ----------
function calculateProof(passHash, nonce, role, deviceSid) {
  return createHmac('sha256', passHash).update(`${nonce}|${role}|${deviceSid}`).digest('base64url');
}

const b64 = (buf) => Buffer.from(buf).toString('base64');
const unb64 = (s) => new Uint8Array(Buffer.from(s, 'base64'));

// crc32 (与桌面端/SPA 一致的标准 CRC-32)
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(u8) {
  let c = 0xffffffff;
  for (let i = 0; i < u8.length; i++) c = CRC_TABLE[(c ^ u8[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

class RelayClient {
  constructor(cred) {
    this.cred = cred;
    this.msgHandlers = [];
    this.state = 'connecting';
  }
  onMessage(h) { this.msgHandlers.push(h); }

  connect() {
    const url = new URL(RELAY_WS);
    if (this.cred.deviceMid) url.searchParams.set('mid', this.cred.deviceMid);
    log(`[ws] connecting ${url.origin}${url.pathname}?mid=…`);
    this.ws = new WebSocket(url.toString());
    this.ws.addEventListener('open', () => {
      log('[ws] open → auth_init(role=terminal)');
      this.send({
        type: 'auth_init', role: 'terminal', device_sid: this.cred.deviceSid,
        meta: { platform: 'web', version: '3.14.4', name: 'zcode-remote-probe' },
        client_ts: Date.now(),
      });
    });
    this.ws.addEventListener('message', (ev) => this.handleRaw(ev.data));
    this.ws.addEventListener('error', (e) => log('[ws] error', e.message ?? e));
    this.ws.addEventListener('close', (e) => {
      log(`[ws] close code=${e.code} reason=${e.reason || '<none>'} clean=${e.wasClean}`);
      if (this.state !== 'done') { this.state = 'closed'; }
    });
  }

  send(obj) {
    const s = JSON.stringify(obj);
    log('[→]', s.length > 300 ? JSON.stringify({ ...obj, proof: obj.proof && redact(obj.proof) }).slice(0, 300) : s);
    this.ws.send(s);
  }

  handleRaw(data) {
    let msg;
    try { msg = JSON.parse(typeof data === 'string' ? data : Buffer.from(data).toString('utf8')); }
    catch { log('[←] non-json frame', String(data).slice(0, 80)); return; }
    switch (msg.type) {
      case 'auth_challenge':
        log('[←] auth_challenge → auth_response');
        this.send({
          type: 'auth_response', device_sid: this.cred.deviceSid,
          proof: calculateProof(this.cred.passHash, msg.nonce, 'terminal', this.cred.deviceSid),
          client_ts: Date.now(),
        });
        break;
      case 'auth_ack':
      case 'pair_status_ack':
        log(`[←] ${msg.type} pair_status=${msg.pair_status}`);
        this.state = msg.pair_status;
        this.onPairStatus?.(msg.pair_status);
        break;
      case 'data':
        this.onData?.(msg.payload);
        for (const h of this.msgHandlers) h(msg.payload);
        break;
      case 'error':
        log('[←] ERROR code=' + msg.code, msg.message ?? '');
        this.onError?.(msg);
        break;
      default:
        log('[←]', JSON.stringify(msg).slice(0, 200));
    }
  }

  startHeartbeat() {
    this.heartbeat = setInterval(() => {
      this.send({ type: 'pair_status_query', device_sid: this.cred.deviceSid, client_ts: Date.now() });
    }, 10000);
  }
  close() { this.state = 'done'; clearInterval(this.heartbeat); try { this.ws.close(); } catch {} }
}

// ---------- 3. 主流程: 鉴权 + bootstrap + workspace-list ----------
const cred = loadCredentials();
const client = new RelayClient(cred);

let samples = {};
const requestId = () => 'probe-' + Math.random().toString(36).slice(2, 10);

client.onPairStatus = (status) => {
  if (status === 'waiting') {
    log('[pair] waiting —— 凭证已在relay层通过验证(未 AUTH_FAILED)，等待桌面端配对…(30s超时)');
  } else if (status === 'matched') {
    log('[pair] ★ matched —— 一次绑定验证通过！');
    client.startHeartbeat();
    client.send({ type: 'data', payload: { zcode_type: 'bootstrap-request', requestId: requestId() }, client_ts: Date.now() });
    setTimeout(() => {
      client.send({ type: 'data', payload: { zcode_type: 'workspace-list-request', requestId: requestId() }, client_ts: Date.now() });
    }, 1500);
    if (FLAG_OPEN_BRIDGE) setTimeout(openBridge, 3000);
    setTimeout(() => {
      writeFileSync(join(DUMP_DIR, 'bootstrap-sample.json'), JSON.stringify(samples, null, 2));
      log('[done] 样例已保存到 research/samples/bootstrap-sample.json');
      client.close();
      process.exit(0);
    }, FLAG_OPEN_BRIDGE ? 20000 : 9000);
  }
};

client.onData = (payload) => {
  if (payload && typeof payload === 'object' && !payload.zcode_type?.startsWith('rpc-frame')) {
    const zt = payload.zcode_type ?? '?';
    log('[data]', zt, JSON.stringify(payload).slice(0, 400));
    samples[zt + '-' + Date.now()] = payload;
  }
};

client.onError = (e) => {
  if (e.code === 'AUTH_FAILED' || e.code === 'WRONG_PARAM') {
    console.error('\n❌ AUTH_FAILED —— 凭证已被轮换，一次绑定假设不成立（需要回退方案）');
    process.exit(2);
  }
};

function openBridge() {
  // 从 bootstrap 响应中取第一个 workspaceKey
  const bs = Object.values(samples).find((p) => p.zcode_type === 'bootstrap-response');
  const ws0 = bs?.result?.workspaces?.[0];
  if (!ws0) { log('[bridge] 没有 workspace，跳过'); return; }
  const workspaceKey = ws0.workspaceKey ?? JSON.stringify(ws0);
  const bridgeSessionId = 'probe-bridge-' + Date.now();
  log('[bridge] opening workspace=' + String(workspaceKey).slice(0, 60));
  client.send({
    type: 'data',
    payload: { zcode_type: 'workspace-bridge-open', requestId: requestId(), bridgeSessionId, workspaceKey },
    client_ts: Date.now(),
  });
}

log('连接中继并验证一次绑定…（桌面端远程控制需处于开启状态）');
client.connect();

// 30s 兜底超时
setTimeout(() => {
  if (client.state !== 'matched' && client.state !== 'done') {
    console.error(`\n⏱ 超时退出，最后状态=${client.state}`);
    writeFileSync(join(DUMP_DIR, 'probe-timeout.json'), JSON.stringify(samples, null, 2));
    process.exit(1);
  }
}, 30000);
