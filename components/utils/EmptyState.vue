<script setup lang="ts">
interface Props {
  emptyMessage?: string;
  emptyPrompt?: string;
  icon?: string;
}

const props = withDefaults(defineProps<Props>(), {
  emptyMessage: 'None found',
  icon: 'ri-user-search-line',
});
</script>

<template>
  <div class="flex flex-col justify-center items-center h-full gap-3">
    <div class="p-4 bg-gray-50 rounded-full">
      <i :class="`${props.icon} text-gray-400 text-2xl`"></i>
    </div>
    <div class="text-center">
      <p class="text-sm font-medium text-gray-900">{{ props.emptyMessage }}</p>
      <p class="text-xs text-gray-500 mt-1">{{ props.emptyPrompt }}</p>
    </div>
  </div>
</template>

<style scoped>

</style>