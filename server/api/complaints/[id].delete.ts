export default defineEventHandler((event) => {
  requireAdmin(event)

  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id) || id < 1) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Некорректный идентификатор'
    })
  }

  if (!deleteComplaint(id)) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Жалоба не найдена'
    })
  }

  return { ok: true }
})