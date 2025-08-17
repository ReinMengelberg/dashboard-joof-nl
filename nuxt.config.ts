// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: {enabled: true},
    css: [
        '~~/assets/css/tailwind.css',
        'remixicon/fonts/remixicon.css'
    ],
    srcDir: '.',
    vite: {
        plugins: [
            tailwindcss(),
        ],
    },
    routeRules: {
        '/': { redirect: '/app/home' }, // change to your default page
    },
    modules: ['shadcn-nuxt', 'nuxt-auth-utils', '@pinia/nuxt'],
    pinia: {
        storesDirs: ['~/stores/**'],
    },
    shadcn: {
        /**
         * Prefix for all the imported component
         */
        prefix: '',
        /**
         * Directory that the component lives in.
         * @default "./components/ui"
         */
        componentDir: './components/ui'
    },
})