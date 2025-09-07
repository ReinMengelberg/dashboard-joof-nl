import {defineStore} from 'pinia'
import NotificationService from '../services/utils/NotificationService'
import ErrorService from '../services/utils/ErrorService'
import UserService, {
    type CreateUserRequest,
    type UpdateUserRequest,
    type ListUsersParams
} from '../services/api/UserService'
import type {User} from '@/src/types/models/user'
import {useAuthStore} from './AuthStore'

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

        list: null as PaginatedData<User[]>,
        search: null as string,
        filters: null as UserFilters,
        page: null as number,
        perPage: null as number,
        listLoading: false,

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
                const {data} = await userService.list({q, skip, take})
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

        // CREATE
        async create(request: CreateUserRequest): Promise<boolean> {
            const userService = ensureService()
            try {
                const {data} = await userService.create(request)
                if (!data) new Error('Failed to create user')
                NotificationService.showSuccess('User created')
                return true
            } catch (error: any) {
                return ErrorService.returnFalse(error, 'Failed to create user')
            }
        },

        // READ
        async view(userId: number): Promise<boolean> {
            const userService = ensureService()
            this.activeLoading = true
            try {
                const {data} = await userService.view(userId)
                if (!data) new Error('Failed to view user')
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
            const userService = ensureService()
            const auth = useAuthStore()
            try {
                const {data} = await userService.update(userId, request)
                if (!data) new Error('Failed to update user')
                this.active = data
                if (Number(auth.user?.id) === Number(userId)) {
                    await auth.fetchUser()
                }
                NotificationService.showSuccess('User updated')
                return true
            } catch (error: any) {
                return ErrorService.returnFalse(error, 'Failed to update user')
            }
        },

        // DELETE
        async destroy(userId: number, password?: string): Promise<boolean> {
            const userService = ensureService()
            const auth = useAuthStore()
            try {
                const {success} = await userService.destroy(id, password ? { password } : undefined)
                if (!success) new Error('Failed to delete user')
                this.active = null
                if (Number(auth.user?.id) === Number(userId)) {
                    console.log("refreshing auth")
                    await auth.fetchUser()
                }
                NotificationService.showSuccess('User deleted')
                return true
            } catch (error: any) {
                return ErrorService.returnFalse(error, 'Failed to delete user')
            }
        },
    }
})
