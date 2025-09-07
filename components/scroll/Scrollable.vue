<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  height?: string | number
  maxHeight?: string | number
  class?: string
  flex?: boolean // New prop to enable flex-1 behavior
}

const props = withDefaults(defineProps<Props>(), {
  maxHeight: undefined,
  flex: true // Default to flex behavior
});

const style = computed(() => {
  const style: Record<string, string> = {};
  if (props.height) style.height = String(props.height);
  if (props.maxHeight) style.maxHeight = String(props.maxHeight);
  return style;
});

const rootClasses = computed(() => {
  const classes = [
    'overflow-y-auto scrollbar min-h-0',
    props.class || ''
  ];

  // Add flex-1 if no explicit height/maxHeight and flex is enabled
  if (props.flex && !props.height && !props.maxHeight) {
    classes.push('flex-1');
  }

  return classes.join(' ').trim();
});
</script>

<template>
  <div :class="rootClasses" :style="style">
    <slot />
  </div>
</template>

<style scoped>
.scrollbar { scrollbar-gutter: stable; scrollbar-width: thin; scrollbar-color: #cbd5e1 transparent; }
.scrollbar::-webkit-scrollbar { height: 4px; width: 4px; }
.scrollbar::-webkit-scrollbar-track { background: transparent; }
.scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }
</style>
