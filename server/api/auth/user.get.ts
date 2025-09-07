import { ApiResponse } from "~~/server/utils/ApiResponse";
import { useUserSession } from "~/.nuxt/imports";
import authenticated from "@/server/utils/middleware/authenticated"

export default eventHandler({
  onRequest: [authenticated],
  handler: async (event) => {
    const session = await getUserSession(event)
    // authenticated middleware guarantees session.user
    return ApiResponse.success(session.user)
  },
})
