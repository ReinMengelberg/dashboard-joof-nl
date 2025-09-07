<script setup lang="ts">
interface TableCellProps {
  class?: string
}

const props = withDefaults(defineProps<TableCellProps>(), {
  class: ''
})
</script>

<template>
  <td :class="`px-3 py-5 text-sm text-gray-500 break-all ${props.class}`">
    <slot />
  </td>
</template>