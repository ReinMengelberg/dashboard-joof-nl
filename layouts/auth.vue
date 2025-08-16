<script setup lang="ts">
// Auth layout: two-column grid with centered content on the left and an optional media panel on the right.
</script>

<template>
  <div class="w-full lg:grid min-h-dvh lg:grid-cols-2">
    <div class="flex items-center justify-center py-12">
      <slot />
    </div>
    <div class="hidden bg-muted lg:block relative">
      <img
          src="/city.jpg"
          alt=""
          aria-hidden="true"
          class="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
      />
    </div>
  </div>
</template>

<style scoped>
</style>
