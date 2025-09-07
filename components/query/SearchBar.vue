<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '~/components/ui/select';
import FilterSelect from "~/components/query/FilterSelect.vue";
import type {OptionItem, OptionGroup} from "@/src/types/helpers/options";
import ActiveFilters from "~/components/query/ActiveFilters.vue";
import ActiveSort from "~/components/query/ActiveSort.vue";

export interface FilterConfig {
  label: string; // Label of the filter, not the same as option labels
  key: string; // The key of the filter.
  options?: OptionGroup[]; // If the options are predefined, the options for this key won't be requested from the API

  multiple?: boolean;
  applyDefault?: boolean; // Whether to apply the default value from the API
  with_null?: boolean; // Whether to show a null option in the filter
  with_exclude?: boolean; // Whether to show exclude options in the filter.

  icon?: boolean; // Whether we should include the icon
  color?: boolean; // Whether we should include the color
  count?: boolean; // Whether we should include the count

  searchable?: boolean; // Whether the options should be searchable
  searchPlaceholder?: string; // The placeholder of the search
  placeholder?: string; // The placeholder for the filter
}

export interface SortConfig {
  key: string;
  label: string;
}

interface Props {
  // The Pinia store instance
  store: any;
  loadAction?: string;
  reloadAction?: string;
  hotReloadAction?: string;
  optionAction?: string;
  loadPageAction?: string;

  // Search Options
  searchPlaceholder?: string;
  debounce?: number;

  // Sort Options
  showSort?: boolean;
  sortConfig?: SortConfig[]
  defaultSortField?: string;
  defaultSortOrder?: 'asc' | 'desc';

  // Filters
  showFilters?: boolean;
  filterConfig?: FilterConfig[]
  hideActiveFilterKeys?: string[]
  predefinedFilters?: Record<string, any> // Predefined (These will disable the filters)
}

const props = withDefaults(defineProps<Props>(), {
  loadAction: 'load',
  reloadAction: 'reload',
  hotReloadAction: 'hotReload',
  optionAction: 'loadOptions',
  loadPageAction: 'loadPage',

  searchPlaceholder: 'Search...',
  debounce: 300,

  showSort: true,
  sortConfig: () => [],
  defaultSortField: 'id',
  defaultSortOrder: 'asc',

  showFilters: false,
  filterConfig: () => [],
  predefinedFilters: () => ({}),
});

const debounceTimeout = ref<NodeJS.Timeout | null>(null);
const filterSearchTerms = ref<Record<string, string>>({});
const isInitialized = ref(false);

// Computed property to get predefined filter keys
const predefinedFilterKeys = computed(() => {
  return Object.keys(props.predefinedFilters || {});
});

// Computed property to filter out predefined filters from filterConfig
const visibleFilterConfig = computed(() => {
  return props.filterConfig.filter(config =>
      !predefinedFilterKeys.value.includes(config.key)
  );
});

// Computed property for getting filter values (excluding predefined)
const getFilterValue = computed(() => {
  return (filterKey: string) => {
    // Don't return values for predefined filters
    if (predefinedFilterKeys.value.includes(filterKey)) {
      return null;
    }
    return props.store.filters?.[filterKey] ?? null;
  };
});

// Computed property to get only user-applied filters (excluding predefined)
const userFilters = computed(() => {
  if (!props.store.filters) return {};

  // Filter out any keys that are in predefinedFilters
  const filtered: Record<string, any> = {};
  Object.keys(props.store.filters).forEach(key => {
    if (!predefinedFilterKeys.value.includes(key)) {
      filtered[key] = props.store.filters[key];
    }
  });
  return filtered;
});

onMounted(() => {
  if (!props.store.sort) {
    props.store.sort = props.defaultSortField;
  }
  if (!props.store.order) {
    props.store.order = props.defaultSortOrder;
  }
  initFilterDefaults();
});

watch(() => props.store.listOptions, (newOptions, oldOptions) => {
  if (newOptions && !oldOptions && !isInitialized.value) {
    initFilterDefaults();
  }
}, { deep: true });

/**
 * LoadData function
 */

