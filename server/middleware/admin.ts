import { defineEventHandler, setResponseStatus } from 'h3'
import { getUserSession } from '#auth-utils'
import { ApiResponse } from '~/src/helpers/ApiResponse'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  // Must be authenticated
  if (!session?.user) {
    setResponseStatus(event, 401)
    return ApiResponse.error(401, 'Unauthenticated').toJSON()
  }

  // Must be admin
  if (!session.user.admin) {
    setResponseStatus(event, 403)
    return ApiResponse.error(403, 'Admin only').toJSON()
  }

  // Continue to the next handler if authenticated and admin
})