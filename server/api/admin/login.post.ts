import {
  adminCredentialsConfigured,
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  verifyAdminCredentials
} from '../../utils/adminAuth'
import {
  assertLoginAllowed,
  clearLoginAttempts,
  failureDelayMs,
  recordLoginFailure
} from '../../utils/loginRateLimit'

export default defineEventHandler(async (event) => {
  const { adminLogin, adminPassword } = useRuntimeConfig(event)

  assertLoginAllowed(event)

  if (!adminCredentialsConfigured(adminLogin, adminPassword)) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Админка не настроена'
    })
  }

  const body = await readBody<{ login?: string, password?: string }>(event)
  const login = typeof body?.login === 'string' ? body.login : ''
  const password = typeof body?.password === 'string' ? body.password : ''

  if (!verifyAdminCredentials(login, password, adminLogin, adminPassword)) {
    const failures = recordLoginFailure(event)
    await new Promise(resolve => setTimeout(resolve, failureDelayMs(failures)))

    throw createError({
      statusCode: 401,
      statusMessage: 'Неверный логин или пароль'
    })
  }

  clearLoginAttempts(event)

  const token = createAdminSessionToken(adminLogin, adminPassword)

  setCookie(event, ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7
  })

  return { ok: true }
})