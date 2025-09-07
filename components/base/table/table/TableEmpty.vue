<script setup lang="ts">
import { cn } from '@/lib/utils'
import { computed, type HTMLAttributes } from 'vue'
import TableCell from './TableCell.vue'
import TableRow from './TableRow.vue'

const props = withDefaults(defineProps<{
  class?: HTMLAttributes['class']
  colspan?: number
}>(), {
  colspan: 1,
})

const delegatedProps = computed(() => {
  const { class: _, colspan, ...delegated } = props

  return delegated
})
</script>

<template>
  <TableRow>
    <TableCell
        :colspan="colspan"
        :class="
        cn(
          'p-0 text-center align-middle text-sm text-muted-foreground', // p-0 so content can truly center
          props.class,
        )
      "
        v-bind="delegatedProps"
    >
      <div class="flex items-center justify-center h-full">
        <slot />
      </div>
    </TableCell>
  </TableRow>
</template>
