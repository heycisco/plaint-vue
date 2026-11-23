import {
  COMPLAINT_BODY_MAX,
  COMPLAINT_NAME_MAX
} from '#shared/complaintLimits'
import {
  assertComplaintAllowed,
  recordComplaintAttempt
} from '../utils/complaintRateLimit'

export default defineEventHandler(async (event) => {
  assertComplaintAllowed(event)
  recordComplaintAttempt(event)

  const payload = await readBody(event)
  const body = typeof payload?.body === 'string' ? payload.body.trim() : ''

  let name: string | null = null
  if (typeof payload?.name === 'string') {
    const trimmed = payload.name.trim()
    if (trimmed) {
      name = trimmed
    }
  }

  if (!body) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Нужен текст жалобы'
    })
  }

  if ((name && name.length > COMPLAINT_NAME_MAX) || body.length > COMPLAINT_BODY_MAX) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Имя или текст слишком длинные'
    })
  }

  return createComplaint(name, body)
})