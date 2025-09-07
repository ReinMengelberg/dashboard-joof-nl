import { ApiResponse } from "~~/server/utils/ApiResponse";
import admin from "@/server/utils/middleware/admin";
import { ResourceRepository } from "~~/server/db/ResourceRepository";

export default eventHandler({
  onRequest: [admin],
  handler: async (event) => {
    const idParam = getRouterParam(event, 'resource_id')
    const id = idParam ? Number(idParam) : NaN

    if (!idParam || Number.isNaN(id)) {
      return ApiResponse.error(400, 'Invalid resource id')
    }

    const ok = await ResourceRepository.delete(id)
    if (!ok) {
      return ApiResponse.error(404, 'Resource not found')
    }

    setResponseStatus(event, 204)
    return ApiResponse.success(null, null, 204)
  },
})
