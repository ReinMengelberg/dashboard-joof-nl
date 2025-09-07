import { ApiResponse } from "~~/server/utils/ApiResponse";
import admin from "@/server/utils/middleware/admin";
import { UserRepository } from "~~/server/db/UserRepository";

export default eventHandler({
  onRequest: [admin],
  handler: async (event) => {
    const idParam = getRouterParam(event, 'user_id')
    const id = idParam ? Number(idParam) : NaN

    if (!idParam || Number.isNaN(id)) {
      return ApiResponse.error(400, 'Invalid user id')
    }

    const ok = await UserRepository.delete(id)
    if (!ok) {
      return ApiResponse.error(404, 'User not found')
    }

    setResponseStatus(event, 204)
    return ApiResponse.success(null, null, 204)
  },
})
