#!/usr/bin/env bash
# Bouwt de site en voegt de PHP-backend samen tot één deploy-map.
# Upload daarna de INHOUD van ./deploy naar de htdocs-map van STRATO.
set -euo pipefail
cd "$(dirname "$0")/.."

npm run build

rm -rf deploy
mkdir -p deploy
cp -r dist/. deploy/
cp -r backend/. deploy/

echo
echo "✅ Klaar: ./deploy bevat de volledige website (frontend + PHP)."
echo "   Upload de INHOUD van ./deploy naar de htdocs-map van STRATO."
