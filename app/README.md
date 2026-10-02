# ZCode Remote（鸿蒙原生 APP）

非官方的 ZCode 桌面端"移动端远程控制"原生鸿蒙伴侣应用：**扫码绑定一次，之后打开 APP 即可直连查看对话与任务状态**，不再需要反复扫码、不再打开浏览器。错误信息均带分类标签，便于自行排障。

- 协议: 直接实现 ZCode 云端中继协议（WebSocket + HMAC 挑战-应答 + RPC 通道），纯原生 UI，无 WebView
- 系统要求: HarmonyOS NEXT / 5.x（API 12+）
- 协议规范: 见 [`../research/protocol.md`](../research/protocol.md)

## 功能

| 页面 | 功能 |
|---|---|
| 绑定页 | 相机扫码 / 相册识别 / 粘贴链接，三种方式完成一次性绑定（ZCode 官方 logo） |
| 主页 | 工作区任务列表（状态徽章：运行中/待确认/失败/已完成），实时推送刷新 |
| 会话页 | 读取任务快照渲染对话（用户/AI 消息、代码块），每 3s 增量轮询；支持原始 JSON 视图 |
| 设置页 | 绑定信息、外观切换（跟随系统/日间/夜间）、重新连接、解绑重扫 |

- **主题**：完整日间/夜间双主题（资源级适配），默认跟随系统，可在设置中手动切换并持久化。
- **沉浸式**：状态栏与底部导航条与页面背景同色，深浅模式自动跟随。

## 构建与安装（DevEco Studio）

> **当前状态（2026-10-02）**：命令行构建已打通（`hvigorw assembleHap` 通过，产物 `entry/build/default/outputs/default/`）。
> **真机安装需要一次华为账号签名**：HarmonyOS 7 真机仅信任华为签发的调试证书（已实测：用 SDK 自带的 OpenHarmony 社区调试证书签名后安装被拒 `9568257 fail to verify pkcs7 file`，属华为签名策略，无法绕过）。
> 请按下面第 2 步在 DevEco 中完成一次性自动签名（约 2 分钟），之后用 `build-and-install.sh` 即可全自动构建+安装。

1. **打开工程**: DevEco Studio → File → Open → 选择本目录（`app/`）→ 等待同步完成。
2. **一次性自动签名**（需要华为开发者账号，个人免费档即可）:
   - 点击 DevEco Studio 右上角头像 → 登录华为账号；
   - File → **Project Structure** → 左侧 **Signing Configs** → 勾选 **Automatically generate signature** → OK。
   - IDE 会自动向 AGC 申请调试证书与 Profile（含本机设备 UDID），材料存于 `C:/Users/<用户名>/.ohos/config/`，并自动写入 `build-profile.json5` 的 `signingConfigs`。
3. **构建 + 安装**: 双击或在 Git Bash 运行 `./build-and-install.sh`（构建 → hdc 安装 → 启动）；也可直接在 IDE 里点 Run ▶。
4. 构建 HAP 产物: `entry/build/default/outputs/default/`（配置签名后产物为已签名 HAP）。

> 命令行构建环境（已配置于本地 `local.properties`）：`DEVECO_SDK_HOME` 指向 DevEco 自带 SDK，`NODE_HOME` 指向自带 Node。手动签名材料与脚本位于 `signing/`（备查，真机不可用）。

## 使用流程

### 一次性绑定（仅需一次）
1. 桌面端 ZCode 打开"移动端远程控制"（会显示二维码）。
2. APP 首页点「扫码绑定」扫桌面端二维码（或截图二维码后粘贴链接内容）。
3. 提示"已绑定"即完成。凭证（配对密钥）保存在手机加密资产库中。

### 日常使用
- 打开 APP → 自动连接 → 主页直接显示桌面端的任务列表与状态。
- 桌面端远程控制开关只需保持开启；**电脑重启、ZCode 重启均无需重新扫码**（凭证长期有效）。
- 点任务进入会话详情查看对话内容；JSON 按钮可切换原始数据视图。

### 需要重新扫码的情况
- 桌面端点了"重置配对"（旧凭证失效，APP 会提示"凭证失效"）。
- 换一台电脑绑定。

## 端到端验证

开发期可用探针脚本独立验证协议连通性（无需手机）：

```bash
cd ../probe
node probe.mjs          # 桌面端远程控制开启时运行：应看到 pair_status=matched 并打印任务列表样例
node test_protocol.js   # 协议层单元测试（序列化/帧编解码/HMAC）
```

## 工程结构

```
app/
├── AppScope/                     # 应用级配置
└── entry/src/main/
    ├── module.json5              # 权限: INTERNET / CAMERA
    └── ets/
        ├── entryability/         # 入口 Ability
        ├── pages/                # Index(绑定+主页) / SessionPage / SettingsPage
        ├── protocol/             # 协议层（逆向自 ZCode 桌面端与官方 Web 端）
        │   ├── Bytes.ets         #   UTF-8/Base64/varint
        │   ├── Crc32.ets         #   CRC-32（帧校验）
        │   ├── WireSerializer.ets#   桥内 RPC 序列化（tagged 二进制）
        │   ├── FrameCodec.ets    #   rpc-frame 分帧/组装（可靠传输层）
        │   ├── RelayClient.ets   #   中继 WebSocket（鉴权/心跳/重连）
        │   ├── ChannelClient.ets #   RPC 通道（请求/响应/事件）
        │   └── BridgeSession.ets #   工作区桥会话（组合以上各层）
        ├── service/ZcodeService.ets  # 全局单例（绑定/列表/快照）
        ├── store/                # 绑定凭证（AssetStoreKit 加密）+ 二维码解析
        └── model/                # 数据模型
```

## 故障排查

APP 内所有错误带分类标签（`[分类] 细节（建议）`），对照下表：

| 分类 | 含义 | 处理 |
|---|---|---|
| `[AUTH]` 凭证被拒绝 / 会话被顶掉 | 桌面端执行过"重置配对"，或其他终端占用 | 重新扫码绑定 |
| `[DESKTOP_OFFLINE]` | 桌面端暂时离线 | 确认电脑开机、ZCode 运行、远程控制开关打开；恢复后自动重连 |
| `[TIMEOUT]` 打开桥超时 / 快照超时 | 桌面端正忙或目标工作区已关闭 | 回主页刷新后重进；会话页点"重新连接并刷新" |
| `[BRIDGE_DOWN]` | 中继链路短暂中断 | APP 会自动重建桥，无需操作 |
| `[NETWORK]` | 网络不通或中继临时故障 | 检查手机网络；私有化部署确认端点可达 |
| 列表缺任务 | 已归档任务不显示 | 桌面端取消归档即可同步显示 |
| 扫码无法调起 | 相机权限未授予 | 设置→应用→ZCode Remote→权限；或改用粘贴链接绑定 |

深入排查：`hdc shell "hilog -x | grep ZCRemote"`（TAG=ZCRemote 覆盖连接状态机、中继帧、桥与会话全链路日志）。

## 已知限制与后续扩展

- v1 为只读查看（对话 + 任务状态）；发送消息 / 审批 / 终端交互需在 RPC 层追加对应通道调用（协议已在 `research/protocol.md` 中整理）。
- 对话渲染为轻量 Markdown（代码围栏）；后续可引入完整 Markdown 渲染组件。
- 事件流（`onDynamicWorkspaceEvent` 等）未消费，列表刷新依赖桌面端推送 + 手动/下拉刷新；会话内容用 etag 轮询。
- 云端协议若升级导致字段变化，`pages/SessionPage` 的 JSON 视图可直接用于排查；协议层集中在 `protocol/`，易于跟进。
