<script setup lang="ts">
import { ref } from 'vue'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "~/stores/AuthStore";

definePageMeta({
  layout: "auth",
  middleware: "unauthenticated"
});

const email = ref("")
const password = ref("")
const auth = useAuthStore()

async function onSubmit() {
  if (!email.value || !password.value || auth.loading) return
  await auth.login({ email: email.value, password: password.value })
  if (auth.isAuthenticated) {
    await navigateTo('/app/home')
  }
}
</script>

<template>
  <div class="mx-auto grid w-[350px] gap-6">
    <div class="grid gap-2 text-center">
      <h1 class="text-3xl font-bold">
        Login
      </h1>
      <p class="text-balance text-muted-foreground">
        Enter your email below to login to your account
      </p>
    </div>
    <form class="grid gap-4" @submit.prevent="onSubmit">
      <div class="grid gap-2">
        <label for="email" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
        <Input
          id="email"
          type="email"
          placeholder="m@example.com"
          v-model="email"
          required
        />
      </div>
      <div class="grid gap-2">
        <div class="flex items-center">
          <label for="password" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Password</label>
          <a
            @click="navigateTo('/auth/reset')"
            class="ml-auto cursor-pointer inline-block text-sm underline"
          >
            Forgot your password?
          </a>
        </div>
        <Input id="password" type="password" v-model="password" required />
      </div>
      <p v-if="auth.error" class="text-sm text-red-600">{{ auth.error }}</p>
      <Button type="submit" class="w-full" :disabled="auth.loading">
        <span v-if="auth.loading">Logging in...</span>
        <span v-else>Login</span>
      </Button>
    </form>
  </div>
</template>
