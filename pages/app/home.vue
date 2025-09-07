<script setup lang="ts">
import { useRouter } from '#imports'
import { useAuthStore } from '~/stores/AuthStore'

definePageMeta({
  layout: 'app',
  middleware: 'authenticated',
})

const router = useRouter()
const auth = useAuthStore()

async function onLogout() {
  const ok = await auth.logout()
  if (ok) {
    router.push('/auth/login')
  }
}
</script>

<template>
  <div>
    <h1>THIS IS THE HOMEPAGE</h1>
    <button @click="onLogout" :disabled="auth.loading" style="margin-top: 1rem;">
      {{ auth.loading ? 'Logging out...' : 'Logout' }}
    </button>
  </div>
</template>

<style scoped>
</style>