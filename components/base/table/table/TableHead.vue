<script setup lang="ts">
interface TableHeadProps {
  class?: string
  scope?: string
  spacing?: number
}

const props = withDefaults(defineProps<TableHeadProps>(), {
  class: '',
  scope: 'col'
})
</script>

<template>
  <th 
    :scope="props.scope"
    :class="`py-2 px-3 text-left text-sm font-semibold text-gray-500 whitespace-nowrap ${props.class}`"
    :style="`width: ${props.spacing}fr`"
  >
    <slot />
  </th>
</template>