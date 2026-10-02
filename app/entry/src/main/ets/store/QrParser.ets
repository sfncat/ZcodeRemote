import { BindingInfo } from '../model/Models';

/**
 * 解析 ZCode 桌面端二维码 / 粘贴的绑定链接:
 *   https://zcode.z.ai/remote/v4?sid=...&hash=...&t=...&mid=...&name=...&app_version=...
 */
export class QrParseResult {
  ok: boolean = false;
  error: string = '';
  info: BindingInfo | undefined = undefined;
}

export class QrParser {
  static parse(text: string): QrParseResult {
    const result = new QrParseResult();
    const raw = text.trim();
    if (raw.length === 0) {
      result.error = '内容为空';
      return result;
    }
    const qIdx = raw.indexOf('?');
    if (qIdx < 0) {
      result.error = '未找到链接参数（请扫描桌面端弹出的二维码或粘贴完整链接）';
      return result;
    }
    const query = raw.substring(qIdx + 1);
    const params: Map<string, string> = new Map();
    const parts = query.split('&');
    for (const p of parts) {
      if (p.length === 0) {
        continue;
      }
      const eq = p.indexOf('=');
      if (eq < 0) {
        continue;
      }
      params.set(safeDecode(p.substring(0, eq)), safeDecode(p.substring(eq + 1)));
    }
    const sid = params.get('sid') !== undefined ? params.get('sid') as string : '';
    const hash = params.get('hash') !== undefined ? params.get('hash') as string : '';
    if (sid.length === 0 || hash.length === 0) {
      result.error = '链接缺少 sid/hash 配对凭证';
      return result;
    }
    // hash 应为 44 位标准 base64（sha256 摘要）
    if (hash.length < 20) {
      result.error = 'hash 字段异常';
      return result;
    }
    const info = new BindingInfo();
    info.deviceSid = sid;
    info.passHash = hash;
    const mid = params.get('mid');
    info.deviceMid = mid !== undefined ? mid : '';
    const name = params.get('name');
    info.deviceName = name !== undefined && name.length > 0 ? name : '我的电脑';
    const ver = params.get('app_version');
    info.appVersion = ver !== undefined && ver.length > 0 ? ver : '3.14.4';
    // 端点取自 URL 本体；仅接受 https，防伪造二维码把凭证发往任意服务器
    const schemeEnd = raw.indexOf('://');
    if (schemeEnd <= 0) {
      result.error = '链接缺少协议头';
      return result;
    }
    const scheme = raw.substring(0, schemeEnd).toLowerCase();
    if (scheme !== 'https') {
      result.error = '绑定链接必须为 https（当前: ' + scheme + '），为防凭证泄露已拒绝';
      return result;
    }
    const originEnd = raw.indexOf('/', schemeEnd + 3);
    info.endpointOrigin = originEnd > 0 ? raw.substring(0, originEnd) : raw;
    result.ok = true;
    result.info = info;
    return result;
  }
}

/** 安全 decode：畸形百分号编码返回原值而非抛异常 */
function safeDecode(text: string): string {
  try {
    return decodeURIComponent(text);
  } catch (e) {
    return text;
  }
}
