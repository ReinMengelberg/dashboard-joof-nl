import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'
import { useAuthStore } from '~/stores/AuthStore'

export default defineNuxtRouteMiddleware(() => {
  const auth = useAuthStore()

  // Redirect the user to login if they are not authenticated
  if (!auth.isAuthenticated) {
    return navigateTo('/auth/login')
  }
})