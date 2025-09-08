<script setup lang="ts">
interface TableContainerProps {
  title?: string
  description?: string
  actionLabel?: string
  showAction?: boolean
  class?: string
  onAction?: () => void | Promise<void>
}

const props = withDefaults(defineProps<TableContainerProps>(), {
  title: '',
  description: '',
  actionLabel: 'Add',
  showAction: false,
  class: ''
})
</script>

<template>
  <div :class="`px-4 sm:px-6 lg:px-8 ${props.class}`">
    <div class="sm:flex sm:items-center" v-if="title || description || showAction">
      <div class="sm:flex-auto">
        <h1 v-if="title" class="text-base font-semibold text-gray-900">
          {{ title }}
        </h1>
        <p v-if="description" class="mt-2 text-sm text-gray-700">
          {{ description }}
        </p>
      </div>
      <div v-if="showAction" class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <button 
          type="button" 
          @click="props.onAction?.()"
          class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {{ actionLabel }}
        </button>
      </div>
    </div>
    <slot />
  </div>
</template>