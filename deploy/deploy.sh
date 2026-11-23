#!/usr/bin/env bash
# Сборка и перезапуск на сервере. Вызывается из GitHub Actions или вручную после git pull.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if [[ ! -f .env ]]; then
  echo "Ошибка: нет файла .env в $ROOT (скопируйте из .env.example и задайте секреты)." >&2
  exit 1
fi

export NODE_ENV=production

echo "→ npm ci"
npm ci

echo "→ npm run build"
npm run build

if systemctl is-active --quiet plaint 2>/dev/null; then
  echo "→ systemctl restart plaint"
  sudo systemctl restart plaint
elif command -v pm2 >/dev/null 2>&1 && pm2 describe plaint >/dev/null 2>&1; then
  echo "→ pm2 restart plaint"
  pm2 restart plaint
else
  echo "Предупреждение: служба plaint не найдена (systemd/pm2). Запустите приложение вручную." >&2
  exit 1
fi

echo "Готово."