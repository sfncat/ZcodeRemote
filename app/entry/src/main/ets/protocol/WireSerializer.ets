import { ByteReader, ByteWriter, Bytes } from './Bytes';

/**
 * ZCode 桥内 RPC 序列化协议（与桌面端/Web 端一致）:
 *   1 字节类型标记 + 变长载荷
 *   0=undefined 1=string 2=Buffer 3=VSBuffer 4=Array 5=Object(JSON 文本) 6=Int(varint)
 *
 * RPC 请求 wire 格式:  serialize([requestType, requestId, channelName, methodName]) + serialize(arg)
 * RPC 响应 wire 格式:  serialize([responseType, requestId]) + serialize(data)
 */

export const WT_UNDEFINED: number = 0;
export const WT_STRING: number = 1;
export const WT_BUFFER: number = 2;
export const WT_VSBUFFER: number = 3;
export const WT_ARRAY: number = 4;
export const WT_OBJECT: number = 5;
export const WT_INT: number = 6;

/** RPC 请求类型（客户端 → 服务端） */
export const RT_PROMISE: number = 100;
export const RT_PROMISE_CANCEL: number = 101;
export const RT_EVENT_LISTEN: number = 102;
export const RT_EVENT_DISPOSE: number = 103;

/** RPC 响应类型（服务端 → 客户端） */
export const RS_INITIALIZE: number = 200;
export const RS_PROMISE_SUCCESS: number = 201;
export const RS_PROMISE_ERROR: number = 202;
export const RS_PROMISE_ERROR_OBJ: number = 203;
export const RS_EVENT_FIRE: number = 204;

/** 编码一条 RPC 请求（两个顶层值） */
export function encodeRequest(requestType: number, requestId: number, channelName: string,
  methodName: string, argJson: string | undefined): Uint8Array {
  const w = new ByteWriter(256);
  // 值 1: [type, id, channel, method]
  w.writeByte(WT_ARRAY);
  w.writeVarint(4);
  w.writeByte(WT_INT);
  w.writeVarint(requestType);
  w.writeByte(WT_INT);
  w.writeVarint(requestId);
  writeString(w, channelName);
  writeString(w, methodName);
  // 值 2: 参数（Object = JSON 文本；VS Code 代理传的是参数数组，这里由调用方决定）
  if (argJson === undefined) {
    w.writeByte(WT_UNDEFINED);
  } else {
    writeObjectJson(w, argJson);
  }
  return w.toBytes();
}

export class WirePair {
  head: Array<number> = [];
  dataJson: string | undefined = undefined;
  dataStr: string | undefined = undefined;
  dataBytes: Uint8Array | undefined = undefined;
}

/** 解析一条消息（两个顶层值: head 数组 + data） */
export function decodePair(bytes: Uint8Array): WirePair | undefined {
  try {
    const r = new ByteReader(bytes);
    const pair = new WirePair();
    const t = r.readByte();
    if (t !== WT_ARRAY) {
      return undefined;
    }
    const n = r.readVarint();
    for (let i = 0; i < n; i++) {
      const tag = r.readByte();
      if (tag === WT_INT) {
        pair.head.push(r.readVarint());
      } else if (tag === WT_STRING) {
        pair.head.push(-1);
        r.readBytes(r.readVarint());
      } else {
        return undefined;
      }
    }
    if (r.remaining < 1) {
      return pair;
    }
    const dtag = r.readByte();
    if (dtag === WT_UNDEFINED) {
      // no data
    } else if (dtag === WT_OBJECT) {
      pair.dataJson = readLenStr(r);
    } else if (dtag === WT_ARRAY) {
      pair.dataJson = readWireValueJson(r);
    } else if (dtag === WT_STRING) {
      pair.dataStr = readLenStr(r);
    } else if (dtag === WT_BUFFER || dtag === WT_VSBUFFER) {
      pair.dataBytes = r.readBytes(r.readVarint());
    } else {
      return undefined;
    }
    return pair;
  } catch (e) {
    return undefined;
  }
}

/** 递归读取一个 wire 值并输出其 JSON 文本（ARRAY 数据需要；OBJECT 直接内嵌原文） */
function readWireValueJson(r: ByteReader): string {
  const tag = r.readByte();
  if (tag === WT_UNDEFINED) {
    return 'null';
  }
  if (tag === WT_INT) {
    return r.readVarint().toString();
  }
  if (tag === WT_STRING) {
    return JSON.stringify(readLenStr(r));
  }
  if (tag === WT_BUFFER || tag === WT_VSBUFFER) {
    r.readBytes(r.readVarint());
    return 'null';
  }
  if (tag === WT_ARRAY) {
    const n = r.readVarint();
    const parts: Array<string> = [];
    for (let i = 0; i < n; i++) {
      parts.push(readWireValueJson(r));
    }
    return `[${parts.join(',')}]`;
  }
  if (tag === WT_OBJECT) {
    // 对象的内层文本本身就是合法 JSON
    return readLenStr(r);
  }
  throw new Error(`unsupported wire tag ${tag}`);
}

function writeString(w: ByteWriter, s: string): void {
  const b = Bytes.utf8(s);
  w.writeByte(WT_STRING);
  w.writeVarint(b.length);
  w.writeBytes(b);
}

function writeObjectJson(w: ByteWriter, jsonText: string): void {
  const b = Bytes.utf8(jsonText);
  w.writeByte(WT_OBJECT);
  w.writeVarint(b.length);
  w.writeBytes(b);
}

function readLenStr(r: ByteReader): string {
  const len = r.readVarint();
  return Bytes.toStr(r.readBytes(len));
}
