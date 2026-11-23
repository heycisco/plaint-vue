# Plaint — справочник для агента

## Переменные окружения

| Переменная | runtimeConfig | Назначение |
|------------|---------------|------------|
| `NUXT_ADMIN_LOGIN` | `adminLogin` | Логин админки |
| `NUXT_ADMIN_PASSWORD` | `adminPassword` | Пароль + ключ HMAC-сессии |
| `NUXT_PUBLIC_SITE_URL` | `public.siteUrl` | Canonical, OG, sitemap (без `/` в конце) |

## Страницы

| Path | Файл | Примечание |
|------|------|------------|
| `/` | `app/pages/index.vue` | JSON-LD WebSite |
| `/form` | `app/pages/form.vue` + `PlaintForm.vue` | POST complaints |
| `/sent` | `app/pages/sent.vue` | noindex |
| `/admin` | `app/pages/admin.vue` | noindex, cookie auth |
| ошибки | `app/error.vue` | 404 / generic |

## HTTP API

| Method | Path | Auth | Файл |
|--------|------|------|------|
| POST | `/api/complaints` | нет | `server/api/complaints.post.ts` |
| GET | `/api/complaints` | admin cookie | `server/api/complaints.get.ts` |
| DELETE | `/api/complaints/:id` | admin cookie | `server/api/complaints/[id].delete.ts` |
| POST | `/api/admin/login` | нет | `server/api/admin/login.post.ts` |
| POST | `/api/admin/logout` | нет | `server/api/admin/logout.post.ts` |

### POST `/api/complaints` body

```json
{ "body": "string (required)", "name": "string | omit" }
```

Ответ: `{ id, name, body, created_at }`.

### Rate limits (in-memory, per IP)

| Зона | Лимит | Модуль |
|------|-------|--------|
| Жалобы | 5 / 15 мин, любые POST | `server/utils/complaintRateLimit.ts` |
| Логин | 5 ошибок / 15 мин → lock 15 мин | `server/utils/loginRateLimit.ts` |

## SQLite

- Путь: `join(process.cwd(), 'data', 'plaint.sqlite')`
- Singleton: `globalThis.__plaintDb` в `useDatabase()`
- Таблица: `complaints (id, name, body, created_at)`

## Ключевые файлы

| Область | Файлы |
|---------|--------|
| Лимиты | `shared/complaintLimits.ts` |
| Auth | `server/utils/adminAuth.ts` — `ADMIN_SESSION_COOKIE`, `requireAdmin` |
| Диалоги формы | `app/constants/content.ts` — `dialogVariants`, `formLabels` |
| SEO | `app/constants/seo.ts`, `app/composables/usePageSeo.ts` |
| Стили | `app/assets/css/main.css` (entry), `global.css`, `vars.css` |

## npm scripts

`dev` · `build` · `preview` · `generate` · `typecheck` (`nuxt prepare && nuxi typecheck`)

## Импорты shared из server

```ts
import { COMPLAINT_BODY_MAX, COMPLAINT_NAME_MAX } from '#shared/complaintLimits'
```

В `app/` — тот же `#shared/...` или путь через alias по конвенции Nuxt 4 `shared/`.