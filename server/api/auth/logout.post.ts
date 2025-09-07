import { ApiResponse } from "~~/server/utils/ApiResponse";
import authenticated from "@/server/utils/middleware/authenticated"

export default eventHandler({
  onRequest: [authenticated],
  handler: async (event) => {
    await clearUserSession(event)
    return ApiResponse.success('Logged out successfully')
  },
})
