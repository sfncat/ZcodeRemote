# APP 与网页端（remote/v4）功能对比

> 基线：ZCode 桌面端 3.14.4 云端网页版（`https://zcode.z.ai/remote/v4`），2026-10-02 对比。
> ✅=已实现并验证 🟡=部分实现 ⏳=未实现（协议已逆向，见 protocol.md）

## 核心

| 功能 | 网页端 | APP | 说明 |
|---|---|---|---|
| 一次绑定 / 打开即连 | ✅（浏览器存 URL） | ✅ | APP 凭证存加密资产库，重装/清数据才失效 |
| 任务列表（项目分组） | ✅ | ✅ | 组头=工作区名+任务数；置顶+时间序 |
| 任务状态徽章 | ✅ | ✅ | 运行中/待确认/失败/已完成/其他 |
| 对话结构化渲染 | ✅ | ✅ | parts 顺序：思考（折叠）/正文 Markdown/工具卡（可展开输入输出） |
| Markdown | ✅ 完整 | 🟡 轻量 | 标题/列表/代码块/引用/粗斜体/链接/分隔线/表格；不支持图片、任务列表、脚注 |
| 实时刷新 | ✅ 推送 | ✅ 3s 轮询+etag | 观感一致；流量略高 |
| 自动跟随最新 | ✅ | ✅ | 用户上翻即暂停跟随 |

## 交互（本轮新增）

| 功能 | 网页端 | APP | 说明 |
|---|---|---|---|
| 发送消息 | ✅ sendText | ✅ sendPrompt→session/send | 输入框+回车/按钮发送 |
| 中断生成 | ✅ stop | ✅ envelope{type:stop} | 任务运行中显示"停止生成" |
| 工具权限审批 | ✅ | ✅ resolveInteraction{optionId} | 卡片按钮直选 |
| 用户输入问答（AskUserQuestion/计划审批） | ✅ | ✅ resolveInteraction{action,content} | 选项点选 + 自由文本 + 拒绝/取消 |
| 表情/图片附件 | ✅ | ⏳ | attachment V4 协议已逆向（attachmentBegin/Chunk/Commit） |
| @引用 / 上下文引用 | ✅ context_refs | ⏳ | |
| 模式切换（plan/build/…） | ✅ | ⏳ | 通道 setMode / envelope 内 mode 已知 |
| 模型选择 | ✅ | ⏳ | setModel / modelSelection 字段已知 |
| 消息队列（排队发送） | ✅ requestedDelivery | ⏳ | 目前直接 startNow 语义 |

## 周边

| 功能 | 网页端 | APP | 说明 |
|---|---|---|---|
| 新建任务 | ✅ | ⏳ | createSession 协议已知（含 firstInput） |
| 任务改名/归档/置顶/删除 | ✅ | ⏳ | zcode-task 通道方法已列全 |
| 会话紧凑（compact）/ fork | ✅ | ⏳ | |
| 文件变更（fileChanges）视图 | ✅ | ⏳ | 快照字段已在，仅缺 UI |
| 计划（todos）/ 目标（goal）面板 | ✅ | ⏳ | 快照 plan/goalStats 字段已在 |
| 子代理（subagents）面板 | ✅ | ⏳ | |
| 后台 Bash 任务输出 | ✅ | ⏳ | backgroundBashOutputV4 |
| 主题切换 | ✅ | ✅ | 跟随系统/日间/夜间 |
| 端到端加密 | 中继 HMAC | 同 | 同一协议 |
| 原生体验（无浏览器 UI） | — | ✅ | |

## 结论

高频核心链路（看任务/看对话/发消息/中断/审批）已与网页端功能对齐；剩余差距集中在**低频管理操作**（新建/改名/归档任务）与**富输入**（附件/引用/模型选择），协议均已逆向并有方法名与参数结构记录在 `research/protocol.md`，需要时逐个补齐即可。
