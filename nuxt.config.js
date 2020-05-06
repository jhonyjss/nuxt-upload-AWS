const colors = require('vuetify/es5/util/colors').default

module.exports = {
  mode: 'spa',
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
  ],

  serverMiddleware: [
    '~/api/index'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~/plugins/gallery.js', ssr: false },
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxtjs/vuetify',
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    'nuxt-lazy-load',
    'cookie-universal-nuxt'
  ],
  
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    baseURL: "/api"
  },

  auth: {
    tokenRequired: false,
    tokenType: false,
    redirect: {
      login: '/',
      logout: '/',
      user: '/photos',
      home: false
    },
    strategies: {
     /*  facebook: {
        client_id: process.env.FACEBOOK_CLIENT_ID,
        userinfo_endpoint: false,
        scope: ['public_profile', 'email'],
        redirect_uri: `${process.env.API_URL}auth/login/facebook/callback`
      },
      google: {
        client_id: process.env.GOOGLE_CLIENT_ID,
        user: false,
        redirect_uri: `${process.env.API_URL}auth/login/google/callback`
      }, */
      local: {
        endpoints: {
          login: {
            url: 'auth/login',
            method: 'post',
            withCredentials: true, 
            propertyName: 'data'
          },
          logout: {
            url: 'auth/logout',
            method: 'post',
            propertyName: 'token'
          },
          user: {
            url: 'auth/user',
            method: 'get',
            propertyName: false
          },
          logout: false,
        }
      }
    }
  },
  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}
