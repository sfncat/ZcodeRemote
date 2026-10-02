import { Crc32 } from './Crc32';
import { Bytes } from './Bytes';
import { jNum, jStr } from './Json';

/**
 * rpc-frame 可靠分帧层（桥内二进制在 data payload 上的载体）
 *
 * 出站: 将一条字节消息切成固定大小的分片（256KB, envelope ≈350KB，远低于官方 ~500KB 上限，
 *       64 分片可覆盖 16MB 最大消息），作为 zcode_type=rpc-frame 的 data payload 逐帧发送。
 * 入站: 按物理 seq 严格连续组装（WebSocket 本身有序），收完整消息后校验 crc32 并回 ack。
 */

export const FRAME_CHUNK_BYTES: number = 256 * 1024;

export class FrameIdentity {
  bridgeSessionId: string = '';
  bridgeGeneration: number = 0;
  recoveryId: string = '';

  constructor(sessionId: string, generation: number, recoveryId: string) {
    this.bridgeSessionId = sessionId;
    this.bridgeGeneration = generation;
    this.recoveryId = recoveryId;
  }
}

export class OutboundFrame {
  payloadJson: string = '';
}

/** 编码一条出站消息为若干 rpc-frame payload（调用后递增调用方的 seq 计数） */
export function encodeFrames(message: Uint8Array, id: FrameIdentity,
  firstPhysicalSeq: number, messageSeq: number): Array<string> {
  if (message.length === 0) {
    return [];
  }
  const count = Math.ceil(message.length / FRAME_CHUNK_BYTES);
  const checksum = Crc32.hex(message);
  const frames: Array<string> = [];
  for (let i = 0; i < count; i++) {
    const from = i * FRAME_CHUNK_BYTES;
    const to = Math.min(message.length, from + FRAME_CHUNK_BYTES);
    const chunk = message.subarray(from, to);
    const f: Record<string, Object> = {
      'zcode_type': 'rpc-frame',
      'bridgeSessionId': id.bridgeSessionId,
      'seq': firstPhysicalSeq + i,
      'messageSeq': messageSeq,
      'fragmentIndex': i,
      'fragmentCount': count,
      'messageBytes': message.length,
      'checksum': { 'algorithm': 'crc32', 'value': checksum } as Record<string, Object>,
      'dataBase64': Bytes.base64(chunk)
    };
    if (id.bridgeGeneration > 0) {
      f['bridgeGeneration'] = id.bridgeGeneration;
    }
    if (id.recoveryId.length > 0) {
      f['recoveryId'] = id.recoveryId;
    }
    frames.push(JSON.stringify(f));
  }
  return frames;
}

/** 入站分帧组装器（严格 seq 连续；出错进入 degraded，由上层关桥重建） */
export class FrameAssembler {
  private identity: FrameIdentity;
  private expectedSeq: number = 1;
  private expectedMessageSeq: number = 1;
  private fragments: Array<Uint8Array> = [];
  private receivedCount: number = 0;
  private curMessageBytes: number = 0;
  private curMessageSeq: number = 0;
  private curFragmentCount: number = 0;

  onMessageComplete: ((bytes: Uint8Array, messageSeq: number) => void) | undefined = undefined;
  sendAck: ((ackMessageSeq: number) => void) | undefined = undefined;
  onDegraded: ((reason: string) => void) | undefined = undefined;

  constructor(identity: FrameIdentity) {
    this.identity = identity;
  }

  reset(): void {
    this.expectedSeq = 1;
    this.expectedMessageSeq = 1;
    this.fragments = [];
    this.receivedCount = 0;
    this.curMessageBytes = 0;
    this.curMessageSeq = 0;
    this.curFragmentCount = 0;
  }

  /** payload 为已解析的 data payload JSON 对象（zcode_type === 'rpc-frame'） */
  accept(payload: Record<string, Object>): void {
    const seq = jNum(payload, 'seq');
    const messageSeq = jNum(payload, 'messageSeq');
    const fragmentIndex = jNum(payload, 'fragmentIndex');
    const fragmentCount = jNum(payload, 'fragmentCount');
    const messageBytes = jNum(payload, 'messageBytes');
    const dataBase64 = jStr(payload, 'dataBase64');

    // 旧消息重复 → 幂等 ack
    if (messageSeq < this.expectedMessageSeq) {
      if (this.sendAck !== undefined) {
        this.sendAck(this.expectedMessageSeq - 1);
      }
      return;
    }
    if (seq !== this.expectedSeq) {
      this.degrade(`physical seq gap: got ${seq}, want ${this.expectedSeq}`);
      return;
    }
    const data = Bytes.unbase64(dataBase64);
    if (this.receivedCount === 0) {
      // 新消息开始
      this.fragments = [];
      this.receivedCount = 0;
      this.curMessageBytes = messageBytes;
      this.curMessageSeq = messageSeq;
      this.curFragmentCount = fragmentCount;
    } else {
      // 元数据一致性
      if (fragmentCount !== this.curFragmentCount || messageBytes !== this.curMessageBytes) {
        this.degrade('metadata mismatch mid-message');
        return;
      }
    }
    if (fragmentIndex !== this.receivedCount) {
      this.degrade(`fragment gap: got ${fragmentIndex}, want ${this.receivedCount}`);
      return;
    }
    if (this.receivedCount + 1 > this.curFragmentCount) {
      this.degrade('too many fragments');
      return;
    }
    this.fragments.push(data);
    this.receivedCount += 1;
    this.expectedSeq = seq + 1;

    if (this.receivedCount === this.curFragmentCount) {
      const full = Bytes.concat(this.fragments);
      const expect = Crc32.hex(full);
      const checksumRec = this.readChecksum(payload);
      if (checksumRec.length > 0 && checksumRec !== expect) {
        this.degrade(`crc32 mismatch: got ${checksumRec}, want ${expect}`);
        return;
      }
      const doneSeq = this.curMessageSeq;
      this.fragments = [];
      this.receivedCount = 0;
      this.curMessageBytes = 0;
      this.curFragmentCount = 0;
      this.curMessageSeq = 0;
      this.expectedMessageSeq = doneSeq + 1;
      if (this.sendAck !== undefined) {
        this.sendAck(doneSeq);
      }
      if (this.onMessageComplete !== undefined) {
        this.onMessageComplete(full, doneSeq);
      }
    }
  }

  /** 接收对端的 rpc-frame-ack（v1 仅记录，不做重放） */
  acceptAck(ackMessageSeq: number): void {
    // 预留: 若实现发送重放，可在此释放已确认消息
  }

  private readChecksum(payload: Record<string, Object>): string {
    const v: Object | undefined = payload['checksum'];
    if (v === undefined || typeof v !== 'object') {
      return '';
    }
    const rec = v as Record<string, Object>;
    return jStr(rec, 'value');
  }

  private degrade(reason: string): void {
    this.reset();
    if (this.onDegraded !== undefined) {
      this.onDegraded(reason);
    }
  }
}
