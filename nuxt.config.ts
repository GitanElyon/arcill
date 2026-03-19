const isDev = process.env.NODE_ENV !== 'production'

export default defineNuxtConfig({
  compatibilityDate: '2026-03-19',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  css: ['~/src/assets/main.css'],
  nitro: {
    preset: isDev ? 'node-server' : 'cloudflare-pages',
  },
  typescript: {
    strict: true,
    typeCheck: true,
  },
  runtimeConfig: {
    cloudflareAccountId: '',
    cloudflareImagesAccountHash: '',
    cloudflareImagesVariant: 'thumbnail',
    r2PublicBaseUrl: '',
    public: {
      siteName: 'Archaeology Illustrated',
    },
  },
})
