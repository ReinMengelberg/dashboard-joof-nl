<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { Button } from '~/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '~/components/ui/command';
import type {OptionItem, OptionGroup} from "@/src/types/helpers/options";
import {getRawColor} from "~/services/utils/ColorUtils";
import Badge from "~/components/utils/Badge.vue";

interface Props {
  placeholder?: string;
  modelValue?: string[] | null;
  options: OptionGroup | OptionItem[];
  multiple?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;

  // Feedback
  disabled?: boolean;
  loading?: boolean;

  // Keys
  icon?: boolean;
  avatar?: boolean;
  color?: boolean;
  count?: boolean;

  // Classes
  triggerClass?: string;
  triggerVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  align?: 'start' | 'center' | 'end' ;

  // Multiple selection options
  maxDisplay?: number; // Max number of items to show before showing count
  closeOnSelect?: boolean; // Whether to close dropdown after selection (default: true for single, false for multiple)
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select an option',
  multiple: false,
  searchable: true,
  searchPlaceholder: 'Search...',
  disabled: false,
  loading: false,

  // Keys
  icon: false,
  avatar: false,
  color: false,

  // Classes
  triggerClass: '',
  triggerVariant: 'outline',
  align: 'start',

  // Multiple selection defaults
  maxDisplay: 2,
  closeOnSelect: undefined, // Will be computed based on multiple prop
});

const emit = defineEmits(['update:modelValue', 'change', 'search']);

const searchTerm = ref('');
const isOpen = ref(false);

const shouldCloseOnSelect = computed(() => {
  return props.closeOnSelect !== undefined ? props.closeOnSelect : !props.multiple;
});

// Normalize modelValue to handle null/undefined cases
const selectedValues = computed(() => {
  return props.modelValue || [];
});

const optionsList = computed(() => {
  if (Array.isArray(props.options)) {
    return props.options;
  }
  return props.options?.list || [];
});

const defaultValue = computed(() => {
  if (Array.isArray(props.options)) {
    return null;
  }
  return props.options?.default;
});

const selectedOptions = computed(() => {
  return optionsList.value.filter((opt: OptionItem) =>
      selectedValues.value.includes(opt.value)
  );
});

const displayValue = computed(() => {
  if (selectedOptions.value.length === 0) {
    return props.placeholder;
  }

  if (!props.multiple) {
    return selectedOptions.value[0]?.label || props.placeholder;
  }

  // Multiple selection display logic
  if (selectedOptions.value.length === 1) {
    // Show the actual value when only one item is selected
    return selectedOptions.value[0]?.label || props.placeholder;
  } else {
    // Show count when multiple items are selected
    return `${selectedOptions.value.length} selected`;
  }
});

// Check if current modelValue is valid (exists in options)
const isCurrentValueValid = computed(() => {
  if (selectedValues.value.length === 0) {
    return true; // Empty selection is valid
  }
  return selectedValues.value.every(value =>
      optionsList.value.some((opt: OptionItem) => opt.value === value)
  );
});

// Watch for changes in options and validate current value
watch(() => props.options, () => {
  if (!isCurrentValueValid.value) {
    // Current value is no longer valid, filter out invalid values
    const validValues = selectedValues.value.filter(value =>
        optionsList.value.some((opt: OptionItem) => opt.value === value)
    );
    handleValueChange(validValues);
  }
}, { deep: true });

watch(isOpen, (newValue) => {
  if (!newValue) {
    nextTick(() => {
      searchTerm.value = '';
    });
  }
});

const filteredOptions = computed(() => {
  if (!searchTerm.value.trim()) {
    return optionsList.value;
  }
  const term = searchTerm.value.trim().toLowerCase();
  return optionsList.value.filter((option: OptionItem) =>
      option.label.toLowerCase().includes(term)
  );
});

function handleValueChange(value: string[]) {
  emit('update:modelValue', value);
  emit('change', value);

  // if (shouldCloseOnSelect.value) {
  //   isOpen.value = false;
  // }
}

function toggleOption(optionValue: string) {
  if (!props.multiple) {
    // Single selection - replace with new value or clear if same value
    const newValue = selectedValues.value.includes(optionValue) ? [] : [optionValue];
    handleValueChange(newValue);
    return;
  }

  // Multiple selection
  const currentValues = [...selectedValues.value];
  const index = currentValues.indexOf(optionValue);

  if (index === -1) {
    // Add to selection
    currentValues.push(optionValue);
  } else {
    // Remove from selection
    currentValues.splice(index, 1);
  }

  handleValueChange(currentValues);
}

