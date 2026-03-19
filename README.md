# Archaeology Illustrated (ArcIll)

Nuxt 3 storefront running on Cloudflare's ecosystem:
- Cloudflare Pages for hosting and edge runtime
- Cloudflare D1 for user profile data
- Cloudflare R2 for image object storage
- Cloudflare Images delivery URLs for thumbnail rendering

### Cloudflare free tier usage:
- D1: 5GB storage, 100k requests per day
- R2: 10GB storage
- Images: 5k transformations per month

## Architecture

- `app.vue` provides the global site shell and navigation.
- `pages/` maps Nuxt routes to existing `src/views/*` components.
- `server/api/user/*` persists user profile data in D1.
- `server/api/images.get.ts` returns image records and thumbnail URLs.
- `server/api/images/upload.post.ts` uploads new objects to R2.
- `server/utils/cloudflare.ts` centralizes D1/R2/Images runtime helpers.

## Local Development

Install deps:

```sh
npm install
```

Run Nuxt dev server:

```sh
npm run dev
```

Type-check:

```sh
npm run type-check
```

## Cloudflare Setup

1. Update `wrangler.toml`:
	- Replace `database_id` for `DB`.
	- Set real R2 bucket name.
	- Set `CLOUDFLARE_IMAGES_ACCOUNT_HASH`.
	- Set `R2_PUBLIC_BASE_URL`.
2. Ensure bindings in Pages project match:
	- `DB` (D1)
	- `IMAGES_BUCKET` (R2)
	- `CLOUDFLARE_IMAGES_ACCOUNT_HASH` (var)
	- `CLOUDFLARE_IMAGES_VARIANT` (var, e.g. `thumbnail`)
	- `R2_PUBLIC_BASE_URL` (var)

## Build & Deploy

Build Nuxt for Cloudflare Pages:

```sh
npm run build
```

Preview production output locally:

```sh
npm run preview
```

### Cloudflare Pages CI settings

If deploying through Cloudflare Pages Git integration, use:

- Install command: `npm ci`
- Build command: `npm run build`
- Deploy command: *(leave empty)*

If you need a manual CLI deploy (outside Pages Git integration), use:

```sh
npm run deploy:pages
```

Do **not** use `wrangler deploy` for this project, because this app builds as a Cloudflare **Pages** target (`cloudflare-pages` preset), not a standalone Workers entrypoint.