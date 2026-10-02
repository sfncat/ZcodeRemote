/**
 * 标准 CRC-32（与 ZCode 桌面端 / Web 端一致）
 * 输出: 8 位小写十六进制字符串
 */
export class Crc32 {
  private static table: Uint32Array | undefined = undefined;

  private static ensureTable(): Uint32Array {
    if (Crc32.table !== undefined) {
      return Crc32.table;
    }
    const t = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) {
        c = (c & 1) !== 0 ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      }
      t[n] = c >>> 0;
    }
    Crc32.table = t;
    return t;
  }

  static hex(data: Uint8Array): string {
    const table = Crc32.ensureTable();
    let c = 0xffffffff;
    for (let i = 0; i < data.length; i++) {
      c = (table[(c ^ data[i]) & 0xff] ^ (c >>> 8)) >>> 0;
    }
    const v = ((c ^ 0xffffffff) >>> 0) as number;
    let hex = '';
    const digits = '0123456789abcdef';
    for (let i = 7; i >= 0; i--) {
      hex += digits.charAt((v >>> (i * 4)) & 0xf);
    }
    return hex;
  }
}
