# probe — 协议探针与工具

Node.js 工具集，用于验证与调试 ZCode 远程控制协议（任何有 Node.js ≥ 22 的平台均可运行，亦作为其他平台客户端实现的参考代码）。

| 文件 | 用途 |
|---|---|
| `probe.mjs` | 连接测试：读取本机 ZCode 凭证 → 连接中继 → 配对 → 拉取任务列表样例 |
| `probe2.mjs` | 抓取任务快照完整样本（分析消息 parts/tools 结构） |
| `probe3.mjs` | 全量任务列表验证（listGroupedTaskViewStructure / listTasks） |
| `probe4.mjs` | readSession 完整返回（模型元数据 / projection） |
| `test_protocol.js` | 协议层单元测试：wire 序列化字节布局、rpc-frame 编解码往返、crc32、HMAC 证明公式 |
| `gen_icons.js` | 生成占位应用图标 PNG |
| `main/`、`host/`、`spa/`、`renderer/`、`research/extract_*.js` | ZCode 桌面端/云端代码切片，仅作协议研究参考——出处与许可见根目录 [NOTICE.md](../NOTICE.md) |

## 运行

```bash
node test_protocol.js        # 无需连接，纯单测
node probe.mjs               # 需桌面端开启远程控制（会短暂顶掉手机连接）
```

探针从本机 ZCode 数据目录（`~/.zcode/v2/`）读取配对凭证，不联网上传任何信息。
