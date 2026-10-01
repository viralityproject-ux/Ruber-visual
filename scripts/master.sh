#!/usr/bin/env bash
# Final audio master for a rendered MP4: peak limiter + two-pass loudness normalisation
# to -14 LUFS / -1 dBTP (social media target). The video stream is copied untouched.
# Usage: bash scripts/master.sh out/ruber-visual-16x9.mp4 out/ruber-visual-16x9-master.mp4
set -euo pipefail
in="$1"
out="$2"
pre="alimiter=limit=0.89:attack=3:release=60:level=false"
json=$(ffmpeg -hide_banner -nostats -i "$in" -af "$pre,loudnorm=I=-14:TP=-1:LRA=11:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
read -r mi mtp mlra mth off < <(node -e 'const d=JSON.parse(require("fs").readFileSync(0,"utf8"));console.log(d.input_i,d.input_tp,d.input_lra,d.input_thresh,d.target_offset)' <<<"$json")
ffmpeg -hide_banner -v error -y -i "$in" -c:v copy \
  -af "$pre,loudnorm=I=-14:TP=-1:LRA=11:measured_I=$mi:measured_TP=$mtp:measured_LRA=$mlra:measured_thresh=$mth:offset=$off:linear=true,aresample=48000" \
  -c:a aac -b:a 256k -movflags +faststart "$out"
echo "mastered -> $out"
