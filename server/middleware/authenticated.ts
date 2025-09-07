import { defineEventHandler, setResponseStatus } from 'h3'
import { useUserSession } from "~/.nuxt/imports";
import { ApiResponse } from '~/src/helpers/ApiResponse'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  // If the user is not authenticated, return a standardized API error response
  if (!session?.user) {
    setResponseStatus(event, 401)
    return ApiResponse.error(401, 'Unauthenticated').toJSON()
  }

  // Continue to the next handler if authenticated
})