function onSearchInput(value: string) {
  searchTerm.value = value;
  emit('search', value);
}


// Single function to get visual display info for any option
function getVisualDisplay(option: OptionItem | null) {
  if (!option) return { type: 'none' };

  if (props.color && option.color && props.icon && option.icon) {
    return { type: 'badge', color: option.color, icon: option.icon };
  }
  if (props.color && option.color) {
    return { type: 'color', value: option.color };
  }
  if (props.icon && option.icon) {
    return { type: 'icon', value: option.icon };
  }
  return { type: 'none' };
}

function isOptionSelected(optionValue: string): boolean {
  return selectedValues.value.includes(optionValue);
}
</script>

<template>
  <Popover v-model:open="isOpen">
    <PopoverTrigger as-child>
      <Button
          :variant="triggerVariant"
          :disabled="disabled || loading"
          :class="triggerClass"
          class="w-full justify-between text-left font-normal"
          role="combobox"
          :aria-expanded="isOpen"
      >
        <div class="flex items-center gap-2 flex-1 overflow-hidden">
          <!-- Single selection display OR multiple selection with exactly one item -->
          <template v-if="(!multiple && selectedOptions.length > 0) || (multiple && selectedOptions.length === 1)">
            <template v-for="visual in [getVisualDisplay(selectedOptions[0])]" :key="selectedOptions[0].value">
              <!-- Color ball -->


              <Badge
                  v-if="visual.type === 'badge'"
                  :color="getRawColor(visual.color)"
              >
                <i :class="visual.icon"/>
              </Badge>

              <div
                  v-if="visual.type === 'color'"
                  class="h-4 w-4 rounded-full flex-shrink-0"
                  :class="visual.value"
              ></div>

              <!-- Icon -->
              <i
                  v-else-if="visual.type === 'icon'"
                  :class="visual.value"
                  class="flex-shrink-0"
              ></i>

            </template>
          </template>

          <!-- Display text for all cases -->
          <span class="truncate">
            {{ displayValue }}
          </span>
        </div>

        <div class="flex items-center gap-1 flex-shrink-0">
          <i class="ri-arrow-down-s-line ri-sm opacity-50"></i>
        </div>
      </Button>
    </PopoverTrigger>

    <PopoverContent class="p-0" :align="align">
      <Command v-model:searchTerm="searchTerm">
        <CommandInput
            v-if="searchable"
            :placeholder="searchPlaceholder"
            @update:search="onSearchInput"
        />

        <CommandList>
          <div v-if="loading" class="px-2 py-2 text-sm text-gray-500 flex items-center justify-center">
            <i class="ri-loader-4-line animate-spin mr-2"></i>
            Loading...
          </div>

          <CommandEmpty v-else-if="filteredOptions.length === 0">
            No matches found.
          </CommandEmpty>

          <CommandGroup v-else>
            <CommandItem
                v-for="option in filteredOptions"
                :key="option.value"
                :value="option.value"
                @select="toggleOption(option.value)"
                :class="{ 'bg-accent': isOptionSelected(option.value) }"
            >
              <div class="flex items-center gap-2 w-full">
                <!-- Use the same visual display logic for each option -->
                <template v-for="visual in [getVisualDisplay(option)]">

                  <template v-if="visual.type === 'badge'">
                    <Badge :color="getRawColor(visual.color)">
                      <i :class="visual.icon"/>
                    </Badge>
                  </template>

                  <template v-else-if="visual.type === 'color'">
                    <div class="h-4 w-4 rounded-full" :class="visual.value"></div>
                  </template>

                  <template v-else-if="visual.type === 'icon'">
                    <i :class="visual.value"></i>
                  </template>

                </template>

                <span class="flex-1">{{ option.label }}</span>
                <span v-if="props.count">{{ option.count }}</span>

                <!-- Unified check mark for both single and multiple selection -->
                <i
                    v-if="isOptionSelected(String(option.value ?? ''))"
                    class="ri-check-line ml-auto text-gray-700"
                    aria-hidden="true"
                ></i>
              </div>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>

<style scoped>
</style>