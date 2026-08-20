#!/usr/bin/env bash
# Generate every image and video the ten pages need, then squeeze them for the web.
#   ./scripts/gen-assets.sh images   -> public/a/<n>/<slug>.jpg
#   ./scripts/gen-assets.sh videos   -> public/a/<n>/<slug>.mp4 + -poster.jpg
# Re-running skips anything that already exists, so it is safe to retry.
set -uo pipefail
cd "$(dirname "$0")/.."

IMG_MODEL=fal-ai/flux/dev
VID_MODEL=fal-ai/bytedance/seedance/v1/lite/text-to-video
IMG_PAR=6
VID_PAR=5

gen_image() {
  local slug="$1" size="$2" prompt="$3"
  local out="public/a/${slug}.jpg"
  [ -s "$out" ] && { echo "skip  $out"; return 0; }
  mkdir -p "$(dirname "$out")"
  local raw="/tmp/raw-${slug//\//-}.jpg"
  if ! beckett image "$prompt" --out "$raw" --size "$size" --model "$IMG_MODEL" >/dev/null 2>&1; then
    echo "FAIL  $out"; return 1
  fi
  # Strip metadata, cap the long edge, land around 200KB.
  ffmpeg -y -loglevel error -i "$raw" -vf "scale='min(1600,iw)':-2" -q:v 6 -map_metadata -1 "$out" </dev/null || return 1
  rm -f "$raw"
  echo "ok    $out  $(du -h "$out" | cut -f1)"
}

gen_video() {
  local slug="$1" prompt="$2"
  local out="public/a/${slug}.mp4"
  [ -s "$out" ] && { echo "skip  $out"; return 0; }
  mkdir -p "$(dirname "$out")"
  local raw="/tmp/raw-${slug//\//-}.mp4"
  if ! beckett image video "$prompt" --out "$raw" --model "$VID_MODEL" >/dev/null 2>&1; then
    echo "FAIL  $out"; return 1
  fi
  # Silent, 960px wide, faststart so it starts painting immediately.
  ffmpeg -y -loglevel error -i "$raw" -an \
    -vf "scale=960:-2" -c:v libx264 -profile:v main -pix_fmt yuv420p \
    -crf 31 -preset slow -movflags +faststart "$out" </dev/null || return 1
  # Poster frame so a paused or blocked video never shows an empty box.
  ffmpeg -y -loglevel error -ss 0.5 -i "$out" -frames:v 1 -q:v 6 "public/a/${slug}-poster.jpg" </dev/null
  rm -f "$raw"
  echo "ok    $out  $(du -h "$out" | cut -f1)"
}

throttle() { while [ "$(jobs -rp | wc -l)" -ge "$1" ]; do wait -n; done; }

do_images() {
  while IFS=$'\t' read -r slug _kind size prompt; do
    [ -z "${slug:-}" ] && continue
    throttle "$IMG_PAR"
    gen_image "$slug" "$size" "$prompt" &
  done < scripts/assets.tsv
  wait
}

do_videos() {
  while IFS=$'\t' read -r slug prompt; do
    [ -z "${slug:-}" ] && continue
    throttle "$VID_PAR"
    gen_video "$slug" "$prompt" &
  done < scripts/videos.tsv
  wait
}

case "${1:-all}" in
  images) do_images ;;
  videos) do_videos ;;
  all) do_images; do_videos ;;
  *) echo "usage: $0 [images|videos|all]" >&2; exit 2 ;;
esac
