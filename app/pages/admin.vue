<script setup lang="ts">
import { pageDescriptions } from '~/constants/seo'

interface Complaint {
  id: number
  name: string | null
  body: string
  created_at: string
}

const login = ref('')
const password = ref('')
const isAuthenticated = ref(false)
const needsAuth = ref(false)
const loginError = ref('')
const loadError = ref('')
const complaints = ref<Complaint[]>([])
const pending = ref(true)
const deletingId = ref<number | null>(null)
const adminUnavailable = ref(false)

const adminNotConfiguredHint
  = 'Задайте NUXT_ADMIN_LOGIN и NUXT_ADMIN_PASSWORD в .env и перезапустите сервер.'

function httpErrorInfo(error: unknown) {
  if (!error || typeof error !== 'object') {
    return {}
  }

  const record = error as Record<string, unknown>
  const statusCode = typeof record.statusCode === 'number' ? record.statusCode : undefined
  let statusMessage = typeof record.statusMessage === 'string' ? record.statusMessage : undefined

  const data = record.data
  if (!statusMessage && data && typeof data === 'object' && 'statusMessage' in data) {
    const fromData = (data as { statusMessage?: unknown }).statusMessage
    if (typeof fromData === 'string' && fromData) {
      statusMessage = fromData
    }
  }

  return { statusCode, statusMessage }
}

const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  dateStyle: 'short',
  timeStyle: 'short'
})

function formatDate(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) {
    return iso
  }
  return dateFormatter.format(date)
}

function complaintTitle(item: Complaint) {
  const name = item.name?.trim() ?? ''
  return name || `Жалоба №${item.id}`
}

const complaintsCountLabel = computed(() => {
  const count = complaints.value.length
  const mod10 = count % 10
  const mod100 = count % 100

  if (mod10 === 1 && mod100 !== 11) {
    return `${count} жалоба`
  }

  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return `${count} жалобы`
  }

  return `${count} жалоб`
})

async function fetchComplaints() {
  pending.value = true
  loadError.value = ''

  try {
    complaints.value = await $fetch<Complaint[]>('/api/complaints', {
      credentials: 'include'
    })
    isAuthenticated.value = true
    needsAuth.value = false
    loginError.value = ''
  }
  catch (error: unknown) {
    complaints.value = []

    const { statusCode, statusMessage } = httpErrorInfo(error)

    if (statusCode === 401) {
      isAuthenticated.value = false
      needsAuth.value = true
      adminUnavailable.value = false
    }
    else if (statusCode === 503) {
      isAuthenticated.value = false
      needsAuth.value = false
      adminUnavailable.value = true
      loadError.value = statusMessage
        ? `${statusMessage}. ${adminNotConfiguredHint}`
        : `Админка не настроена. ${adminNotConfiguredHint}`
    }
    else {
      loadError.value = 'Не удалось загрузить жалобы'
    }
  }
  finally {
    pending.value = false
  }
}

async function onLogin() {
  loginError.value = ''

  if (!login.value.trim() || !password.value) {
    loginError.value = 'Введите логин и пароль'
    return
  }

  try {
    await $fetch('/api/admin/login', {
      method: 'POST',
      credentials: 'include',
      body: {
        login: login.value.trim(),
        password: password.value
      }
    })
    password.value = ''
    await fetchComplaints()
  }
  catch (error: unknown) {
    const { statusCode, statusMessage } = httpErrorInfo(error)

    if (statusCode === 429) {
      loginError.value = 'Слишком много попыток. Подождите около 15 минут и попробуйте снова.'
      return
    }

    if (statusCode === 503) {
      adminUnavailable.value = true
      needsAuth.value = false
      loadError.value = statusMessage
        ? `${statusMessage}. ${adminNotConfiguredHint}`
        : `Админка не настроена. ${adminNotConfiguredHint}`
      return
    }

    loginError.value = 'Неверный логин или пароль'
  }
}

async function removeComplaint(item: Complaint) {
  if (deletingId.value !== null) {
    return
  }

  const title = complaintTitle(item)
  if (!confirm(`Удалить «${title}»?`)) {
    return
  }

  deletingId.value = item.id

  try {
    await $fetch(`/api/complaints/${item.id}`, {
      method: 'DELETE',
      credentials: 'include'
    })
    complaints.value = complaints.value.filter(row => row.id !== item.id)
  }
  catch {
    loadError.value = 'Не удалось удалить жалобу'
  }
  finally {
    deletingId.value = null
  }
}

async function onLogout() {
  try {
    await $fetch('/api/admin/logout', {
      method: 'POST',
      credentials: 'include'
    })
  }
  catch {
    // cookie might already be cleared
  }

  login.value = ''
  password.value = ''
  isAuthenticated.value = false
  needsAuth.value = true
  complaints.value = []
}

onMounted(() => {
  fetchComplaints()
})

usePageSeo({
  title: 'Кляузная | Админка',
  description: pageDescriptions.admin,
  path: '/admin',
  noindex: true
})
</script>

