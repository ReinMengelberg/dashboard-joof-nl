import {defineStore} from 'pinia'
import AuthService, {LoginRequest} from '../services/api/AuthService'
import {IApiResponse} from '../src/helpers/ApiResponse'
import {useUserSession} from "../.nuxt/imports";
import type {User} from "../src/types/user";

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
        async login(credentials: LoginRequest) {
            this.loading = true
            this.error = null
            try {
                const authService = new AuthService()
                const response = await authService.login(credentials)
                if (response.success) {
                    await this.fetchUser()
                } else {
                    this.error = response.message
                }
            } catch (error: any) {
                this.error = error.message
            } finally {
                this.loading = false
            }
        },

        async fetchUser() {
            this.loading = true
            try {
                const authService = new AuthService()
                const response = await authService.user()
                if (response.success) {
                    this.user = response.data
                }
            } catch (error: any) {
                this.error = error.message
            } finally {
                this.loading = false
            }
        },

        async logout() {
            this.loading = true
            try {
                const authService = new AuthService()
                const response = await authService.logout()
                if (response.success) {
                    this.user = null
                }
            } catch (error: any) {
                this.error = error.message
            } finally {
                this.loading = false
            }
        }
    }
})