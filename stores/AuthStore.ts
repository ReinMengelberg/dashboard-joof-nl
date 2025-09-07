import {defineStore} from 'pinia'
import AuthService, {type LoginRequest} from '../services/api/AuthService'
import {useUserSession} from "~/.nuxt/imports";
import type {User} from "~/src/types/user";
import NotificationService from '../services/utils/NotificationService'
import ErrorService from '../services/utils/ErrorService'

let authService: AuthService | null = null
let userSession:ReturnType<typeof useUserSession> | null = null

function ensureServices() {
    if (!authService) authService = new AuthService()
    if (!userSession) userSession = useUserSession()
    return {
        authService,
        userSession
    }
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as User | null,
        loggedIn: null,
        needsRefresh: false,
        loading: false,
        error: null
    }),

    getters: {
        isAuthenticated: (state) => !!state.user,
        currentUser: (state) => state.user
    },

    actions: {
        async login(credentials: LoginRequest): Promise<boolean> {
            this.loading = true
            this.error = null
            try {
                const authService = new AuthService()
                console.log(credentials)
                const response = await authService.login(credentials)
                if (response.success) {
                    NotificationService.showSuccess('Logged in successfully.')
                    await this.fetchUser()
                    return true
                }
            } catch (error: any) {
                console.log("Failed to login")
                console.log(error)
                this.error = error.message
                return ErrorService.returnFalse(error, error?.message || 'Login failed.')
            } finally {
                this.loading = false
            }
        },

        async fetchUser(): Promise<boolean> {
            this.loading = true
            try {
                const authService = new AuthService()
                const response = await authService.user()
                if (response.success) {
                    this.user = response.data
                    return true
                } else {
                    this.error = response.message
                    return ErrorService.returnFalse('error', response.message || 'Failed to fetch user.')
                }
            } catch (error: any) {
                this.error = error.message
                return ErrorService.returnFalse(error, error?.message || 'Failed to fetch user.')
            } finally {
                this.loading = false
            }
        },

        async logout(): Promise<boolean> {
            this.loading = true
            try {
                const authService = new AuthService()
                const response = await authService.logout()
                if (response.success) {
                    this.user = null
                    NotificationService.showInfo('Logged out.')
                    return true
                } else {
                    this.error = response.message
                    return ErrorService.returnFalse('error', response.message || 'Logout failed.')
                }
            } catch (error: any) {
                this.error = error.message
                return ErrorService.returnFalse(error, error?.message || 'Logout failed.')
            } finally {
                this.loading = false
            }
        }
    }
})