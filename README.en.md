# ZcodeRemote

> An unofficial HarmonyOS NEXT companion client for [ZCode](https://github.com/zai-org/ZCode) — **scan once, connect forever**: watch your desktop sessions and tasks in real time, send messages, and approve tool permissions from your phone.

> ⚠️ This project is not affiliated with Z.ai. The protocol was reverse-engineered from the open-source ZCode client (Apache-2.0); desktop updates may change the protocol — see [Troubleshooting](#-troubleshooting).

---

## 📖 What Is This

ZCode's desktop client is powerful, but once you leave your desk you're out of the loop — long-running tasks out of reach, no way to chime in. **ZcodeRemote** brings the desktop's remote-control capability to your HarmonyOS phone. Scan the desktop's "mobile remote control" QR code **once**; the credential is stored in the system keystore (AssetStoreKit), and from then on the app connects automatically: the task list syncs grouped by project, sessions render structured Markdown, and you can send messages, interrupt generations, approve tool permissions — even switch models and thinking strength on the fly. Built for heavy ZCode users who need to "keep an eye on tasks and jump in" away from the keyboard.

## 🚀 Quick Start

**Usage (3-step pairing)**:

1. Open ZCode's "mobile remote control" on the desktop to show a QR code
2. In the app, tap "Scan to pair" (screenshot recognition or pasting the QR link also works) and confirm
3. Done. The app auto-connects from now on — no re-scan needed after a PC reboot

> Re-scan required only when the desktop runs "reset pairing" or you switch to a different computer.

**Build (DevEco Studio)**:

1. Open the `app/` directory and let it sync (written for API 12+; newer SDKs just follow the upgrade prompts)
2. `File → Project Structure → Signing Configs → Automatically generate signature` (a free personal Huawei developer account is enough)
3. Enable USB debugging, connect the phone, and hit Run ▶; or run `./build-and-install.sh`
4. Output: `app/entry/build/default/outputs/default/`

You can also use `./serve-hap.sh` to distribute the HAP over your LAN for browser download and install.

## ✨ Features

- **Pair once, connect forever**: the pairing credential lives in the system keystore (AssetStoreKit) — open the app and you're connected
- **Task list**: grouped by project (collapsible), real-time sync of unarchived tasks; standalone chats grouped under "Tasks" at the bottom
- **Session viewer**: structured rendering (Markdown, collapsible reasoning cards, tool-call cards), context-usage progress bar, auto-follow latest messages
- **Remote interaction**: send messages, stop generation, approve tool permissions, answer user-input prompts (AskUserQuestion / plan approval)
- **Model switching**: switch model / thinking strength (low/high/max) / mode (Build/Plan/Edit/Yolo) live, synced with the desktop
- **Day/night theme**: follows the system or toggled manually

## 📱 Compatibility & Requirements

| Platform | Status |
|---|---|
| HarmonyOS NEXT / 5.x+ (API 12+, tested on HarmonyOS 7.0) | ✅ The app in this repo |
| iOS / Android / Desktop | ❌ No client, but [`research/protocol.md`](research/protocol.md) is a complete protocol spec and [`probe/test_protocol.js`](probe/test_protocol.js) is a cross-platform reference implementation (runs anywhere with Node.js) — ports welcome |

Server requirement: desktop ZCode **3.14.4+** (remote/v4 protocol). The protocol relays over `wss://<host>/ws` and supports self-hosted deployments (the domain in the pairing link is the connection endpoint).

## 🔒 Security & Privacy

- The pairing credential (`hash`) is stored in the phone's **system keystore** (AssetStoreKit) and destroyed on uninstall
- Relay communication uses an HMAC-SHA256 challenge–response handshake; plaintext keys are never uploaded
- No telemetry or data collection of any kind — all traffic goes only through the relay you chose
- The QR code content is equivalent to the credential: **never share screenshots**; if leaked, run "reset pairing" on the desktop to invalidate it immediately
- The app requests only two permissions: `INTERNET` and `CAMERA`

## 🔍 Troubleshooting

Every in-app error carries a category tag (e.g. `[AUTH]`, `[DESKTOP_OFFLINE]`) — match it against the table below. For deeper debugging: `hdc shell "hilog -x | grep ZCRemote"`.

| Symptom / error tag | Cause & fix |
|---|---|
| Stuck on "Waiting for desktop" | The desktop's remote-control switch is off; it auto-pairs ~10s after turning it on |
| `[AUTH]` credential rejected | The desktop ran "reset pairing" — scan again to re-pair |
| `[DESKTOP_OFFLINE]` | Desktop temporarily offline; reconnects automatically when it's back |
| `[TIMEOUT]` / "Auto refresh paused" | The desktop is busy or the workspace is closed; tap "Reconnect & refresh" |
| Missing tasks in the list | Archived tasks are hidden; tasks from other windows need remote control enabled there |
| Context denominator ≠ model spec | The session layer may register the compaction threshold; add your model's nominal window to `MODEL_CONTEXT_WINDOW_OVERRIDES` in `service/ZcodeService.ets` |

## 🧩 Project Structure

| Directory | Contents |
|---|---|
| [`app/`](app/) | The HarmonyOS app (DevEco Studio / ArkTS); see its README for build docs |
| [`research/`](research/) | Protocol reverse-engineering results: full spec (framing layers, auth, RPC channels, method signatures) |
| [`probe/`](probe/) | Node probes & tools: connection tests, snapshot capture, protocol unit tests; includes upstream ZCode code slices (see [NOTICE.md](NOTICE.md)) |

## 📜 License & Credits

- Protocol reverse-engineered from the open-source [zai-org/ZCode](https://github.com/zai-org/ZCode) (Apache-2.0)
- This project is released under the [MIT](LICENSE) license; upstream code slices in `probe/` follow the upstream license (see [NOTICE.md](NOTICE.md))
