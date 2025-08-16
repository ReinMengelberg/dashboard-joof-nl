<script setup lang="ts">
// Auth layout: two-column grid with centered content on the left and an optional media panel on the right.
</script>

<template>
  <div class="w-full lg:grid min-h-dvh lg:grid-cols-2">
    <div class="flex items-center justify-center py-12">
      <slot />
    </div>
    <div class="hidden bg-muted lg:block">
      <!-- You can place an illustrative image here if desired -->
      <img
        src="/city.jpg"
        alt="Image"
        class="max-h-dvh w-full object-cover dark:brightness-[0.2] dark:grayscale"
      />
    </div>
  </div>
</template>

<style scoped>
</style>