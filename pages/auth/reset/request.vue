<script setup lang="ts">
import { ref } from 'vue'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AuthService from "~/services/api/AuthService";
import NotificationService from "~/services/utils/NotificationService";

definePageMeta({
  layout: "auth",
  middleware: "unauthenticated",
});

const email = ref("")
const loading = ref(false)
const error = ref<string | null>(null)

async function onSubmit() {
  if (!email.value || loading.value) return
  loading.value = true
  error.value = null
  try {
    const auth = new AuthService()
    const res = await auth.requestReset({ email: email.value })
    if (res.success) {
      NotificationService.showSuccess(res.message || 'If the email exists, a reset link has been sent.')
    } else {
      error.value = res.message || 'Failed to request password reset.'
    }
  } catch (e: any) {
    error.value = e?.message || 'Failed to request password reset.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="mx-auto grid w-[350px] gap-6">
    <div class="grid gap-2 text-center">
      <h1 class="text-3xl font-bold">Request Password Reset</h1>
      <p class="text-balance text-muted-foreground">
        Enter your email to receive a password reset link
      </p>
    </div>
    <form class="grid gap-4" @submit.prevent="onSubmit">
      <div class="grid gap-2">
        <label for="email" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
        <Input id="email" type="email" placeholder="m@example.com" v-model="email" required />
      </div>
      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
      <Button type="submit" class="w-full" :disabled="loading">
        <span v-if="loading">Sending...</span>
        <span v-else>Send reset link</span>
      </Button>
      <Button type="button" variant="secondary" class="w-full" @click="navigateTo('/auth/login')">Back to login</Button>
    </form>
  </div>
</template>

<style scoped>
</style>