<template>
  <div class="admin-page">
    <header class="admin-page__head">
      <div class="admin-page__head-main">
        <p class="admin-page__eyebrow">
          Админка
        </p>
        <h2>Жалобы</h2>
        <p
          v-if="isAuthenticated && !pending && !needsAuth"
          class="admin-page__count"
        >
          {{ complaintsCountLabel }}
        </p>
      </div>
      <div
        v-if="isAuthenticated"
        class="admin-page__actions"
      >
        <PlaintBtn
          type="button"
          reset
          @click="onLogout"
        >
          Выйти
        </PlaintBtn>
        <PlaintBtn
          type="button"
          @click="fetchComplaints"
        >
          Обновить
        </PlaintBtn>
      </div>
    </header>

    <form
      v-if="needsAuth && !adminUnavailable"
      class="admin-login"
      @submit.prevent="onLogin"
    >
      <div class="plaint-field">
        <label for="admin-login">Логин</label>
        <input
          id="admin-login"
          v-model="login"
          type="text"
          autocomplete="username"
        >
      </div>
      <div class="plaint-field">
        <label for="admin-password">Пароль</label>
        <input
          id="admin-password"
          v-model="password"
          type="password"
          autocomplete="current-password"
        >
      </div>
      <p v-if="loginError" class="plaint-error">
        {{ loginError }}
      </p>
      <PlaintBtn type="submit">
        Войти
      </PlaintBtn>
    </form>

    <p v-else-if="pending" class="admin-page__status">
      Загрузка…
    </p>

    <p v-else-if="loadError" class="plaint-error">
      {{ loadError }}
    </p>

    <p v-else-if="!complaints.length" class="admin-page__status">
      Пока нет жалоб.
    </p>

    <ul v-else class="admin-list">
      <li
        v-for="item in complaints"
        :key="item.id"
        class="admin-list__item"
      >
        <div class="admin-list__meta">
          <span class="admin-list__title">{{ complaintTitle(item) }}</span>
          <div class="admin-list__aside">
            <time
              class="admin-list__date"
              :datetime="item.created_at"
            >{{ formatDate(item.created_at) }}</time>
            <button
              type="button"
              class="admin-list__delete"
              :disabled="deletingId === item.id"
              aria-label="Удалить жалобу"
              @click="removeComplaint(item)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M9 3h6l1 2h4v2H4V5h4l1-2zm1 6h2v9h-2V9zm4 0h2v9h-2V9zM7 9h2v9H7V9zM6 20a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9H6v11z"
                />
              </svg>
            </button>
          </div>
        </div>
        <p class="admin-list__body">
          {{ item.body }}
        </p>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.admin-page {
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  margin-top: var(--content-indents);
  display: flex;
  flex-direction: column;
  gap: 1.25em;
  align-self: stretch;
}

.admin-page__head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1em;
  width: 100%;
}

.admin-page__head-main {
  display: flex;
  flex-direction: column;
  gap: 0.12em;
  min-width: 0;
}

.admin-page__eyebrow {
  margin: 0;
  font-size: 72%;
  font-family: 'GOST-type-A', 'Tahoma', sans-serif;
  font-weight: 400;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.72;
}

.admin-page__head h2 {
  margin: 0;
  font-size: clamp(1.65rem, 4vw, 2.1rem);
  line-height: 1.05;
}

.admin-page__count {
  margin: 0.35em 0 0;
  font-size: 82%;
  font-family: 'GOST-type-A', 'Tahoma', sans-serif;
  opacity: 0.88;
}

.admin-page__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5em 1em;
}

.admin-page__actions :deep(.plaint-btn--reset) {
  margin-right: 0;
  top: 0;
}

.admin-page__status {
  margin: 0;
  text-align: center;
  font-size: 110%;
}

.admin-login {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1em;
}

.admin-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75em;
  width: 100%;
}

.admin-list__item {
  padding: 0.65em 1em;
  background: #f9f8f6;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-1);
  border: 1px solid #0000002e;
  color: #000;
}

.admin-list__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.35em 1em;
  margin-bottom: 0.5em;
  font-size: 82%;
  font-family: 'GOST-type-A', 'Tahoma', sans-serif;
}

.admin-list__title {
  font-weight: 700;
}

.admin-list__aside {
  display: flex;
  align-items: center;
  gap: 0.5em;
  margin-left: auto;
}

.admin-list__date {
  opacity: 0.85;
}

.admin-list__delete {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.15em;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: inherit;
  cursor: pointer;
  opacity: 0.7;
  transition: color var(--transition-out), opacity var(--transition-out);
}

.admin-list__delete:hover:not(:disabled) {
  color: var(--c-red);
  opacity: 1;
  transition: color var(--transition-in), opacity var(--transition-in);
}

.admin-list__delete:disabled {
  opacity: 0.35;
  cursor: default;
}

.admin-list__body {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>