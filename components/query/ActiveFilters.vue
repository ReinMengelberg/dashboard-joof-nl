<script setup lang="ts">
import { computed } from 'vue';
import type {OptionItem, OptionGroup} from "@/src/types/helpers/options";
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from '~/components/ui/tags-input';

interface Props {
  modelValue: Record<string, string[]>; // The active filters object from store.filters
  getFilteredOptionsList: (type: string) => any[]; // Function to get options for a filter type
  hideKeys?: string[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  change: [key: string, value: any]
}>();

/**
 * Helper function to get the base filter type (removes exclude_ prefix)
 */
function getBaseFilterType(filterKey: string): string {
  return filterKey.startsWith('exclude_') ? filterKey.substring(8) : filterKey;
}

/**
 * Generate display name for filter type
 */
function getFilterDisplayName(type: string): string {
  const baseType = getBaseFilterType(type);
  const isExclude = type.startsWith('exclude_');

  // Convert snake_case to Title Case
  const displayName = baseType
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

  return isExclude ? `Exclude ${displayName}` : displayName;
}

/**
 * Remove a filter by emitting change event with null value
 */
function removeFilter(type: string) {
  emit('change', type, null);
}

/**
 * Get the option object for a filter type and value with better matching
 */
function getFilterOption(type: string, value: any): OptionItem | any | null {
  const baseType = getBaseFilterType(type);
  const optionsList = props.getFilteredOptionsList(baseType);

  if (!optionsList || optionsList.length === 0) {
    console.warn(`No options found for filter type: ${baseType}`);
    return null;
  }

  // Convert value to string for comparison to handle type mismatches
  const searchValue = String(value);

  const option = optionsList.find((opt: any) => {
    if (typeof opt === 'object' && opt !== null) {
      // Check multiple possible identifier properties with type conversion
      return (
          String(opt.id) === searchValue ||
          String(opt.value) === searchValue ||
          String(opt.key) === searchValue
      );
    }
    return String(opt) === searchValue;
  });

  if (!option) {
    console.warn(`Option not found for type: ${baseType}, value: ${value}`);
  }

  return option;
}

/**
 * Get display value for a filter with fallback handling
 */
function getFilterDisplayValue(type: string, value: any): string {
  // Handle null/undefined values
  if (value === null || value === undefined) {
    return 'None';
  }

  const option = getFilterOption(type, value);
  if (option) {
    if (typeof option === 'object' && option !== null) {
      // Try different possible label properties in order of preference
      return option.label || option.name || option.title || String(option.value || value);
    }
    return String(option);
  }

  // Fallback to the raw value if option not found
  return String(value);
}

/**
 * Validate if color is a valid Tailwind class
 */
function isValidTailwindBgClass(color: string | null): boolean {
  if (!color) return false;
  return color.startsWith('bg-');
}

// Computed property to check if we have active filters (excluding hidden keys)
const hasActiveFilters = computed(() => {
  if (!props.modelValue) return false;

  return Object.entries(props.modelValue).some(([key, value]) => {
    // Skip hidden keys
    if (props.hideKeys && props.hideKeys.includes(key)) return false;

    // Check if the value is meaningful (not null, undefined, empty string, or empty array)
    if (value === null || value === undefined || value === '') return false;
    if (Array.isArray(value) && value.length === 0) return false;
    return true;
  });
});


// Computed property to get processed filter entries with cached visuals
const activeFilterEntries = computed(() => {
  if (!props.modelValue) return [];

  const entries: any[] = [];

  Object.entries(props.modelValue)
      .filter(([key, value]) => {
        // Filter out hidden keys
        if (props.hideKeys && props.hideKeys.includes(key)) return false;

        // Filter out null, undefined, empty string values, and empty arrays
        if (value === null || value === undefined || value === '') return false;
        if (Array.isArray(value) && value.length === 0) return false;
        return true;
      })
      .forEach(([key, value]) => {
        // Handle array values - create separate entry for each array item
        if (Array.isArray(value)) {
          value.forEach((item) => {
            if (item !== null && item !== undefined && item !== '') {
              const option = getFilterOption(key, item);
              const visuals = option && typeof option === 'object' && option !== null ? {
                avatar: option.avatar || null,
                icon: option.icon || null,
                color: option.color || null
              } : { avatar: null, icon: null, color: null };

              entries.push({
                key,
                value: item,
                displayName: getFilterDisplayName(key),
                displayValue: getFilterDisplayValue(key, item),
                visuals,
                // Add unique identifier for array items
                uniqueKey: `${key}-${item}`
              });
            }
          });
        } else {
          // Handle single value
          const option = getFilterOption(key, value);
          const visuals = option && typeof option === 'object' && option !== null ? {
            avatar: option.avatar || null,
            icon: option.icon || null,
            color: option.color || null
          } : { avatar: null, icon: null, color: null };

          entries.push({
            key,
            value,
            displayName: getFilterDisplayName(key),
            displayValue: getFilterDisplayValue(key, value),
            visuals,
            uniqueKey: key
          });
        }
      });

  return entries;
});

// Create array of display values for TagsInput v-model
const filterDisplayValues = computed(() => {
  return activeFilterEntries.value.map(filter => filter.displayValue);
});

// Handle tag removal for both single values and array items
function handleTagRemove(uniqueKey: string) {
  const filterEntry = activeFilterEntries.value.find(f => f.uniqueKey === uniqueKey);
  if (!filterEntry) return;

  const currentValue = props.modelValue[filterEntry.key];

  if (Array.isArray(currentValue)) {
    // Remove specific item from array
    const newArray = currentValue.filter(item => item !== filterEntry.value);

    // If array becomes empty, remove the entire filter, otherwise update with new array
    emit('change', filterEntry.key, newArray.length === 0 ? null : newArray);
  } else {
    // Remove single value filter entirely
    removeFilter(filterEntry.key);
  }
}
</script>

<template>
  <div v-if="hasActiveFilters" class="flex items-start text-sm -my-3">
    <div class="flex items-center gap-3 w-full">
      <span class="font-medium text-gray-700 flex-shrink-0">Active filters:</span>

      <TagsInput
          :model-value="filterDisplayValues"
          class="min-h-10 w-full border-transparent p-0"
          @update:model-value="() => {}"
      >
        <TagsInputItem
            v-for="filter in activeFilterEntries"
            :key="filter.uniqueKey"
            :value="filter.displayValue"
            class="flex items-center gap-1 bg-gray-100"
        >
          <!-- Visual indicators -->
          <i
              v-if="filter.visuals.icon"
              :class="[filter.visuals.icon, 'ml-2 mb-1 w-3 h-3 flex-shrink-0']"
          ></i>
          <!-- Color indicator using Tailwind bg- class -->
          <div
              v-else-if="filter.visuals.color && isValidTailwindBgClass(filter.visuals.color)"
              :class="[
                filter.visuals.color,
                'ml-2 w-3 h-3 rounded-full flex-shrink-0 border border-white shadow-sm ring-1 ring-gray-700'
              ]"
              :title="`Color: ${filter.visuals.color}`"
          ></div>

          <TagsInputItemText class="truncate max-w-xs" />
          <TagsInputItemDelete
              @click="handleTagRemove(filter.uniqueKey)"
              :aria-label="`Remove ${filter.displayName} filter`"
          />
        </TagsInputItem>

        <!-- Hide the input since we don't want users typing new filters here -->
        <TagsInputInput
            class="hidden"
            readonly
            tabindex="-1"
        />
      </TagsInput>
    </div>
  </div>
</template>