import { decodePair, encodeRequest, RS_EVENT_FIRE, RS_INITIALIZE, RS_PROMISE_ERROR,
  RS_PROMISE_ERROR_OBJ, RS_PROMISE_SUCCESS, RT_PROMISE, WirePair } from './WireSerializer';

/**
 * 桥内 RPC 通道客户端（VS Code 风格）
 * 传输由 BridgeSession 提供: sendFrameBytes(完整序列化消息) / onFrameBytes 回调
 */
export class ChannelClient {
  private nextRequestId: number = 1;
  private pending: Map<number, ChannelWaiter> = new Map();
  private initialized: boolean = false;
  private initWaiters: Array<() => void> = [];

  // 由 BridgeSession 注入
  sendFrameBytes: ((bytes: Uint8Array) => void) | undefined = undefined;

  /** 收到一条完整的序列化消息 */
  onFrameBytes(bytes: Uint8Array): void {
    const pair: WirePair | undefined = decodePair(bytes);
    if (pair === undefined || pair.head.length < 1) {
      return;
    }
    const type = pair.head[0];
    if (type === RS_INITIALIZE) {
      this.initialized = true;
      const waiters = this.initWaiters;
      this.initWaiters = [];
      for (const w of waiters) {
        w();
      }
      return;
    }
    if (pair.head.length < 2) {
      return;
    }
    const id = pair.head[1];
    if (type === RS_EVENT_FIRE) {
      // v1 暂不消费事件
      return;
    }
    const waiter = this.pending.get(id);
    if (waiter === undefined) {
      return;
    }
    this.pending.delete(id);
    if (type === RS_PROMISE_SUCCESS) {
      waiter.settle(undefined, pair.dataJson !== undefined ? pair.dataJson : '');
    } else if (type === RS_PROMISE_ERROR || type === RS_PROMISE_ERROR_OBJ) {
      let message = 'RPC error';
      if (pair.dataJson !== undefined) {
        try {
          const rec = JSON.parse(pair.dataJson) as Record<string, Object>;
          const msgVal: Object | undefined = rec['message'];
          if (typeof msgVal === 'string') {
            message = msgVal as string;
          }
        } catch (e) {
          // keep default
        }
      } else if (pair.dataStr !== undefined) {
        message = pair.dataStr;
      }
      waiter.settle(new Error('[RPC_ERROR] ' + message), '');
    }
  }

  /** 等待服务端 Initialize；返回 false 表示超时未收到（对端协议异常），由调用方决定降级策略 */
  async waitReady(timeoutMs: number): Promise<boolean> {
    if (this.initialized) {
      return true;
    }
    return await new Promise<boolean>((resolve, reject) => {
      let done: boolean = false;
      const finish = (ok: boolean) => {
        if (done) {
          return;
        }
        done = true;
        resolve(ok);
      };
      const waiter = () => {
        finish(true);
      };
      this.initWaiters.push(waiter);
      setTimeout(() => {
        const idx = this.initWaiters.indexOf(waiter);
        if (idx >= 0) {
          this.initWaiters.splice(idx, 1);
        }
        finish(false);
      }, timeoutMs);
    });
  }

  /** 桥断开时清空挂起请求，让等待方立即失败而非等超时 */
  drainPending(reason: string): void {
    const waiters = Array.from(this.pending.values());
    this.pending.clear();
    for (const w of waiters) {
      w.settle(new Error('[BRIDGE_DOWN] ' + reason), '');
    }
    this.initialized = false;
    this.initWaiters.length = 0;
  }

  /**
   * 发起一次通道调用。
   * argJson 为参数 JSON 文本（通常是 [参数对象] 数组形式）；undefined 表示无参数。
   * 返回 PromiseSuccess 的 data JSON 文本。
   */
  request(channelName: string, methodName: string, argJson: string | undefined,
    timeoutMs: number): Promise<string> {
    const id = this.nextRequestId;
    this.nextRequestId += 1;
    const bytes = encodeRequest(RT_PROMISE, id, channelName, methodName, argJson);
    const waiter = new ChannelWaiter();
    this.pending.set(id, waiter);
    if (this.sendFrameBytes === undefined) {
      this.pending.delete(id);
      return Promise.reject(new Error('[NO_TRANSPORT] bridge not ready'));
    }
    this.sendFrameBytes(bytes);
    return new Promise<string>((resolve, reject) => {
      let settled: boolean = false;
      const timer = setTimeout(() => {
        if (!settled) {
          settled = true;
          this.pending.delete(id);
          reject(new Error(`[TIMEOUT] request timeout: ${channelName}.${methodName} (${timeoutMs}ms)`));
        }
      }, timeoutMs);
      waiter.settle = (err: Error | undefined, data: string): void => {
        if (settled) {
          return;
        }
        settled = true;
        clearTimeout(timer);
        if (err !== undefined) {
          reject(err);
        } else {
          resolve(data);
        }
      };
    });
  }
}

class ChannelWaiter {
  settle: (err: Error | undefined, data: string) => void = () => {
  };
}
