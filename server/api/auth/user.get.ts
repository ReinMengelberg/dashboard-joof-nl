import { ApiResponse } from "~~/src/helpers/ApiResponse";
import { useUserSession } from "~/.nuxt/imports";
import authenticated from "~/server/middleware/authenticated"

export default eventHandler({
  onRequest: [authenticated],
  handler: async (event) => {
    const session = await getUserSession(event)
    // authenticated middleware guarantees session.user
    return ApiResponse.success(session.user)
  },
})
