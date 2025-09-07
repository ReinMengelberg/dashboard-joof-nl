<script setup lang="ts">
interface TableRowProps {
  class?: string
  onClick?: () => void | Promise<void>
}

const props = withDefaults(defineProps<TableRowProps>(), {
  class: '',
  clickable: true
})
</script>

<template>
  <tr 
    :class="[
      props.onClick ? 'hover:bg-gray-50 cursor-pointer' : '',
      props.class
    ]"
    @click="props.onClick?.()"
  >
    <slot />
  </tr>
</template>