<script setup lang="ts">
interface TableHeaderProps {
  class?: string
}

const props = withDefaults(defineProps<TableHeaderProps>(), {
  class: ''
})
</script>

<template>
  <thead :class="props.class" class="border-b border-t">
    <slot />
  </thead>
</template>