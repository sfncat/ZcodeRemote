#!/usr/bin/env bash
# 局域网 HAP 分发服务：手机浏览器访问打出的地址即可下载安装
# 用法: ./serve-hap.sh   （Ctrl+C 停止）
cd "$(dirname "$0")/entry/build/default/outputs/default" || exit 1
HAP=$(ls -t *.hap | head -1)
echo "=============================================="
echo " 分发文件: $HAP"
PC_IP=$(ipconfig 2>/dev/null | grep -A 5 "Wireless\|WLAN\|以太网" | grep -oE "192\.168\.[0-9]+\.[0-9]+" | head -1)
echo " 手机浏览器访问:  http://${PC_IP:-<PC_IP>}:8899/$HAP"
echo " （手机需与电脑同一 Wi-Fi；首次启动如弹防火墙授权请点'允许'）"
echo " 下载完成后在手机'文件管理'或通知栏里点击该 .hap 安装"
echo " （若提示禁止安装，到 设置→更多安全设置 里临时允许'外部来源应用'）"
echo "=============================================="
python -m http.server 8899 --bind 0.0.0.0
