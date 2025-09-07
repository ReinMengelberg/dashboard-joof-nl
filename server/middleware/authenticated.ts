import { defineEventHandler, setResponseStatus } from 'h3'
import { ApiResponse } from '~/src/helpers/ApiResponse'

const PUBLIC_API_PATHS = new Set<string>([
    '/api/auth/login',
    '/api/auth/reset/request',
    '/api/auth/reset/perform',
])

export default defineEventHandler(async (event) => {
    const path = event.path || ''
    const method = event.node.req.method || 'GET'

    // Only guard API endpoints; let pages/assets pass through
    if (!path.startsWith('/api') || method === 'OPTIONS') {
        return
    }

    // Allow public API endpoints without auth
    if (PUBLIC_API_PATHS.has(path)) {
        return
    }

    const session = await getUserSession(event)

    if (!session?.user) {
        console.log('Unauthenticated')
        setResponseStatus(event, 401)
        return ApiResponse.error(401, 'Unauthenticated').toJSON()
    }
})
