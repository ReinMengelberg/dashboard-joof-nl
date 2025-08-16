import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'
import { useAuthStore } from '~/stores/AuthStore'

export default defineNuxtRouteMiddleware(() => {
  const auth = useAuthStore()

  // Redirect the user to the app if they're already authenticated
  if (auth.isAuthenticated) {
    return navigateTo('/app/home')
  }
})