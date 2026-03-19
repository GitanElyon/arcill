import { ensureImagesTable, getCloudflareEnv, getCloudflareImageUrl, getR2PublicUrl } from '../utils/cloudflare'

interface DbImage {
  id: string
  title: string
  description: string
  time_period: string
  year: number
  country: string
  tags: string
  artist: string
  cloudflare_image_id: string | null
  r2_key: string | null
  views: number
  date_added: string
}

const fallbackImages = [
  {
    id: '1',
    title: 'Roman Forum Reconstruction',
    description: 'A detailed reconstruction of the Roman Forum during the Imperial period.',
    time_period: 'Roman Period',
    year: 200,
    country: 'Rome',
    tags: 'Roman,Architecture,City,Imperial',
    artist: 'John Doe',
    cloudflare_image_id: null,
    r2_key: null,
    views: 1250,
    date_added: '2023-01-15T00:00:00.000Z',
  },
]

export default defineEventHandler(async (event) => {
  await ensureImagesTable(event)
  const db = getCloudflareEnv(event).DB

  if (!db) {
    return []
  }

  const queryResult = await db
    .prepare(
      `
      SELECT id, title, description, time_period, year, country, tags, artist, cloudflare_image_id, r2_key, views, date_added
      FROM images
      ORDER BY date_added DESC
      `,
    )
    .bind()
    .all<DbImage>()

  const rows = queryResult.results && queryResult.results.length > 0 ? queryResult.results : fallbackImages

  return rows.map((image) => {
    const r2Url = getR2PublicUrl(image.r2_key, event)
    const imageUrl = getCloudflareImageUrl(image.cloudflare_image_id, event, r2Url)

    return {
      id: image.id,
      title: image.title,
      description: image.description,
      timePeriod: image.time_period,
      year: image.year,
      country: image.country,
      tags: image.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      artist: image.artist,
      imageUrl: imageUrl || 'https://placehold.co/600x400?text=ArcIll+Image',
      dateAdded: image.date_added,
      views: image.views,
      prices: [
        { resolution: '1200x800', price: 30, label: 'Small Web' },
        { resolution: '2000x1200', price: 60, label: 'Large Web' },
        { resolution: '3000x1800', price: 90, label: 'Print A4' },
        { resolution: '4000x3200', price: 150, label: 'Print A3' },
        { resolution: '6000x3800', price: 250, label: 'Ultra High Res' },
      ],
    }
  })
})
