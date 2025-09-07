import {defineEventHandler, setResponseStatus} from 'h3'
import {useUserSession} from "@/.nuxt/imports";
import {ApiResponse} from '@/server/utils/ApiResponse'

export default defineEventHandler(async (event) => {
    const path = getRequestURL(event).pathname
    const method = getMethod(event)
    if (!path.startsWith('/api') || method === 'OPTIONS') {
        return
    }
    if (!path.startsWith('/api') || method === 'OPTIONS') {
        return
    }

    const session = await getUserSession(event)

    // If the user is authenticated, block access to unauthenticated-only routes
    if (session?.user) {
        setResponseStatus(event, 400)
        return ApiResponse.error(400, 'Only unauthenticated').toJSON()
    }

    // Continue to the next handler if NOT authenticated
})
