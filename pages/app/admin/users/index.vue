<script setup lang="ts">
import { onMounted } from 'vue'
import SearchBar from '~/components/query/SearchBar.vue'
import PaginationController from '~/components/query/PaginationController.vue'
import UserTable from '~/components/models/user/UserTable.vue'
import { useUserStore } from '~/stores/UserStore'
import { useAuthStore } from '~/stores/AuthStore'

const users = useUserStore()
const auth = useAuthStore()

onMounted(async () => {
  // Initial load
  await users.load(users.search || '', users.filters || {}, users.sort, users.order, 1, users.per_page || 10)
})
</script>

<template>
  <div class="p-4 md:p-6 space-y-4">
    <SearchBar
      :store="users"
      :showSort="false"
      :showFilters="false"
      :debounce="300"
      searchPlaceholder="Search users..."
    />

    <div class="bg-white rounded-md border shadow-sm">
      <UserTable
          :users="users"
          :auth="auth"
          view="arrow"
      />
    </div>

    <PaginationController :store="users" />
  </div>
</template>

<style scoped>
</style>