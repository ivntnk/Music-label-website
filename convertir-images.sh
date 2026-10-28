#!/usr/bin/env bash

set -euo pipefail
cd "$(dirname "$0")"

TAILLE=500
QUALITE=85
SOURCE="images/originaux"
SORTIE="images"

mkdir -p "$SOURCE" "$SORTIE"

if command -v magick >/dev/null 2>&1; then
  OUTIL="magick"
elif command -v convert >/dev/null 2>&1 && convert -version 2>/dev/null | grep -qi imagemagick; then
  OUTIL="convert"
elif command -v ffmpeg >/dev/null 2>&1; then
  OUTIL="ffmpeg"
else
  echo "Erreur : installe ImageMagick (https://imagemagick.org) ou ffmpeg, puis relance le script."
  exit 1
fi

shopt -s nullglob nocaseglob
fichiers=("$SOURCE"/*.jpg "$SOURCE"/*.jpeg "$SOURCE"/*.png "$SOURCE"/*.webp)

if [ ${#fichiers[@]} -eq 0 ]; then
  echo "Aucune image trouvée dans $SOURCE/"
  exit 0
fi

for f in "${fichiers[@]}"; do
  nom="$(basename "${f%.*}")"
  cible="$SORTIE/$nom.webp"

  if [ "$OUTIL" = "ffmpeg" ]; then
    ffmpeg -loglevel error -y -i "$f" \
      -vf "scale=${TAILLE}:${TAILLE}:force_original_aspect_ratio=increase,crop=${TAILLE}:${TAILLE}" \
      -frames:v 1 -c:v libwebp -quality "$QUALITE" "$cible"
  else
    "$OUTIL" "$f" -auto-orient \
      -resize "${TAILLE}x${TAILLE}^" -gravity center -extent "${TAILLE}x${TAILLE}" \
      -strip -quality "$QUALITE" "$cible"
  fi

  echo "OK  $f  ->  $cible (${TAILLE}x${TAILLE})"
done

echo "Terminé."

