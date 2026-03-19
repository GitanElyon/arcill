import { createError, H3Event } from 'h3'

export interface ArcillCloudflareEnv {
  DB?: {
    prepare: (query: string) => {
      bind: (...args: unknown[]) => {
        first: <T = unknown>() => Promise<T | null>
        all: <T = unknown>() => Promise<{ results?: T[] }>
        run: () => Promise<unknown>
      }
    }
  }
  IMAGES_BUCKET?: {
    put: (
      key: string,
      value: ArrayBuffer | ArrayBufferView | string | Blob | ReadableStream,
      options?: { httpMetadata?: { contentType?: string } },
    ) => Promise<unknown>
  }
  CLOUDFLARE_IMAGES_ACCOUNT_HASH?: string
  CLOUDFLARE_IMAGES_VARIANT?: string
  R2_PUBLIC_BASE_URL?: string
}

export function getCloudflareEnv(event: H3Event): ArcillCloudflareEnv {
  const env = (event.context.cloudflare as { env?: ArcillCloudflareEnv } | undefined)?.env

  if (!env) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Cloudflare environment is not available. Use the Cloudflare Pages runtime for this endpoint.',
    })
  }

  return env
}

export async function ensureUsersTable(event: H3Event) {
  const env = getCloudflareEnv(event)

  if (!env.DB) {
    throw createError({
      statusCode: 500,
      statusMessage: 'D1 binding `DB` is missing.',
    })
  }

  await env.DB.prepare(
    `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      address TEXT DEFAULT '',
      city TEXT DEFAULT '',
      country TEXT DEFAULT '',
      zip TEXT DEFAULT '',
      card_number TEXT DEFAULT '',
      is_subscribed INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
    `,
  )
    .bind()
    .run()
}

export async function ensureImagesTable(event: H3Event) {
  const env = getCloudflareEnv(event)

  if (!env.DB) {
    throw createError({
      statusCode: 500,
      statusMessage: 'D1 binding `DB` is missing.',
    })
  }

  await env.DB.prepare(
    `
    CREATE TABLE IF NOT EXISTS images (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      time_period TEXT NOT NULL,
      year INTEGER NOT NULL,
      country TEXT NOT NULL,
      tags TEXT NOT NULL,
      artist TEXT NOT NULL,
      cloudflare_image_id TEXT,
      r2_key TEXT,
      views INTEGER DEFAULT 0,
      date_added TEXT DEFAULT CURRENT_TIMESTAMP
    )
    `,
  )
    .bind()
    .run()
}

export function getCloudflareImageUrl(
  imageId: string | null | undefined,
  event: H3Event,
  fallbackUrl?: string | null,
) {
  if (!imageId) {
    return fallbackUrl ?? ''
  }

  const env = getCloudflareEnv(event)
  const runtimeConfig = useRuntimeConfig(event)
  const accountHash = env.CLOUDFLARE_IMAGES_ACCOUNT_HASH || runtimeConfig.cloudflareImagesAccountHash
  const variant = env.CLOUDFLARE_IMAGES_VARIANT || runtimeConfig.cloudflareImagesVariant || 'thumbnail'

  if (!accountHash) {
    return fallbackUrl ?? ''
  }

  return `https://imagedelivery.net/${accountHash}/${imageId}/${variant}`
}

export function getR2PublicUrl(key: string | null | undefined, event: H3Event) {
  if (!key) {
    return ''
  }

  const env = getCloudflareEnv(event)
  const runtimeConfig = useRuntimeConfig(event)
  const publicBase = env.R2_PUBLIC_BASE_URL || runtimeConfig.r2PublicBaseUrl

  if (!publicBase) {
    return ''
  }

  return `${publicBase.replace(/\/$/, '')}/${key}`
}
