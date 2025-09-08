import { defineStore } from 'pinia'
import NotificationService from '../services/utils/NotificationService'
import ErrorService from '../services/utils/ErrorService'
import UserService, { type CreateUserRequest, type UpdateUserRequest, type UserFilters } from '../services/api/UserService'
import type { User } from '@/src/types/models/user'
import type { PaginatedData } from '@/src/types/api/PaginatedData'
import { useAuthStore } from './AuthStore'

// Lazy service instance
let userService: UserService | null = null

function ensureService() {
  if (!userService) userService = new UserService()
  return userService
}

export const useUserStore = defineStore('UserStore', {
  state: () => ({
    // Paginated list state expected by UI components
    list: null as PaginatedData<User[]> | null,
    listLoading: false as boolean,

    // Query state
    search: '' as string,
    filters: {} as UserFilters,
    sort: 'id' as string | null, // not used by API but kept for SearchBar compatibility
    order: 'asc' as 'asc' | 'desc',
    page: 1 as number,
    per_page: 10 as number,

    // Active item state
    active: null as User | null,
    activeLoading: false as boolean,
  }),

  getters: {
    hasActive: (state) => !!state.active,
  },

  actions: {
    // LOAD (used by SearchBar)
    async load(
      search: string | null = null,
      filters: UserFilters | null = null,
      _sort: string | null = null,
      _order: 'asc' | 'desc' | null = null,
      page: number = 1,
      per_page: number = 10
    ): Promise<boolean> {
      const svc = ensureService()
      this.listLoading = true
      try {
        // persist query state
        this.search = search ?? this.search ?? ''
        this.filters = filters ?? this.filters ?? {}
        this.page = page ?? 1
        this.per_page = per_page ?? this.per_page ?? 10
        if (_sort) this.sort = _sort
        if (_order) this.order = _order

        const { data } = await svc.list(this.search, this.filters, this.page, this.per_page)
        this.list = data ?? null
        return true
      } catch (error: any) {
        return ErrorService.returnFalse(error, 'Failed to load users')
      } finally {
        this.listLoading = false
      }
    },

    // LOAD PAGE (used by PaginationController)
    async loadPage(page: number): Promise<boolean> {
      return this.load(this.search, this.filters, this.sort, this.order, page, this.per_page)
    },

    // RELOAD (used by SearchBar)
    async reload(): Promise<boolean> {
      return this.load(this.search, this.filters, this.sort, this.order, this.page, this.per_page)
    },

    // HOT RELOAD (used by SearchBar)
    async hotReload(): Promise<boolean> {
      return this.reload()
    },

    // CREATE
    async create(request: CreateUserRequest): Promise<boolean> {
      const svc = ensureService()
      try {
        const { data } = await svc.create(request)
        if (!data) throw new Error('Failed to create user')
        NotificationService.showSuccess('User created')
        await this.reload()
        return true
      } catch (error: any) {
        return ErrorService.returnFalse(error, 'Failed to create user')
      }
    },

    // READ
    async view(userId: number): Promise<boolean> {
      const svc = ensureService()
      this.activeLoading = true
      try {
        const { data } = await svc.view(userId)
        if (!data) throw new Error('Failed to view user')
        this.active = data
        return true
      } catch (error: any) {
        return ErrorService.returnFalse(error, 'Failed to view user')
      } finally {
        this.activeLoading = false
      }
    },

    // UPDATE
    async update(userId: number, request: UpdateUserRequest): Promise<boolean> {
      const svc = ensureService()
      const auth = useAuthStore()
      try {
        const { data } = await svc.update(userId, request)
        if (!data) throw new Error('Failed to update user')
        this.active = data
        if (Number(auth.user?.id) === Number(userId)) {
          await auth.fetchUser()
        }
        NotificationService.showSuccess('User updated')
        await this.reload()
        return true
      } catch (error: any) {
        return ErrorService.returnFalse(error, 'Failed to update user')
      }
    },

    // DELETE
    async destroy(userId: number, password?: string): Promise<boolean> {
      const svc = ensureService()
      const auth = useAuthStore()
      try {
        const { success } = await svc.destroy(userId, password ? { password } : undefined)
        if (!success) throw new Error('Failed to delete user')
        this.active = null
        if (Number(auth.user?.id) === Number(userId)) {
          await auth.fetchUser()
        }
        NotificationService.showSuccess('User deleted')
        await this.reload()
        return true
      } catch (error: any) {
        return ErrorService.returnFalse(error, 'Failed to delete user')
      }
    },
  }
})
