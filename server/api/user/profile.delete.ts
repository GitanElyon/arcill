import { createError, readBody } from 'h3'
import { ensureUsersTable, getCloudflareEnv } from '../../utils/cloudflare'

interface DeleteProfilePayload {
  email?: string
}

export default defineEventHandler(async (event) => {
  const payload = await readBody<DeleteProfilePayload>(event)
  const email = payload.email?.trim().toLowerCase()

  if (!email) {
    throw createError({ statusCode: 400, statusMessage: 'Email is required.' })
  }

  await ensureUsersTable(event)
  const db = getCloudflareEnv(event).DB

  if (!db) {
    throw createError({ statusCode: 500, statusMessage: 'D1 binding `DB` is missing.' })
  }

  await db
    .prepare('DELETE FROM users WHERE email = ?')
    .bind(email)
    .run()

  return { success: true }
})
