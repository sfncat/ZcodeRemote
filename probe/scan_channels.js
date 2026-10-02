// 查看 readTask / loadMore / onConversation 的调用上下文
const fs = require('fs');
const s = fs.readFileSync('spa/index-B-ilXaCQ.js', 'utf8');
for (const [w, at] of [['readTask', 139996], ['readTask', 142251], ['readTask', 143320], ['loadMore', 1750235], ['onConversation', 2091305]]) {
  console.log('=== ' + w + ' @ ' + at);
  console.log(s.slice(Math.max(0, at - 250), at + 250).replace(/\n/g, ' '));
  console.log();
}
