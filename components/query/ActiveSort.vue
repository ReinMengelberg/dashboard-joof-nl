<script setup lang="ts">
interface Props {
  sortConfig: SortConfig;
  sort: string
  order: string
}

const props = defineProps<Props>();

function getSortLabel() {
  const option = props.sortConfig.find(opt => opt.key === props.sort);
  return option?.label || 'Default';
}
</script>

<template>
  <!-- Active sort indicator -->
  <div class="flex text-gray-600 items-center flex-shrink-0">
    <span class="text-xs">Sorted by:</span>
    <span class="ml-1 font-medium text-xs ">
        {{ getSortLabel() }}
      </span>
    <span class="text-xs ml-1">
        ({{ (props.order || 'asc') === 'asc' ? 'Ascending' : 'Descending' }})
      </span>
  </div>
</template>

<style scoped>

</style>