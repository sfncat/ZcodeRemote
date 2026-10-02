// 解析 SPA bundle 内 minified 符号: 给定 index 中的本地名，找到定义
// node resolve_sym.js <file> <localName>
const fs = require('fs');
const path = require('path');
const SPA = path.join(__dirname, 'spa');

function resolveIn(file, exportName, depth, seen) {
  if (depth > 6 || seen.has(file + ':' + exportName)) return;
  seen.add(file + ':' + exportName);
  const s = fs.readFileSync(path.join(SPA, file), 'utf8');
  // 在 export{...} 里找 exportName -> local
  const marker = 'as ' + exportName + ',';
  let idx = s.indexOf(marker);
  if (idx === -1) {
    const m2 = 'as ' + exportName + '}';
    idx = s.indexOf(m2);
  }
  if (idx === -1) {
    console.log('  '.repeat(depth) + `${file}: export '${exportName}' not found`);
    return;
  }
  let start = idx;
  while (start > 0 && s[start] !== ',' && s[start] !== '{') start--;
  const local = s.slice(start + 1, idx).trim().replace(/^export\{/, '');
  console.log('  '.repeat(depth) + `${file}: export ${exportName} = local ${local}`);
  // 本文件定义?
  for (const p of [`function ${local}(`, `var ${local}=`, `let ${local}=`, `const ${local}=`, `class ${local}`, ` ${local}=class`]) {
    const i = s.indexOf(p);
    if (i !== -1) {
      console.log('  '.repeat(depth) + `  DEFINED @${i}: ${s.slice(i, i + 400).replace(/\n/g, ' ')}`);
      return;
    }
  }
  // import 再解析
  const ipat = 'as ' + local + ',';
  let ipos = s.indexOf(ipat);
  if (ipos === -1) {
    console.log('  '.repeat(depth) + `  no import found for ${local}`);
    return;
  }
  const istart = s.lastIndexOf('import{', ipos);
  let lstart = ipos;
  while (lstart > istart && s[lstart] !== ',' && s[lstart] !== '{') lstart--;
  const importLocal = s.slice(lstart + 1, ipos).trim();
  const fromIdx = s.indexOf('from"', ipos);
  const fromFile = s.slice(fromIdx + 6, s.indexOf('"', fromIdx + 6)).replace('./', '');
  console.log('  '.repeat(depth) + `  imported as ${importLocal} from ${fromFile}`);
  resolveIn(fromFile, importLocal, depth + 1, seen);
}

resolveIn(process.argv[2], process.argv[3], 0, new Set());
