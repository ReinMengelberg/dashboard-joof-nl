import {defineNuxtRouteMiddleware} from "nuxt/app";
import {useUserSession} from "../.nuxt/imports";
import {navigateTo} from "nuxt/app";

export default defineNuxtRouteMiddleware(() => {
    const { loggedIn } = useUserSession()

    // redirect the user to the login screen if they're not authenticated
    if (!loggedIn.value) {
        return navigateTo('auth/login')
    }
})