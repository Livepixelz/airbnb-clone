export default {
  components: true,
  head: {
    titleTemplate: 'AirBnB Clone : %s',
    htmlAttrs: {
      Lang: 'en'
    },
    bodyAttrs: {
      class: ['my-style']
    },
    meta: [{ charset: 'utf-8' }]
  },
  router: {
    prefetchLinks: false
  },
  build: {
    babel: {
      plugins: [
        '@babel/plugin-proposal-nullish-coalescing-operator',
        '@babel/plugin-proposal-optional-chaining'
      ]
    }
  },
  buildModules: ['@nuxtjs/tailwindcss', '@nuxt/image'],
  modules: [
    '~/modules/auth',
    '~/modules/algolia',
    '~/modules/cloudinary',
    '@nuxtjs/cloudinary',
    '~/modules/stripe'
  ],
  plugins: [
    '~/plugins/auth.client',
    '~/plugins/maps.client',
    '~/plugins/dataApi',
    '~/plugins/vCalendar.client',
    '~/plugins/stripe.client'
  ],
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUDNAME
  },
  image: {
    cloudinary: {
      baseURL: `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUDNAME}/image/upload/`
    }
  },
  css: ['~/assets/sass/app.scss'],
  build: {
    extractCss: true,
    loaders: {
      limit: 0
    }
  },
  publicRuntimeConfig: {
    rootUrl:
      process.env.NODE_ENV === 'production'
        ? 'https://airbnb-clone-tau.vercel.app'
        : 'http://localhost:3000',
    auth: {
      cookieName: 'idToken',
      clientId: process.env.GOOGLE_AUTH_CLIENT_ID
    },
    algolia: {
      appId: process.env.ALGOLIA_APP_ID,
      apiKey: process.env.ALGOLIA_READ_API_KEY
    },
    cloudinary: {
      apiKey: process.env.CLOUDINARY_API_KEY
    },
    stripe: {
      key: process.env.STRIPE_PUBLIC_KEY
    }
  },
  privateRuntimeConfig: {
    algolia: {
      appId: process.env.ALGOLIA_APP_ID,
      apiKey: process.env.ALGOLIA_WRITE_API_KEY
    },
    cloudinary: {
      apiSecret: process.env.CLOUDINARY_API_SECRET
    },
    stripe: {
      secretKey: process.env.STRIPE_SECRET_KEY
    }
  }
}
