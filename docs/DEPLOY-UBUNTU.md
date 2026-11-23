# Деплой на Ubuntu (git + GitHub Actions)

Поток: разработка → push в `main` на GitHub → **CI** (typecheck + build) → **Deploy** по SSH: `git fetch` + `deploy/deploy.sh` (сборка на сервере и перезапуск systemd).

Репозиторий: [heycisco/plaint-vue](https://github.com/heycisco/plaint-vue).

## Требования

- Ubuntu 22.04/24.04 LTS (или совместимый Debian)
- Node.js **≥ 22.5** (нужен встроенный `node:sqlite`)
- Домен с DNS на IP сервера (для HTTPS и `secure` cookie админки)
- Отдельный UNIX-пользователь для приложения (ниже — `plaint`)

## 1. Пользователь и каталог

```bash
sudo adduser --disabled-password --gecos "" plaint
sudo mkdir -p /var/www/plaint
sudo chown plaint:plaint /var/www/plaint
```

## 2. Node.js 22

Через [NodeSource](https://github.com/nodesource/distributions) (пример для 22.x):

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v   # v22.x
```

Либо `nvm` под пользователем `plaint` — главное, чтобы `node` в PATH при запуске systemd был **≥ 22.5**.

## 3. Клонирование и секреты

От имени `plaint`:

```bash
sudo -u plaint -H bash -lc '
  cd /var/www/plaint
  git clone https://github.com/heycisco/plaint-vue.git .
  cp .env.example .env
  chmod 600 .env
'
```

Отредактируйте `/var/www/plaint/.env`:

| Переменная | Назначение |
|------------|------------|
| `NUXT_ADMIN_LOGIN` | Логин админки |
| `NUXT_ADMIN_PASSWORD` | Пароль (длинный, случайный) |
| `NUXT_PUBLIC_SITE_URL` | Публичный URL без слэша, например `https://plaint.starchenkov.pro` |

Каталог `data/` создаётся при первом запуске; права на запись нужны пользователю `plaint`.

Первая сборка вручную:

```bash
sudo -u plaint -H bash -lc 'cd /var/www/plaint && npm ci && npm run build'
```

## 4. systemd

```bash
sudo cp /var/www/plaint/deploy/plaint.service /etc/systemd/system/plaint.service
# При другом пути — поправьте WorkingDirectory, EnvironmentFile, User в unit-файле
sudo systemctl daemon-reload
sudo systemctl enable --now plaint
sudo systemctl status plaint
```

Логи: `journalctl -u plaint -f`.

Перезапуск после ручного обновления кода: `sudo /var/www/plaint/deploy/deploy.sh` (скрипт сам вызовет `systemctl restart`).

### Sudo без пароля только для рестарта (для CI)

Пользователь деплоя должен иметь право перезапускать службу. Создайте файл `/etc/sudoers.d/plaint-deploy` (замените `deploy` на вашего SSH-пользователя, если это не `plaint`):

```text
deploy ALL=(root) NOPASSWD: /bin/systemctl restart plaint
```

Если деплой идёт под тем же пользователем `plaint`, который владеет unit без sudo для restart — используйте `loginctl enable-linger` и user systemd, либо дайте NOPASSWD как выше для пользователя, от которого крутится GitHub Actions SSH.

Практичный вариант: SSH заходит как `plaint`, unit тоже `User=plaint`, а в `deploy.sh` — `systemctl --user restart plaint` с включённым lingering. Для простоты в инструкции ниже SSH = пользователь `plaint` + sudoers на `systemctl restart plaint`.

## 5. nginx и HTTPS

```bash
sudo apt-get install -y nginx certbot python3-certbot-nginx
sudo cp /var/www/plaint/deploy/nginx-plaint.conf.example /etc/nginx/sites-available/plaint
# Отредактируйте server_name и пути SSL
sudo ln -s /etc/nginx/sites-available/plaint /etc/nginx/sites-enabled/
sudo nginx -t
sudo certbot --nginx -d ваш-домен.example
sudo systemctl reload nginx
```

Проверка: сайт открывается по HTTPS, `NUXT_PUBLIC_SITE_URL` совпадает с доменом.

## 6. SSH-ключ для GitHub Actions

На **своей машине** (или на сервере для ключа только деплоя):

```bash
ssh-keygen -t ed25519 -C "github-actions-plaint" -f ./plaint-deploy -N ""
```

На сервере в `~/.ssh/authorized_keys` пользователя, под которым идёт деплой (например `plaint`):

```text
<содержимое plaint-deploy.pub>
```

Приватный ключ `plaint-deploy` **не** кладите на сервер — только в секреты GitHub.

## 7. Секреты и окружение в GitHub

Репозиторий → **Settings → Secrets and variables → Actions**:

| Секрет | Пример |
|--------|--------|
| `DEPLOY_HOST` | IP или домен сервера |
| `DEPLOY_USER` | `plaint` |
| `DEPLOY_SSH_KEY` | приватный ключ (весь PEM/OpenSSH) |
| `DEPLOY_PATH` | `/var/www/plaint` |
| `DEPLOY_PORT` | необязательно, по умолчанию 22 |

**Settings → Environments →** создайте `production` (workflow `deploy.yml` ссылается на него). Туда же можно вынести секреты и включить required reviewers при желании.

После push в `main` в Actions появятся **CI** и **Deploy**. Ручной деплой: **Actions → Deploy → Run workflow**.

Workflow deploy по умолчанию срабатывает только для репозитория `heycisco/plaint-vue` (защита от форков). При форке измените условие `if` в `.github/workflows/deploy.yml`.

## 8. Обновление без CI (вручную на сервере)

```bash
sudo -u plaint -H bash -lc '
  cd /var/www/plaint
  git pull --ff-only origin main
  ./deploy/deploy.sh
'
```

## 9. Резервное копирование SQLite

База: `/var/www/plaint/data/plaint.sqlite` (+ файлы WAL при активной нагрузке).

```bash
sudo -u plaint sqlite3 /var/www/plaint/data/plaint.sqlite ".backup '/var/backups/plaint-$(date +%F).sqlite'"
```

Настройте cron; перед мажорным деплоем — бэкап по желанию.

## 10. Чеклист после установки

- [ ] `curl -sI https://ваш-домен/` → 200
- [ ] `/form` отправляет жалобу
- [ ] `/admin` входит с паролем из `.env`
- [ ] `journalctl -u plaint` без ошибок SQLite/permission
- [ ] GitHub Actions: CI зелёный, Deploy успешен

## Устранение неполадок

| Симптом | Что проверить |
|---------|----------------|
| 503 в админке | Пустые `NUXT_ADMIN_*` в `.env`, перезапуск после правки |
| EACCES на `data/` | `chown -R plaint:plaint /var/www/plaint/data` |
| Deploy падает на `npm ci` | Версия Node на сервере, место на диске |
| Cookie админки не держится | HTTPS, `NUXT_PUBLIC_SITE_URL`, `X-Forwarded-Proto` в nginx |
| CI OK, Deploy не запускается | Секреты, environment `production`, условие `if` для репозитория |

Общие сведения о приложении и API — в [README.md](../README.md).