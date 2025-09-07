<script setup lang="ts">
import { useRouter } from '#imports'
import { useAuthStore } from '~/stores/AuthStore'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'

definePageMeta({
  layout: 'home',
  middleware: 'authenticated',
})

const auth = useAuthStore()

</script>

<template>
  <div class="p-4">
    <Card class="relative w-5xl mx-auto">
      <CardHeader>
        <CardTitle>
          Welcome<span v-if="auth.currentUser?.name">, {{ auth.currentUser.name }}</span>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div class="min-h-48 flex items-center justify-center text-muted-foreground py-10">
          Work in progress — a table will appear here soon.
        </div>
      </CardContent>

      <CardFooter class="gap-3 border-t">
        <Button class="flex-1" variant="outline" :disabled="auth.loading" @click=" auth.logout()">
          <i class="ri-logout-circle-r-line" aria-hidden="true" />
          {{ auth.loading ? 'Logging out…' : 'Logout' }}
        </Button>
        <Button class="flex-1" @click="navigateTo('/app/settings')">
          <i class="ri-user-settings-line" aria-hidden="true" />
          Settings
        </Button>
        <Button class="flex-1" @click="navigateTo('/app/admin')">
          <i class="ri-settings-2-fill" aria-hidden="true" />
          Admin
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>

<style scoped>
</style>