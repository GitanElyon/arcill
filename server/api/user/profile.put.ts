import { createError, readBody } from 'h3'
import { ensureUsersTable, getCloudflareEnv } from '../../utils/cloudflare'

interface UpdateProfilePayload {
  name?: string
  email?: string
  address?: string
  city?: string
  country?: string
  zip?: string
  cardNumber?: string
  isSubscribed?: boolean
}

export default defineEventHandler(async (event) => {
  const payload = await readBody<UpdateProfilePayload>(event)
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
    .prepare(
      `
      UPDATE users
      SET
        name = ?,
        address = ?,
        city = ?,
        country = ?,
        zip = ?,
        card_number = ?,
        is_subscribed = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE email = ?
      `,
    )
    .bind(
      payload.name?.trim() || 'Guest',
      payload.address?.trim() || '',
      payload.city?.trim() || '',
      payload.country?.trim() || '',
      payload.zip?.trim() || '',
      payload.cardNumber?.trim() || '',
      payload.isSubscribed ? 1 : 0,
      email,
    )
    .run()

  return { success: true }
})
