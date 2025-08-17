<!-- layouts/base.vue -->
<script setup lang="ts">
import NotificationComponent from "@/components/utils/NotificationComponent.vue";

const route = useRoute();

useHead(() => ({
  title: route.meta.title || "Joof Dashboard",
}));
</script>

<template>
  <slot></slot>
  <NotificationComponent />
</template>