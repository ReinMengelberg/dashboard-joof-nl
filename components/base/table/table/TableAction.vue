<script setup lang="ts">
interface TableActionProps {
  class?: string
  action?: () => void | Promise<void>
}

const props = withDefaults(defineProps<TableActionProps>(), {
  class: ''
})
</script>

<template>
  <button
    :class="[
      'text-blue-600 text-sm font-medium cursor-pointer',
      props.action ? 'hover:text-blue-800' : 'text-gray-500',
      props.class
    ]"
    @click.stop="props.action?.()"
  >
    <i class="text-lg ri-arrow-right-s-line"></i>
  </button>
</template> 