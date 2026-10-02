import { hilog } from '@kit.PerformanceAnalysisKit';
import { ChannelClient } from './ChannelClient';
import { FrameAssembler, FrameIdentity, encodeFrames } from './FrameCodec';
import { jNum, jStr } from './Json';

/**
 * 一次 workspace bridge 会话:
 *  - 持有桥身份与双向 seq 计数
 *  - 出站: 完整消息 → rpc-frame 列表 → 通过中继 data payload 发送
 *  - 入站: rpc-frame → 组装 → ChannelClient；rpc-frame-ack → 记录；其余 app payload 回调上层
 */
export class BridgeSession {
  readonly identity: FrameIdentity;
  readonly workspaceKey: string;
  readonly workspacePath: string;
  readonly initialTaskId: string;
  readonly channel: ChannelClient = new ChannelClient();

  private nextPhysicalSeq: number = 1;
  private nextMessageSeq: number = 1;
  private assembler: FrameAssembler;

  /** 桥被判定不可用（degrade / 对端报错 / 连接断开） */
  onBridgeDown: ((reason: string) => void) | undefined = undefined;
  /** 发送 data payload（JSON 文本）到中继 */
  sendAppPayloadJson: ((jsonText: string) => boolean) | undefined = undefined;
  /** 非 rpc-frame 的 app payload（workspace-list-updated 等） */
  onAppPayload: ((payload: Record<string, Object>) => void) | undefined = undefined;

  constructor(identity: FrameIdentity, workspaceKey: string, workspacePath: string, initialTaskId: string) {
    this.identity = identity;
    this.workspaceKey = workspaceKey;
    this.workspacePath = workspacePath;
    this.initialTaskId = initialTaskId;
    this.assembler = new FrameAssembler(identity);
    this.assembler.onMessageComplete = (bytes: Uint8Array, messageSeq: number) => {
      this.channel.onFrameBytes(bytes);
    };
    this.assembler.sendAck = (ackMessageSeq: number) => {
      const ack: Record<string, Object> = {
        'zcode_type': 'rpc-frame-ack',
        'bridgeSessionId': identity.bridgeSessionId,
        'ackMessageSeq': ackMessageSeq
      };
      if (identity.bridgeGeneration > 0) {
        ack['bridgeGeneration'] = identity.bridgeGeneration;
      }
      if (identity.recoveryId.length > 0) {
        ack['recoveryId'] = identity.recoveryId;
      }
      if (this.sendAppPayloadJson !== undefined) {
        this.sendAppPayloadJson(JSON.stringify(ack));
      }
    };
    this.assembler.onDegraded = (reason: string) => {
      this.markDown(reason);
    };
    this.channel.sendFrameBytes = (bytes: Uint8Array) => {
      this.sendBytes(bytes);
    };
  }

  /** 中继层收到 data payload 时调用 */
  feedPayload(payload: Record<string, Object>): void {
    const zt = jStr(payload, 'zcode_type');
    if (zt !== 'rpc-frame') {
      hilog.info(0x0000, 'ZCRemote', '[bridge] payload %{public}s', zt);
    }
    if (zt === 'rpc-frame') {
      this.assembler.accept(payload);
      return;
    }
    if (zt === 'rpc-frame-ack') {
      this.assembler.acceptAck(jNum(payload, 'ackMessageSeq'));
      return;
    }
    if (this.onAppPayload !== undefined) {
      this.onAppPayload(payload);
    }
  }

  /** 中继连接断开时调用：标记桥不可用并立即清空挂起请求 */
  onTransportDown(): void {
    this.channel.drainPending('bridge transport disconnected');
    this.markDown('transport disconnected');
  }

  /** 发送一条完整序列化消息（自动分帧） */
  private sendBytes(bytes: Uint8Array): void {
    const frames = encodeFrames(bytes, this.identity, this.nextPhysicalSeq, this.nextMessageSeq);
    this.nextMessageSeq += 1;
    this.nextPhysicalSeq += frames.length;
    for (const f of frames) {
      if (this.sendAppPayloadJson === undefined || !this.sendAppPayloadJson(f)) {
        this.markDown('send failed');
        return;
      }
    }
  }

  private markDown(reason: string): void {
    hilog.error(0x0000, 'ZCRemote', '[bridge] down: %{public}s', reason);
    if (this.onBridgeDown !== undefined) {
      const cb = this.onBridgeDown;
      this.onBridgeDown = undefined;
      cb(reason);
    }
  }
}
