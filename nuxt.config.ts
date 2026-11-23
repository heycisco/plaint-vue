// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: process.env.NODE_ENV === 'development' },
  runtimeConfig: {
    adminLogin: process.env.NUXT_ADMIN_LOGIN ?? '',
    adminPassword: process.env.NUXT_ADMIN_PASSWORD ?? '',
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL ?? ''
    }
  },
  css: ['~/assets/css/main.css'],
  app: {
    rootAttrs: {
      class: 'app'
    },
    head: {
      title: 'Кляузная',
      titleTemplate: '%s',
      htmlAttrs: { lang: 'ru' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        {
          name: 'description',
          content:
            'Анонимная «жалоба» ради катарсиса: сатирический сервис, где сообщения тщательно игнорируются.'
        },
        { name: 'theme-color', content: '#1a1a1a' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/img/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/img/favicon-32x32.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/img/favicon-180x180.png' }
      ]
    }
  }
})
