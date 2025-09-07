import { defineStore } from 'pinia'
import NotificationService from '../services/utils/NotificationService'
import ErrorService from '../services/utils/ErrorService'
import UserService, { type CreateUserRequest, type UpdateUserRequest, type ListUsersParams } from '../services/api/UserService'
import type { User } from '@/src/types/models/user'
import { useAuthStore } from './AuthStore'

// Lazy service instance
let userService: UserService | null = null
function ensureService() {
  if (!userService) userService = new UserService()
  return userService
}

export const useUserStore = defineStore('UserStore', {
  state: () => ({
    // List state
    items: [] as User[],
    listLoading: false,
    query: '' as string,
    skip: 0 as number,
    take: 25 as number,

    // Active item state
    active: null as User | null,
    activeLoading: false,
  }),

  getters: {
    hasActive: (state) => !!state.active,
  },

  actions: {
    // LIST
    async fetchList(params: Partial<ListUsersParams> = {}): Promise<boolean> {
      const userService = ensureService()
      this.listLoading = true
      try {
        const q = params.q ?? this.query
        const skip = params.skip ?? this.skip
        const take = params.take ?? this.take
        const { data } = await userService.list({ q, skip, take })
        this.items = data || []
        // persist latest params
        this.query = q ?? ''
        this.skip = skip ?? 0
        this.take = take ?? 25
        return true
      } catch (error: any) {
        return ErrorService.returnFalse(error, 'Failed to load users')
      } finally {
        this.listLoading = false
      }
    },

    setQuery(q: string) {
      this.query = q
    },
    setPagination(skip: number, take: number) {
      this.skip = skip
      this.take = take
    },

    // READ ONE
    async view(id: number): Promise<boolean> {
      const userService = ensureService()
      this.activeLoading = true
      try {
        const { data } = await userService.getById(id)
        this.active = data
        return true
      } catch (error: any) {
        return ErrorService.returnFalse(error, 'Failed to load user')
      } finally {
        this.activeLoading = false
      }
    },
      

    // CREATE
    async create(request: CreateUserRequest): Promise<User | null> {
      const userService = ensureService()
      try {
        const { data } = await userService.create(request)
        if (data) {
          // Optimistically update list
          this.items.unshift(data)
          NotificationService.showSuccess('User created')
        }
        return data as User | null
      } catch (error: any) {
        return ErrorService.returnNull(error, 'Failed to create user')
      }
    },

    // UPDATE
    async update(id: number, request: UpdateUserRequest): Promise<boolean> {
      const userService = ensureService()
      const auth = useAuthStore()
      try {
        const { data } = await userService.update(id, request)
        if (data) {
          // Update in list
          const idx = this.items.findIndex(u => u.id === id)
          if (idx !== -1) this.items[idx] = data
          // Update active if open
          if (this.active?.id === id) this.active = data

          // If the updated user is the current authenticated user, refresh auth store
          if (auth.currentUser?.id === id) {
            await auth.fetchUser()
          }
          NotificationService.showSuccess('User updated')
          return true
        }
        return false
      } catch (error: any) {
        return ErrorService.returnFalse(error, 'Failed to update user')
      }
    },

    // DELETE
    async destroy(id: number): Promise<boolean> {
      const userService = ensureService()
      const auth = useAuthStore()
      try {
        const { success } = await userService.delete(id)
        if (success) {
          // Remove from list
          this.items = this.items.filter(u => u.id !== id)
          // Clear active if it was the deleted one
          if (this.active?.id === id) this.active = null

          // If the deleted user is the current authenticated user, refresh auth (it may become null)
          if (auth.currentUser?.id === id) {
            await auth.fetchUser()
          }
          NotificationService.showSuccess('User deleted')
          return true
        }
        return false
      } catch (error: any) {
        return ErrorService.returnFalse(error, 'Failed to delete user')
      }
    },
  }
})
