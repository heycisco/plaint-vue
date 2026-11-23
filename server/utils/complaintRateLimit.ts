import type { H3Event } from 'h3'

/** Успешных и неуспешных отправок с одного IP за окно */
const MAX_SUBMISSIONS = 5
const WINDOW_MS = 15 * 60 * 1000

type Entry = {
  count: number
  windowStart: number
}

const globalForComplaintRateLimit = globalThis as typeof globalThis & {
  __plaintComplaintRateLimit?: Map<string, Entry>
}

function submissionsStore() {
  if (!globalForComplaintRateLimit.__plaintComplaintRateLimit) {
    globalForComplaintRateLimit.__plaintComplaintRateLimit = new Map()
  }

  return globalForComplaintRateLimit.__plaintComplaintRateLimit
}

function clientKey(event: H3Event) {
  return getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
}

function currentEntry(key: string, now: number) {
  const entry = submissionsStore().get(key)

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    return { count: 0, windowStart: now }
  }

  return entry
}

function pruneExpiredEntries(now: number) {
  const store = submissionsStore()

  if (store.size < 512) {
    return
  }

  for (const [key, entry] of store) {
    if (now - entry.windowStart > WINDOW_MS) {
      store.delete(key)
    }
  }
}

export function assertComplaintAllowed(event: H3Event) {
  const now = Date.now()
  pruneExpiredEntries(now)

  const key = clientKey(event)
  const entry = currentEntry(key, now)

  if (entry.count >= MAX_SUBMISSIONS) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((entry.windowStart + WINDOW_MS - now) / 1000)
    )

    setResponseHeader(event, 'Retry-After', retryAfterSeconds)

    throw createError({
      statusCode: 429,
      statusMessage: 'Слишком много жалоб с этого адреса. Попробуйте позже.'
    })
  }
}

export function recordComplaintAttempt(event: H3Event) {
  const store = submissionsStore()
  const key = clientKey(event)
  const now = Date.now()
  const entry = currentEntry(key, now)

  entry.count += 1
  store.set(key, entry)
}