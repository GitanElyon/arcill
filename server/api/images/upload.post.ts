import { createError, readMultipartFormData } from 'h3'
import { getCloudflareEnv } from '../../utils/cloudflare'

export default defineEventHandler(async (event) => {
  const env = getCloudflareEnv(event)

  if (!env.IMAGES_BUCKET) {
    throw createError({ statusCode: 500, statusMessage: 'R2 binding `IMAGES_BUCKET` is missing.' })
  }

  const form = await readMultipartFormData(event)
  const filePart = form?.find((part) => part.name === 'file' && part.filename)

  if (!filePart?.data || !filePart.filename) {
    throw createError({ statusCode: 400, statusMessage: 'Missing file upload in `file` field.' })
  }

  const safeFilename = filePart.filename.replace(/\s+/g, '-').toLowerCase()
  const key = `uploads/${Date.now()}-${safeFilename}`

  await env.IMAGES_BUCKET.put(key, filePart.data, {
    httpMetadata: {
      contentType: filePart.type || 'application/octet-stream',
    },
  })

  return {
    success: true,
    key,
  }
})
