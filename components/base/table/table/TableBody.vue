<script setup lang="ts">
interface TableBodyProps {
  class?: string
}

const props = withDefaults(defineProps<TableBodyProps>(), {
  class: ''
})
</script>

<template>
  <tbody :class="`divide-y divide-gray-200 bg-white ${props.class}`">
    <slot />
  </tbody>
</template>