function loadData() {
  if (!props.store[props.loadAction]) {
    console.error(`Action ${props.loadAction} not found in store`);
    return;
  }
  const filters = {
    ...(props.predefinedFilters || {}),
    ...(props.store.filters || {})
  };

  // Sort the keys before stringifying for consistent comparison
  const sortedFilters = Object.keys(filters).sort().reduce((sorted: Record<string, any>, key) => {
    sorted[key] = filters[key];
    return sorted;
  }, {} as Record<string, any>);

  // Prevent redundant API calls by checking if filters have actually changed
  const currentFiltersStr = JSON.stringify(sortedFilters);
  const currentSearchStr = props.store.search || '';
  const currentSortStr = props.store.sort || props.defaultSortField;
  const currentOrderStr = props.store.order || props.defaultSortOrder;

  // Store these values to compare on next call
  if (!props.store._lastQueryParams) {
    props.store._lastQueryParams = {};
  }

  // Skip the API call if nothing has changed
  if (props.store._lastQueryParams.filtersStr === currentFiltersStr &&
      props.store._lastQueryParams.searchStr === currentSearchStr &&
      props.store._lastQueryParams.sortStr === currentSortStr &&
      props.store._lastQueryParams.orderStr === currentOrderStr &&
      props.store.list?.data) {
    return;
  }

  // Update the last query params
  props.store._lastQueryParams.filtersStr = currentFiltersStr;
  props.store._lastQueryParams.searchStr = currentSearchStr;
  props.store._lastQueryParams.sortStr = currentSortStr;
  props.store._lastQueryParams.orderStr = currentOrderStr;

  props.store[props.loadAction](
      props.store.search || null,                    // search
      filters,                                       // filters
      props.store.sort || props.defaultSortField,    // sort
      props.store.order || props.defaultSortOrder,   // order
      1,                                             // page - reset to 1 when search/sort changes
      props.store.per_page || 10                     // per_page
  );
}

/**
 * Search
 * @param value
 */
function onSearchInput(value: string | number) {
  if (debounceTimeout.value) {
    clearTimeout(debounceTimeout.value);
  }
  props.store.search = String(value);
  debounceTimeout.value = setTimeout(() => {
    loadData();
  }, props.debounce);
}

function clearSearch() {
  props.store.search = '';
  loadData();
}

/**
 * SORT FUNCTIONS
 */
function changeSortField(value: any) {
  if (value) {
    props.store.sort = String(value);
    loadData();
  }
}

function toggleSortOrder() {
  props.store.order = props.store.order === 'asc' ? 'desc' : 'asc';
  loadData();
}

function getSortLabel() {
  const option = props.sortConfig.find(opt => opt.key === props.store.sort);
  return option?.label || 'Default';
}

/**
 * FILTER FUNCTIONS
 */

function initFilterDefaults() {
  if (isInitialized.value) return; // Prevent duplicate initialization

  // Only initialize defaults for non-predefined filters
  visibleFilterConfig.value.forEach(filterOption => {
    const filterType = filterOption.key;
    if (filterOption.applyDefault === true &&
        (!props.store.filters || props.store.filters[filterType] === undefined)) {
      if (filterOption.options && filterOption.options.length > 0) { // Check for predefined options first
        const defaultValue = filterOption.options[0]?.default;
        if (defaultValue !== undefined) {
          onFilterChange(filterType, defaultValue);
        }
      } else if (props.store.listOptions) { // Fallback to API options
        const optionsData = props.store.listOptions[filterType];
        if (optionsData && optionsData.default !== undefined) {
          onFilterChange(filterType, optionsData.default);
        }
      }
    }
  });
  isInitialized.value = true;
}

function onFilterChange(type: string, value: any) {
  // Prevent changing predefined filters
  if (predefinedFilterKeys.value.includes(type)) {
    return;
  }

  if (!props.store.filters) {
    props.store.filters = {};
  }
  if (value === undefined || value === null || value === '') {
    // When clearing, remove filter
    const newFilters = {...props.store.filters};
    delete newFilters[type];
    props.store.filters = newFilters;
    if (filterSearchTerms.value[type]) {
      filterSearchTerms.value = {
        ...filterSearchTerms.value,
        [type]: ''
      };
    }
  } else {
    const newFilters = {...props.store.filters};
    newFilters[type] = value;
    props.store.filters = newFilters;
  }
  loadData();
}

function getOptionsList(type: string): OptionItem[] {
  const filterConfig = props.filterConfig.find(config => config.key === type);
  if (filterConfig?.options && filterConfig.options.length > 0) {
    return filterConfig.options[0]?.list || [];
  }
  const options = props.store.listOptions?.[type];
  if (!options) return [];
  if (options.list && Array.isArray(options.list)) {
    return options.list;
  }
  // If options is directly an array of OptionItems
  if (Array.isArray(options)) {
    return options as OptionItem[];
  }
  return [];
}

function getFilteredOptionsList(type: string): OptionItem[] {
  const optionsList = getOptionsList(type);
  if (!shouldShowNull(type)) {
    return optionsList.filter((opt: OptionItem) =>
        opt.value !== null && opt.value !== undefined
    );
  }
  return optionsList;
}

