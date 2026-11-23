import { createHmac, timingSafeEqual } from 'node:crypto'
import type { H3Event } from 'h3'

export const ADMIN_SESSION_COOKIE = 'plaint_admin_session'

export function adminCredentialsConfigured(login: string, password: string) {
  return Boolean(login && password)
}

function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)

  if (bufA.length !== bufB.length) {
    return false
  }

  return timingSafeEqual(bufA, bufB)
}

export function createAdminSessionToken(login: string, password: string) {
  return createHmac('sha256', password).update(`plaint-admin:${login}`).digest('base64url')
}

export function verifyAdminCredentials(
  login: string,
  password: string,
  configLogin: string,
  configPassword: string
) {
  return safeEqual(login, configLogin) && safeEqual(password, configPassword)
}

export function requireAdmin(event: H3Event) {
  const { adminLogin, adminPassword } = useRuntimeConfig(event)

  if (!adminCredentialsConfigured(adminLogin, adminPassword)) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Админка не настроена'
    })
  }

  const token = getCookie(event, ADMIN_SESSION_COOKIE)
  const expected = createAdminSessionToken(adminLogin, adminPassword)

  if (!token || !safeEqual(token, expected)) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Нет доступа'
    })
  }
}