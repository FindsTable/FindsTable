import i18n from './i18n.config';

    export default defineNuxtConfig({
      app: {
          baseURL: '/'
      },

      devtools: {
          enabled: false,

          timeline: {
              enabled: true
          }
      },

      debug: false,

      vite: {
          build: {
              minify: true
          }
      },

      nitro: {
          minify: true
      },

      ssr: false,

      css: [
          '@/css/_styles_.css',
      ],

      modules: [
        '@nuxtjs/i18n', 
        '@vueuse/nuxt', 
        '@nuxt/icon', 
        '@nuxt/image',
        '@nuxt/test-utils/module'
    ],

      image: {
          presets: {
              avatar: {
                  modifiers: {
                      format: 'jpg',
                      width: 50,
                      height: 50
                  }
              }
          }
      },

      i18n,

      runtimeConfig: {
          DIRECTUS_URL: process.env.DIRECTUS_URL,
          APP_ACCESS_TOKEN: process.env.APP_ACCESS_TOKEN,
          USER_ROLE_ID: process.env.USER_ROLE_ID,
          PATREON_WEBHOOKS_SECRET: process.env.PATREON_WEBHOOKS_SECRET,
          PATREON_FINDSTABLENET_CLIENT_SECRET: process.env.PATREON_FINDSTABLENET_CLIENT_SECRET,
          PATREON_FINDSTABLENET_ACCESS_TOKEN: process.env.PATREON_FINDSTABLENET_ACCESS_TOKEN,
          PATREON_FINDSTABLENET_REFRESH_TOKEN: process.env.PATREON_FINDSTABLENET_REFRESH_TOKEN,
          PATREON_CAMPAIGN_ID: process.env.PATREON_CAMPAIGN_ID,
          APP_CONTEXT: process.env.APP_CONTEXT,
          public: {
              PATREON_FINDSTABLENET_CLIENT_ID: "r7HFLdQrNEoACYei5OPCD9jnU444NrL--juMyULyACAUKWpue7SXI4JBgiG8BqND",
          }
      },

      // routeRules: {
      //     '/': { ssr: true },
      //     '/privacy': { ssr: true },
      //     '/legal-notice': { ssr: true },
      //     '/home': { ssr: false }
      // }
      future: {
          compatibilityVersion: 4
      },

      compatibilityDate: '2024-11-25'
    })