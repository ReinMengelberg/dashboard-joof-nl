import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'
import { useAuthStore } from '~/stores/AuthStore'

export default defineNuxtRouteMiddleware(() => {
    const auth = useAuthStore()

    // Redirect the user to the app if they're not an admin
    if (!auth.user?.admin) {
        return navigateTo('/app/home')
    }
})