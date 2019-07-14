require('dotenv').config()
export default {
    mode: 'universal',
    /*
    ** Headers of the page
    */
    env: {
        domain: process.env.DOMAIN,
        apiDomain: process.env.API_DOMAIN,
    },
    head: {
        title: 'SmartCommerce',
        meta: [
            {charset: 'utf-8'},
            {name: 'viewport', content: 'width=device-width, initial-scale=1'},
            {hid: 'description', name: 'description', content: process.env.npm_package_description || ''}
        ],
        link: [
            {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
        ]
    },
    /*
    ** Customize the progress-bar color
    */
    loading: {color: '#fff'},
    /*
    ** Global CSS
    */
    css: [
        'ant-design-vue/dist/antd.css',
        '@assets/custom.css'
    ],
    /*
    ** Plugins to load before mounting the App
    */
    plugins: [
        '@/plugins/antd-ui',
        '@/plugins/components',
        '@/plugins/mixins',
    ],
    /*
    ** Nuxt.js modules
    */
    modules: [
        // Doc: https://axios.nuxtjs.org/usage
        '@nuxtjs/axios',
        '@nuxtjs/auth',
    ],
    /*
    ** Axios module configuration
    ** See https://axios.nuxtjs.org/options
    */
    axios: {
        baseURL: process.env.API_DOMAIN + '/v1'
    },

    auth: {
        strategies: {
            local: {
                endpoints: {
                    login: {
                        url: '/auth/rest-auth/login/',
                        method: 'post',
                        propertyName: 'token',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }
                    },
                    logout: {
                        method: 'post',
                        url: '/auth/rest-auth/logout/'
                    },
                    user: {
                        url: '/auth/users/me/',
                        method: 'get',
                        propertyName: ''
                    }
                },
                tokenRequired: true,
                tokenType: 'JWT'
            }
        },
        redirect: {
            login: '/member/login',
            logout: '/member/logout',
            callback: '/member/callback',
            user: '/member/me'
        },
    },

    /*
    ** Build configuration
    */
    build: {
        /*
        ** You can extend webpack config here
        */
        extend(config, ctx) {
        }
    }
}
