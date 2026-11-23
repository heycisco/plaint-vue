---
name: plaint
description: >-
  Maintains the Кляузная (plaint) Nuxt 4 app — satirical complaint form, SQLite
  storage, admin API. Use when editing this repo, plaint/v3, жалобы, форма,
  admin, server/api, SQLite, SEO pages, or Russian copy in app/constants.
---

# Кляузная (plaint) — skill проекта

## Суть продукта

Сатирический одностраничный сервис: пользователь «жалуется» через форму с театральной клиентской валидацией; текст **только** пишется в локальный SQLite. Нет e-mail, webhooks, внешних CRM. Публичный UI и тексты — **на русском**.

Подробный runbook для людей: [README.md](../../../README.md). Сводка API и файлов: [reference.md](reference.md).

## Стек и жёсткие ограничения

| | |
|---|---|
| Фреймворк | Nuxt **4**, Vue 3, Nitro preset **node-server** |
| БД | `node:sqlite` → `data/plaint.sqlite` (WAL); `package.json` → `"engines": { "node": ">=22.5.0" }` |
| Env | `NUXT_ADMIN_LOGIN`, `NUXT_ADMIN_PASSWORD`, `NUXT_PUBLIC_SITE_URL` → `runtimeConfig` в `nuxt.config.ts` |
| Стили | `app/assets/css/` (main → global, vars, fonts, nullstyle); scoped в компонентах |

Не предлагать замену SQLite на Postgres/Prisma без явного запроса. Не использовать `nuxt generate` как основной деплой (нужен API + запись в `data/`).

## Карта каталогов

```text
app/           pages, components, composables, constants, assets
server/api/    REST (complaints, admin)
server/routes/ robots.txt, sitemap.xml
server/utils/  db, adminAuth, *RateLimit
server/plugins/db.ts   — открытие БД при старте Nitro
shared/        код app + server (лимиты полей)
public/img/    статика, favicon, jpeg/webp для страниц
```

Nitro auto-import: `defineEventHandler`, `createError`, `useRuntimeConfig`, утилиты из `server/utils/` — явные импорты из `server/api/*` только при необходимости (например `#shared/...`).

## Инварианты безопасности (не ломать)

1. **`requireAdmin`** (`server/utils/adminAuth.ts`): если креды пустые → **503** «Админка не настроена», не отдавать данные без auth.
2. Админ-сессия: cookie `plaint_admin_session`, HMAC от пароля; `timingSafeEqual` для логина/токена.
3. **`POST /api/complaints`**: `assertComplaintAllowed` + `recordComplaintAttempt` (5 запросов / IP / 15 мин).
4. Логин админки: `loginRateLimit` (5 ошибок → блок 15 мин); `Retry-After` через `setResponseHeader`, не через `createError({ headers })`.
5. Не коммитить `.env`, `data/*.sqlite*`.

## Лимиты полей жалобы

Единый источник: **`shared/complaintLimits.ts`**

- Имя: макс. **28** (`COMPLAINT_NAME_MAX`)
- Текст: макс. **600** (`COMPLAINT_BODY_MAX`)

**API** (`server/api/complaints.post.ts`): только непустой `body` после trim + верхние пределы. **Минимум длины (≥ 6 символов)** и сценарии диалогов — только **`app/components/PlaintForm.vue`** + `app/constants/content.ts` (`dialogVariants`). При изменении лимитов: обновить shared-константы, API, `maxlength` в форме, README, при необходимости диалоги.

## Паттерны при разработке

### Новая страница

1. `app/pages/<name>.vue`, при необходимости `usePageSeo` из `app/composables/usePageSeo.ts` + описание в `app/constants/seo.ts`.
2. Служебные страницы — `noindex: true`.
3. Оболочка уже в `app/app.vue` → `AppShell`; не дублировать layout без причины.

### Новый API-маршрут

- Файл в `server/api/` (именование Nitro: `*.get.ts`, `*.post.ts`, `[id].delete.ts`).
- Ошибки: `createError({ statusCode, statusMessage })`, сообщения **по-русски**, как в существующих handlers.
- Админские маршруты: первой строкой `requireAdmin(event)`.

### Тексты UI

- Копирайт формы/главной: `app/constants/content.ts`.
- SEO-строки: `app/constants/seo.ts`; не хардкодить длинные description в страницах без нужды.

### Компоненты

- Кнопки/ссылки: `PlaintBtn.vue` (`to` → `NuxtLink`, иначе `button`).
- Сохранять тон (сатира, «товарищ», GOST/Trixie шрифты в CSS) — не «причесывать» под корпоративный UI без запроса.

### TypeScript / useHead

- `npm run typecheck` перед завершением нетривиальных правок.
- В `useHead` / `useSeoMeta`: литералы `as const` для `rel: 'canonical'`, `type: 'application/ld+json'`.

## Проверка после изменений

```bash
npm run build          # обязательно при правках server/ или nuxt.config
npm run typecheck      # при правках .ts / vue script setup
```

Линтера в `package.json` нет — не добавлять ESLint без запроса.

## Частые задачи

| Задача | Куда смотреть |
|--------|----------------|
| Список/создание/удаление жалоб | `server/utils/db.ts`, API complaints |
| Админ UI | `app/pages/admin.vue` |
| Отправка с формы | `app/pages/form.vue` → `PlaintForm.vue` → `POST /api/complaints` |
| SEO / sitemap / robots | `usePageSeo`, `server/routes/*.get.ts` |
| Миграция схемы SQLite | `migrateSchema` / `rebuildComplaintsTable` в `db.ts` — менять осторожно, с сохранением данных |

## Стиль диффа (от пользователя)

Минимальный scope; без лишней абстракции; совпадать с существующим кодом; коммиты и PR — только по явной просьбе; README обновлять, если меняются API, env, лимиты или деплой.

## Дополнительно

- [reference.md](reference.md) — маршруты, API, env, rate limits
- [README.md](../../../README.md) — установка, продакшен, бэкап БД