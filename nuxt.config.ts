import { NuxtConfig } from '@nuxt/types';

// Define your configuration with auto-completion & type checking
const config: NuxtConfig = {
  // Disable telemetry (https://github.com/nuxt/telemetry#opting-out)
  telemetry: false,

  target: 'static',
  ssr: false,
  loading: false,
  router: {
    mode: 'hash',
  },

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    // titleTemplate: '%s - Soundux',
    title: 'Soundux',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [{ src: '~/plugins/vuetify.ts' }],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: ['@nuxtjs/dayjs'],

  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    defaultAssets: {
      font: undefined,
      icons: false,
    },
    theme: {
      dark: true,
      themes: {
        // @ts-ignore TODO: wait for https://github.com/nuxt-community/vuetify-module/pull/419
        dark: {
          primary: '#52b18c',
        },
        // @ts-ignore
        light: {
          primary: '#52b18c',
        },
      },
    },
  },

  dayjs: {
    plugins: [
      'duration', // import 'dayjs/plugin/duration'
    ],
  },

  vue: {
    config: {
      productionTip: false,
    },
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    publicPath: '',
  },
};

export default config;
