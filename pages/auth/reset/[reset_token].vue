<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AuthService from "~/services/api/AuthService";
import NotificationService from "~/services/utils/NotificationService";

definePageMeta({
  layout: "auth",
  middleware: "unauthenticated",
});

const route = useRoute()
const token = computed(() => String(route.params.reset_token || ''))

const password = ref("")
const passwordConfirmation = ref("")
const loading = ref(false)
const error = ref<string | null>(null)

async function onSubmit() {
  if (!password.value || !passwordConfirmation.value || loading.value) return
  if (password.value !== passwordConfirmation.value) {
    error.value = 'Passwords do not match.'
    return
  }
  if (!token.value) {
    error.value = 'Invalid or missing reset token.'
    return
  }
  loading.value = true
  error.value = null
  try {
    const auth = new AuthService()
    const res = await auth.performReset({ token: token.value, password: password.value, password_confirmation: passwordConfirmation.value })
    if (res.success) {
      NotificationService.showSuccess(res.message || 'Password has been reset. You can now log in.')
      navigateTo('/auth/login')
    } else {
      error.value = res.message || 'Failed to reset password.'
    }
  } catch (e: any) {
    error.value = e?.message || 'Failed to reset password.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="mx-auto grid w-[350px] gap-6">
    <div class="grid gap-2 text-center">
      <h1 class="text-3xl font-bold">Set New Password</h1>
      <p class="text-balance text-muted-foreground">
        Enter your new password below
      </p>
    </div>
    <form class="grid gap-4" @submit.prevent="onSubmit">
      <div class="grid gap-2">
        <label for="password" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">New Password</label>
        <Input id="password" type="password" v-model="password" required />
      </div>
      <div class="grid gap-2">
        <label for="password_confirmation" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Confirm Password</label>
        <Input id="password_confirmation" type="password" v-model="passwordConfirmation" required />
      </div>
      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
      <Button type="submit" class="w-full" :disabled="loading">
        <span v-if="loading">Resetting...</span>
        <span v-else>Reset Password</span>
      </Button>
      <Button type="button" variant="secondary" class="w-full" @click="navigateTo('/auth/login')">Back to login</Button>
    </form>
  </div>
</template>

<style scoped>
</style>