function shouldShowNull(type: string): boolean {
  if (props.filterConfig?.length > 0) {
    const config = props.filterConfig.find(config => config.key === type);
    return config?.with_null === true;
  }
  return false;
}

function shouldApplyDefault(type: string): boolean {
  if (props.filterConfig?.length > 0) {
    const config = props.filterConfig.find(config => config.key === type);
    return config?.applyDefault === true;
  }
  return false;
}

function hasOptions(type: string): boolean {
  const filterConfig = props.filterConfig.find(config => config.key === type);
  if (filterConfig?.options && filterConfig.options.length > 0) {
    return true;
  }
  return !!props.store.listOptions?.[type];
}
</script>

<template>
  <div class="space-y-3 pb-2">
    <div class="flex flex-col sm:flex-row gap-3">
      <!-- Search input -->
      <div class="relative flex-grow">
        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <i class="ri-search-line ri-md text-gray-400"></i>
        </div>

        <Input
            type="text"
            :model-value="store.search || ''"
            @update:model-value="onSearchInput"
            :placeholder="searchPlaceholder"
            class="block h-10 w-full rounded-md py-2 pl-10 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 shadow-sm"
        />

        <Button
            v-if="store.search"
            variant="ghost"
            @click.prevent="clearSearch"
            class="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
        >
          <i class="ri-close-circle-line text-gray-400 hover:text-gray-500"></i>
        </Button>
      </div>

      <!-- Sort controls -->
      <div v-if="showSort && sortConfig?.length" class="flex sm:w-auto">
        <Select :value="store.sort || defaultSortField" @update:model-value="changeSortField" class="min-w-[180px]">
          <SelectTrigger class="h-10 shadow-sm">
            <SelectValue :placeholder="getSortLabel()" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sort By</SelectLabel>
              <SelectItem
                  v-for="option in sortConfig"
                  :key="option.key"
                  :value="option.key"
              >
                {{ option.label }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <!-- Order toggle button -->
        <Button
            variant="ghost"
            @click.prevent="toggleSortOrder"
            class="inline-flex items-center justify-center ml-2 h-10 w-16 rounded-md ring-1 ring-inset ring-gray-300 bg-white hover:bg-gray-50 shadow-sm"
            :aria-label="(store.order || defaultSortOrder) === 'asc' ? 'Sort descending' : 'Sort ascending'"
        >
          <i v-if="(store.order || defaultSortOrder) === 'asc'" class="ri-sort-asc ri-lg text-gray-700"></i>
          <i v-else class="ri-sort-desc ri-lg text-gray-700"></i>
        </Button>
      </div>
    </div>

    <!-- Filter controls section - only show visible filters (excluding predefined) -->
    <div v-if="visibleFilterConfig && visibleFilterConfig.length !== 0"
         :class="[
          'grid grid-cols-1 gap-3',
          visibleFilterConfig.length === 2 ? 'sm:grid-cols-2 mx-auto' :
          visibleFilterConfig.length === 3 ? 'sm:grid-cols-2 md:grid-cols-3 mx-auto' :
          visibleFilterConfig.length >= 4 ? 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mx-auto' : 'mx-auto'
        ]"
    >
      <!-- Filter selects for each non-predefined filter type -->
      <div v-for="filterType in visibleFilterConfig" :key="filterType.key" class="w-full">
        <FilterSelect
            :key="`filter-${filterType.key}-${!!getFilterValue(filterType.key)}`"
            :model-value="getFilterValue(filterType.key)"
            @change="(value) => onFilterChange(filterType.key, value)"

            :placeholder="filterType.placeholder || filterType.label"
            :options="getFilteredOptionsList(filterType.key)"
            :multiple="filterType.multiple"
            :applyDefault="shouldApplyDefault(filterType.key)"

            :searchable="filterType.searchable"
            :search-placeholder="filterType.searchPlaceholder || `Search ${filterType.label}...`"

            :disabled="!hasOptions(filterType.key)"

            :icon="filterType.icon"
            :color="filterType.color"
            :count="filterType.count"

            triggerClass="h-10 shadow-sm w-full"
        />
      </div>
    </div>

    <!-- Active filters display - only show user filters -->
    <div class="flex justify-between">
      <ActiveFilters
          v-if="props.showFilters"
          :model-value="userFilters"
          @change="(key, value) => onFilterChange(key, value)"
          :get-filtered-options-list="getFilteredOptionsList"
          :hideKeys="[...props.hideActiveFilterKeys || [], ...predefinedFilterKeys]"
          class="mr-auto"
      />

      <ActiveSort
          v-if="props.showSort"
          :sort-config="props.sortConfig"
          :sort="store.sort"
          :order="store.order"
          class="ml-auto"
      />
    </div>

  </div>
</template>

<style scoped>

</style>