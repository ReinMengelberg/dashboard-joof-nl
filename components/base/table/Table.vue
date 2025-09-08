<script setup lang="ts">
interface TableProps {
  class?: string
}

const props = withDefaults(defineProps<TableProps>(), {
  class: ''
})
</script>

<template>
  <div class="bg-white shadow-sm rounded-lg overflow-hidden">
    <table :class="`min-w-full divide-y divide-gray-300 ${props.class}`">
      <slot />
    </table>
  </div>
</template>