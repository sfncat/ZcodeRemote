#!/usr/bin/env bash
# ZCode Remote —— 一键构建 + 签名产物 + 安装到真机
# 前置条件:
#   1. DevEco Studio 已安装（默认 D:/Program Files/DevEco Studio）
#   2. 已在 DevEco 中完成"自动生成签名"（File → Project Structure → Signing Configs）
#      —— 该步骤会把签名材料写入 build-profile.json5，之后本脚本构建出的即为已签名 HAP
#   3. 手机已连接（开发者模式 + USB调试）
set -e
cd "$(dirname "$0")"

DS="${DEVECO_HOME:-D:/Program Files/DevEco Studio}"
export NODE_HOME="$DS/tools/node"
export DEVECO_SDK_HOME="$DS/sdk"
HVIGOR="$DS/tools/hvigor/bin/hvigorw.bat"
HDC="$DS/sdk/default/openharmony/toolchains/hdc.exe"
BUNDLE="com.zcode.remote"

echo "==> 1/3 构建 HAP"
"$HVIGOR" --no-daemon assembleHap

echo "==> 2/3 定位产物"
HAP=$(find entry/build -name "*.hap" -newermt "-10 minutes" | sort | tail -1)
if [ -z "$HAP" ]; then
  echo "未找到 HAP 产物"; exit 1
fi
echo "    $HAP"

echo "==> 3/3 安装到设备并启动"
"$HDC" install -r "$HAP"
"$HDC" shell aa start -a EntryAbility -b "$BUNDLE" || true
echo "==> 完成"
