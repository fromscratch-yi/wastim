/* eslint-disable nuxt/no-cjs-in-config */
module.exports = {
  mode: 'universal',
  srcDir: 'src',
  buildDir: 'functions/.nuxt',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width,initial-scale=1.0,minimum-scale=1.0' },
      { name: 'format-detection', content: 'telephone=no, email=no, address=no' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' },
      { name: 'theme-color', content: '#fda085' },
      { hid: 'twitter:card', property: 'twitter:card', content: 'summary_large_image' },
      { hid: 'twitter:site', property: 'twitter:site', content: '@IshiyamaYuichi' },
      { hid: 'og:site_name', property: 'og:site_name', content: 'WasTim' }
    ],
    link: [
      { href: '/splashscreens/iphone5_splash.png', media: '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)', rel: 'apple-touch-startup-image' },
      { href: '/splashscreens/iphone6_splash.png', media: '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)', rel: 'apple-touch-startup-image' },
      { href: '/splashscreens/iphoneplus_splash.png', media: '(device-width: 621px) and (device-height: 1104px) and (-webkit-device-pixel-ratio: 3)', rel: 'apple-touch-startup-image' },
      { href: '/splashscreens/iphonex_splash.png', media: '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)', rel: 'apple-touch-startup-image' },
      { href: '/splashscreens/iphonexr_splash.png', media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)', rel: 'apple-touch-startup-image' },
      { href: '/splashscreens/iphonexsmax_splash.png', media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)', rel: 'apple-touch-startup-image' },
      { href: '/splashscreens/ipad_splash.png', media: '(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)', rel: 'apple-touch-startup-image' },
      { href: '/splashscreens/ipadpro1_splash.png', media: '(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)', rel: 'apple-touch-startup-image' },
      { href: '/splashscreens/ipadpro3_splash.png', media: '(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)', rel: 'apple-touch-startup-image' },
      { href: '/splashscreens/ipadpro2_splash.png', media: '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)', rel: 'apple-touch-startup-image' }
    ],
    script: [{
      innerHTML: `{
        "@context": "http://schema.org",
        "@type": "Organization",
        "url": "https://wastim-yufroms.web.app/",
        "logo": "https://wastim-yufroms.web.app/icon.png",
        "name": "WasTim"
      }`,
      type: 'application/ld+json'
    }]
  },
  manifest: {
    name: 'WasTim',
    short_name: 'WasTim',
    description: 'Record your waste time.',
    background_color: '#ffffff',
    theme_color: '#fda085',
    display: 'standalone',
    orientation: 'portrait'
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fda085' },
  /*
  ** Global CSS
  */
  css: [
    '@/assets/css/reset.css',
    '@/assets/css/common.css'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    {
      src: '@/plugins/vue-chart.js',
      ssr: false
    },
    {
      src: '@/plugins/scroll.js',
      ssr: false
    },
    {
      src: '@/plugins/swiper.js',
      ssr: false
    }
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    ['@nuxtjs/google-tag-manager', {
      id: 'GTM-N7SXPT2',
      pageTracking: true
    }],
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    '@nuxtjs/svg',
    [
      'nuxt-i18n',
      {
        strategy: 'prefix_and_default',
        locales: [
          { code: 'ja', iso: 'ja_JP', file: 'ja.json' },
          { code: 'en', iso: 'en-US', file: 'en.json' }
        ],
        defaultLocale: 'ja',
        vueI18n: {
          fallbackLocale: 'en'
        },
        vueI18nLoader: true,
        lazy: true,
        langDir: 'locales/',
        detectBrowserLanguage: false,
        seo: true
      }
    ]
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extractCSS: true,
    extend (config, ctx) {
      config.externals = {
        moment: 'moment'
      }
    }
  }
}
