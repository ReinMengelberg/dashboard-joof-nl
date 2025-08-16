import {defineNuxtRouteMiddleware} from "nuxt/app";
import {useUserSession} from "../.nuxt/imports";
import {navigateTo} from "nuxt/app";

export default defineNuxtRouteMiddleware(() => {
    const { loggedIn } = useUserSession()

    // redirect the user to the app if they're already authenticated'
    if (loggedIn.value) {
        return navigateTo('/app/home')
    }
})