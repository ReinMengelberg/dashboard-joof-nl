<script setup lang="ts">
interface TableCaptionProps {
  class?: string
}

const props = withDefaults(defineProps<TableCaptionProps>(), {
  class: ''
})
</script>

<template>
  <caption :class="`text-sm text-gray-500 ${props.class}`">
    <slot />
  </caption>
</template>