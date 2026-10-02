import util from '@ohos.util';

/**
 * 字节/编码工具: UTF-8、Base64（标准与 URL 安全）、LEB128 varint、字节数组读写器
 */
export class Bytes {
  private static enc: util.TextEncoder = new util.TextEncoder();
  private static dec: util.TextDecoder = new util.TextDecoder('utf-8');
  private static b64: util.Base64Helper = new util.Base64Helper();

  static utf8(s: string): Uint8Array {
    return Bytes.enc.encodeInto(s);
  }

  static toStr(b: Uint8Array): string {
    return Bytes.dec.decodeToString(b);
  }

  static base64(b: Uint8Array): string {
    return Bytes.b64.encodeToStringSync(b);
  }

  static unbase64(s: string): Uint8Array {
    return Bytes.b64.decodeSync(s);
  }

  /** base64url（无填充），用于 HMAC 证明 —— 与 Node base64url 输出一致 */
  static base64Url(b: Uint8Array): string {
    const s = Bytes.b64.encodeToStringSync(b, util.Type.BASIC_URL_SAFE);
    let end = s.length;
    while (end > 0 && s.charAt(end - 1) === '=') {
      end -= 1;
    }
    return end === s.length ? s : s.substring(0, end);
  }

  static concat(parts: Array<Uint8Array>): Uint8Array {
    let total = 0;
    for (const p of parts) {
      total += p.length;
    }
    const out = new Uint8Array(total);
    let o = 0;
    for (const p of parts) {
      out.set(p, o);
      o += p.length;
    }
    return out;
  }
}

/** 可增长字节写入器 */
export class ByteWriter {
  private buf: Uint8Array;
  private len: number = 0;

  constructor(capacity: number) {
    this.buf = new Uint8Array(capacity > 0 ? capacity : 64);
  }

  private ensure(extra: number): void {
    if (this.len + extra <= this.buf.length) {
      return;
    }
    let cap = this.buf.length * 2;
    while (cap < this.len + extra) {
      cap *= 2;
    }
    const next = new Uint8Array(cap);
    next.set(this.buf.subarray(0, this.len), 0);
    this.buf = next;
  }

  writeByte(b: number): void {
    this.ensure(1);
    this.buf[this.len] = b & 0xff;
    this.len += 1;
  }

  writeBytes(b: Uint8Array): void {
    this.ensure(b.length);
    this.buf.set(b, this.len);
    this.len += b.length;
  }

  /** LEB128 无符号 varint */
  writeVarint(v: number): void {
    let x = v;
    for (;;) {
      let byte = x & 0x7f;
      x = x >>> 7;
      if (x !== 0) {
        byte = byte | 0x80;
      }
      this.writeByte(byte);
      if (x === 0) {
        break;
      }
    }
  }

  toBytes(): Uint8Array {
    return this.buf.subarray(0, this.len).slice();
  }
}

/** 字节读取器 */
export class ByteReader {
  readonly buf: Uint8Array;
  pos: number = 0;

  constructor(buf: Uint8Array) {
    this.buf = buf;
  }

  get remaining(): number {
    return this.buf.length - this.pos;
  }

  readByte(): number {
    if (this.remaining < 1) {
      throw new Error('WireReader: unexpected end');
    }
    const b = this.buf[this.pos];
    this.pos += 1;
    return b;
  }

  readBytes(n: number): Uint8Array {
    if (this.remaining < n) {
      throw new Error('WireReader: unexpected end');
    }
    const out = this.buf.subarray(this.pos, this.pos + n).slice();
    this.pos += n;
    return out;
  }

  readVarint(): number {
    let result = 0;
    let shift = 0;
    for (;;) {
      const b = this.readByte();
      result = result + ((b & 0x7f) * Math.pow(2, shift));
      if ((b & 0x80) === 0) {
        break;
      }
      shift += 7;
      if (shift > 49) {
        throw new Error('WireReader: varint too long');
      }
    }
    return result;
  }
}
