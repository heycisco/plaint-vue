import type { H3Event } from 'h3'

const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000
const LOCK_MS = 15 * 60 * 1000

type Entry = {
  failures: number
  windowStart: number
  lockedUntil: number
}

const globalForRateLimit = globalThis as typeof globalThis & {
  __plaintLoginRateLimit?: Map<string, Entry>
}

function attemptsStore() {
  if (!globalForRateLimit.__plaintLoginRateLimit) {
    globalForRateLimit.__plaintLoginRateLimit = new Map()
  }

  return globalForRateLimit.__plaintLoginRateLimit
}

function clientKey(event: H3Event) {
  return getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
}

function freshEntry(now: number): Entry {
  return { failures: 0, windowStart: now, lockedUntil: 0 }
}

function normalizeEntry(entry: Entry, now: number) {
  if (entry.lockedUntil > now) {
    return entry
  }

  if (entry.lockedUntil > 0) {
    return freshEntry(now)
  }

  if (now - entry.windowStart > WINDOW_MS) {
    return freshEntry(now)
  }

  return entry
}

function pruneExpiredEntries(now: number) {
  const store = attemptsStore()

  if (store.size < 512) {
    return
  }

  for (const [key, entry] of store) {
    if (entry.lockedUntil <= now && now - entry.windowStart > WINDOW_MS) {
      store.delete(key)
    }
  }
}

export function assertLoginAllowed(event: H3Event) {
  const now = Date.now()
  pruneExpiredEntries(now)

  const entry = attemptsStore().get(clientKey(event))
  if (entry && entry.lockedUntil > now) {
    const retryAfterSeconds = Math.ceil((entry.lockedUntil - now) / 1000)

    setResponseHeader(event, 'Retry-After', retryAfterSeconds)

    throw createError({
      statusCode: 429,
      statusMessage: 'Слишком много попыток. Попробуйте позже.'
    })
  }
}

export function recordLoginFailure(event: H3Event) {
  const store = attemptsStore()
  const key = clientKey(event)
  const now = Date.now()
  const current = store.get(key)
  const entry = normalizeEntry(current ?? freshEntry(now), now)

  entry.failures += 1

  if (entry.failures >= MAX_ATTEMPTS) {
    entry.lockedUntil = now + LOCK_MS
  }

  store.set(key, entry)

  return entry.failures
}

export function failureDelayMs(failures: number) {
  return Math.min(1000 + failures * 400, 4000)
}

export function clearLoginAttempts(event: H3Event) {
  attemptsStore().delete(clientKey(event))
}