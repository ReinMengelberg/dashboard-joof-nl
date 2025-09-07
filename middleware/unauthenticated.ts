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

    // Only redirect on the client to avoid SSR → CSR bounce
    if (process.client && auth.isAuthenticated) {
        return navigateTo('/app/home', { replace: true })
    }
})