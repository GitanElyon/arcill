import { createError, readBody } from 'h3'
import { ensureUsersTable, getCloudflareEnv } from '../../utils/cloudflare'

interface LoginPayload {
  email?: string
  name?: string
}

export default defineEventHandler(async (event) => {
  const payload = await readBody<LoginPayload>(event)
  const email = payload.email?.trim().toLowerCase()
  const name = payload.name?.trim() || 'Guest'

  if (!email) {
    throw createError({ statusCode: 400, statusMessage: 'Email is required.' })
  }

  await ensureUsersTable(event)
  const env = getCloudflareEnv(event)
  const db = env.DB

  if (!db) {
    throw createError({ statusCode: 500, statusMessage: 'D1 binding `DB` is missing.' })
  }

  await db
    .prepare(
      `
      INSERT INTO users (name, email)
      VALUES (?, ?)
      ON CONFLICT(email) DO UPDATE SET
        name = excluded.name,
        updated_at = CURRENT_TIMESTAMP
      `,
    )
    .bind(name, email)
    .run()

  const user = await db
    .prepare(
      `
      SELECT name, email, address, city, country, zip, card_number as cardNumber, is_subscribed as isSubscribed
      FROM users
      WHERE email = ?
      `,
    )
    .bind(email)
    .first<{
      name: string
      email: string
      address: string
      city: string
      country: string
      zip: string
      cardNumber: string
      isSubscribed: number
    }>()

  return {
    success: true,
    user: user
      ? {
          ...user,
          isSubscribed: Boolean(user.isSubscribed),
        }
      : null,
  }
})
