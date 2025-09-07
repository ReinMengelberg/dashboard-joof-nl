<script setup lang="ts">
import { computed } from 'vue';

// Define prop types
interface Props {
  // The Pinia store instance
  store: any;
  loadPageAction?: string;
  listProperty?: string; // 'list', 'listBounded', 'listUnbounded', etc.
  maxVisiblePages?: number;
}

const props = withDefaults(defineProps<Props>(), {
  loadPageAction: 'loadPage',
  listProperty: 'list',
  maxVisiblePages: 7
});

// Get the paginated data from the store dynamically
const paginationData = computed(() => {
  return props.store[props.listProperty] || null;
});

// Extract pagination details
const currentPage = computed(() => paginationData.value?.current_page || 1);
const lastPage = computed(() => paginationData.value?.last_page || 1);
const hasPreviousPage = computed(() => currentPage.value > 1);
const hasNextPage = computed(() => currentPage.value < lastPage.value);
const from = computed(() => paginationData.value?.from ?? 0);
const to = computed(() => paginationData.value?.to ?? 0);
const total = computed(() => paginationData.value?.total || 0);

/**
 * Generate an array of page numbers to display
 * Includes ellipses (...) for large page ranges
 */
const visiblePageNumbers = computed(() => {
  const currentPageNum = currentPage.value;
  const lastPageNum = lastPage.value;
  const maxVisible = props.maxVisiblePages;
  if (lastPageNum <= maxVisible) {
    return Array.from({ length: lastPageNum }, (_, i) => i + 1);
  }
  const sidePages = Math.floor((maxVisible - 3) / 2);
  let startPage = Math.max(2, currentPageNum - sidePages);
  let endPage = Math.min(lastPageNum - 1, currentPageNum + sidePages);
  if (currentPageNum - sidePages < 2) {
    endPage = Math.min(lastPageNum - 1, maxVisible - 2);
  }
  if (currentPageNum + sidePages > lastPageNum - 1) {
    startPage = Math.max(2, lastPageNum - maxVisible + 2);
  }
  const pages: Array<number | '...'> = [1];
  if (startPage > 2) {
    pages.push('...');
  }
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  if (endPage < lastPageNum - 1) {
    pages.push('...');
  }
  if (lastPageNum > 1) {
    pages.push(lastPageNum);
  }
  return pages;
});

/**
 * Change to the specified page and fetch new data
 */
const changePage = (page: number) => {
  if (
      page < 1 ||
      page > lastPage.value ||
      page === currentPage.value
  ) {
    return;
  }
  props.store[props.loadPageAction](page);
};
</script>

<template>
  <div>
    <!-- Results count info -->
    <div class="sm:flex sm:flex-1 sm:items-center -mt-4 sm:justify-between mb-2">
      <div>
        <p class="text-xs text-gray-700">
          Showing <span class="font-medium">{{ from }}</span> to
          <span class="font-medium">{{ to }}</span> of
          <span class="font-medium">{{ total }}</span> results
        </p>
      </div>
    </div>

    <!-- Pagination navigation -->
    <nav class="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
      <div class="-mt-px flex w-0 flex-1">
        <button
            @click.prevent="changePage(currentPage - 1)"
            :disabled="!hasPreviousPage"
            :class="[
            'inline-flex items-center border-t-2 pr-1 pt-4 text-sm font-medium',
            hasPreviousPage
              ? 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              : 'border-transparent text-gray-300 cursor-not-allowed'
          ]"
        >
          <i class="ri-arrow-left-s-line mr-1"></i>
          Previous
        </button>
      </div>

      <div class="hidden md:-mt-px md:flex">
        <template v-for="page in visiblePageNumbers" :key="page">
          <button
              v-if="page !== '...'"
              @click.prevent="changePage(page)"
              :class="[
              'inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium',
              page === currentPage
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            ]"
              :aria-current="page === currentPage ? 'page' : undefined"
          >
            {{ page }}
          </button>
          <span
              v-else
              class="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500"
          >
            ...
          </span>
        </template>
      </div>

      <div class="-mt-px flex w-0 flex-1 justify-end">
        <button
            @click.prevent="changePage(currentPage + 1)"
            :disabled="!hasNextPage"
            :class="[
            'inline-flex items-center border-t-2 pl-1 pt-4 text-sm font-medium',
            hasNextPage
              ? 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              : 'border-transparent text-gray-300 cursor-not-allowed'
          ]"
        >
          Next
          <i class="ri-arrow-right-s-line ml-1"></i>
        </button>
      </div>
    </nav>
  </div>
</template>

<style scoped>

</style>