// 生成应用图标 PNG（无第三方依赖，手工构造 PNG）
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

function crc32(buf) {
  let table = crc32.table;
  if (!table) {
    table = crc32.table = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      table[n] = c >>> 0;
    }
  }
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

function makePng(size, painter) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 6;  // RGBA
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) {
    const rowStart = y * (size * 4 + 1);
    raw[rowStart] = 0; // filter none
    for (let x = 0; x < size; x++) {
      const [r, g, b, a] = painter(x, y, size);
      const o = rowStart + 1 + x * 4;
      raw[o] = r; raw[o + 1] = g; raw[o + 2] = b; raw[o + 3] = a;
    }
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// 图标：深蓝底 + 圆角 + 白色"Z"字形
function iconPainter(x, y, size) {
  const cx = size / 2, cy = size / 2;
  const radius = size * 0.22;
  const inCorner = (dx, dy) => dx * dx + dy * dy > radius * radius;
  // 圆角矩形判断
  const ex = Math.max(Math.abs(x - cx) - (size / 2 - radius), 0);
  const ey = Math.max(Math.abs(y - cy) - (size / 2 - radius), 0);
  const inside = ex * ex + ey * ey <= radius * radius;
  if (!inside) return [0, 0, 0, 0];
  // Z 字形：三条笔画
  const t = size * 0.14; // 笔画宽
  const left = size * 0.28, right = size * 0.72, top = size * 0.30, bottom = size * 0.70;
  const inStroke = (x0, y0, x1, y1, w) => {
    // 线段距离
    const vx = x1 - x0, vy = y1 - y0;
    const L2 = vx * vx + vy * vy;
    let u = ((x - x0) * vx + (y - y0) * vy) / L2;
    u = Math.max(0, Math.min(1, u));
    const px = x0 + u * vx, py = y0 + u * vy;
    const dx = x - px, dy = y - py;
    return dx * dx + dy * dy <= (w / 2) * (w / 2);
  };
  const onZ = inStroke(left, top, right, top, t)
    || inStroke(right, top, left, bottom, t)
    || inStroke(left, bottom, right, bottom, t);
  return onZ ? [255, 255, 255, 255] : [24, 26, 38, 255];
}

const outDir = process.argv[2];
if (!outDir) { console.error('usage: node gen_icons.js <outputDir>'); process.exit(1); }
fs.mkdirSync(outDir, { recursive: true });
for (const size of [96, 192]) {
  fs.writeFileSync(path.join(outDir, `app_icon_${size}.png`), makePng(size, iconPainter));
}
// 统一名 app_icon.png（192）
fs.copyFileSync(path.join(outDir, 'app_icon_192.png'), path.join(outDir, 'app_icon.png'));
fs.rmSync(path.join(outDir, 'app_icon_96.png'));
fs.rmSync(path.join(outDir, 'app_icon_192.png'));
console.log('icons written to ' + outDir);
