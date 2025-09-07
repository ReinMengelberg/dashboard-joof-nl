import { defineEventHandler, setResponseStatus } from 'h3'
import { useUserSession } from "~/.nuxt/imports";
import { ApiResponse } from '~/src/helpers/ApiResponse'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  // If the user is authenticated, block access to unauthenticated-only routes
  if (session?.user) {
    setResponseStatus(event, 400)
    return ApiResponse.error(400, 'Only unauthenticated').toJSON()
  }

  // Continue to the next handler if NOT authenticated
})
