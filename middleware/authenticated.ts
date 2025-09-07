import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'
import { useAuthStore } from '~/stores/AuthStore'

export default defineNuxtRouteMiddleware(async () => {
    const auth = useAuthStore()

    // Try to fetch the user if not loaded yet
    if (!auth.user && !auth.loading) {
        try {
            await auth.fetchUser()
        } catch {
            // Ignore fetch errors here; the page can handle showing auth errors
        }
    }

    if (!auth.isAuthenticated) {
        return navigateTo('/auth/login', { replace: true })
    }
})
