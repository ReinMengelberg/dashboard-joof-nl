<script setup lang="ts">
interface Props {
  name: string;
  description?: string;
  icon?: string | null;
  defaultIcon?: string;
  showDescription?: boolean;
  iconClass?: string;
  iconBgColor?: string;
  viewDisplay?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showDescription: true,
  defaultIcon: 'ri-file-line',
  viewDisplay: false,
  iconBgColor: 'bg-blue-600'
});
</script>

<template>
  <div class="flex items-center gap-x-3 w-full break-all">
    <div class="flex items-center justify-center w-12 h-12 rounded-full flex-shrink-0" :class="iconBgColor">
      <i v-if="icon" class="text-2xl" :class="[icon, iconClass || 'text-white']"/>
      <i v-else class="text-2xl" :class="[defaultIcon, iconClass || 'text-white']"/>
    </div>
    <div class="min-w-0 flex-1">
      <p class="text-sm font-semibold text-gray-900 truncate">
        {{ name }}
      </p>
      <p v-if="showDescription && description" class="mt-1 text-xs text-gray-500 line-clamp-2 leading-relaxed">
        {{ description }}
      </p>
    </div>
  </div>
</template>