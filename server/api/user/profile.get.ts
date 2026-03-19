import { createError, getQuery } from 'h3'
import { ensureUsersTable, getCloudflareEnv } from '../../utils/cloudflare'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const email = typeof query.email === 'string' ? query.email.trim().toLowerCase() : ''

  if (!email) {
    throw createError({ statusCode: 400, statusMessage: 'Email query parameter is required.' })
  }

  await ensureUsersTable(event)
  const db = getCloudflareEnv(event).DB

  if (!db) {
    throw createError({ statusCode: 500, statusMessage: 'D1 binding `DB` is missing.' })
  }

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

  if (!user) {
    throw createError({ statusCode: 404, statusMessage: 'User not found.' })
  }

  return {
    user: {
      ...user,
      isSubscribed: Boolean(user.isSubscribed),
    },
  }
})
