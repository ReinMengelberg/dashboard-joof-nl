import {defineEventHandler, setResponseStatus} from 'h3'
import {useUserSession} from "@/.nuxt/imports";
import {ApiResponse} from '@/src/helpers/ApiResponse'

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

    if (!session?.user) {
        setResponseStatus(event, 401)
        return ApiResponse.error(401, 'Unauthenticated').toJSON()
    }

    // Continue to the next handler if authenticated
})
