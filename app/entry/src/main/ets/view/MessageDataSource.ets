import { ChatMessage } from '../model/Models';

/**
 * 会话消息的 LazyForEach 数据源。
 * reload 时与旧列表逐项 diff：仅对"新增"与"内容变化"的索引发出精确通知，
 * 避免流式刷新导致整列表重建（同时保留消息卡内折叠状态的复用）。
 */

export class MessageDataSource implements IDataSource {
  private list: Array<ChatMessage> = new Array<ChatMessage>();
  private listeners: Array<DataChangeListener> = new Array<DataChangeListener>();

  private static keyOf(msg: ChatMessage): string {
    let k = msg.id;
    for (const p of msg.parts) {
      k += '|' + p.type.charAt(0);
      if (p.type === 'tool-call') {
        k += p.toolIndex.toString();
      } else {
        k += p.text.length.toString();
      }
    }
    return k;
  }

  totalCount(): number {
    return this.list.length;
  }

  getData(index: number): ChatMessage {
    return this.list[index];
  }

  /** 全量替换（内部 diff 出增量通知） */
  reload(next: Array<ChatMessage>): void {
    const oldKeys = this.list.map((m: ChatMessage): string => MessageDataSource.keyOf(m));
    const newKeys = next.map((m: ChatMessage): string => MessageDataSource.keyOf(m));
    this.list = next.slice();

    if (this.listeners.length === 0) {
      return;
    }
    // 找出第一个差异点之后的处理：前缀不变部分仅通知内容变化的项，尾部新增逐项通知
    let i = 0;
    const minLen = Math.min(oldKeys.length, newKeys.length);
    while (i < minLen) {
      if (oldKeys[i] !== newKeys[i]) {
        for (const l of this.listeners) {
          l.onDataChange(i);
        }
      }
      i += 1;
    }
    if (newKeys.length > oldKeys.length) {
      for (let j = oldKeys.length; j < newKeys.length; j++) {
        for (const l of this.listeners) {
          l.onDataAdd(j);
        }
      }
    } else if (newKeys.length < oldKeys.length) {
      for (let j = oldKeys.length - 1; j >= newKeys.length; j--) {
        for (const l of this.listeners) {
          l.onDataDelete(j);
        }
      }
    }
  }

  registerDataChangeListener(listener: DataChangeListener): void {
    if (this.listeners.indexOf(listener) < 0) {
      this.listeners.push(listener);
    }
  }

  unregisterDataChangeListener(listener: DataChangeListener): void {
    const idx = this.listeners.indexOf(listener);
    if (idx >= 0) {
      this.listeners.splice(idx, 1);
    }
  }
}
