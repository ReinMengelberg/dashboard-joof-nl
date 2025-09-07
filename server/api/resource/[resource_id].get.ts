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

    const resource = await ResourceRepository.findById(id)
    if (!resource) {
      return ApiResponse.error(404, 'Resource not found')
    }

    return ApiResponse.success(resource)
  },
})
