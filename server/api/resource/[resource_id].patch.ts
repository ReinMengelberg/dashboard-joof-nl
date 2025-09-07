import { z } from 'zod'
import { ApiResponse } from "~~/server/utils/ApiResponse";
import admin from "@/server/utils/middleware/admin";
import { ResourceRepository } from "~~/server/db/ResourceRepository";

const bodySchema = z.object({
  name: z.string().min(1).optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided',
})

export default eventHandler({
  onRequest: [admin],
  handler: async (event) => {
    const idParam = getRouterParam(event, 'resource_id')
    const id = idParam ? Number(idParam) : NaN

    if (!idParam || Number.isNaN(id)) {
      return ApiResponse.error(400, 'Invalid resource id')
    }

    const body = await readValidatedBody(event, bodySchema.parse)

    try {
      const resource = await ResourceRepository.update(id, body)
      return ApiResponse.success(resource, 'Resource updated')
    } catch (e: any) {
      const msg = (e?.message || '').toLowerCase()
      if (msg.includes('not found')) {
        return ApiResponse.error(404, 'Resource not found')
      }
      if (msg.includes('already exists')) {
        return ApiResponse.error(409, 'A resource with the provided unique field already exists.')
      }
      return ApiResponse.error(400, 'Failed to update resource')
    }
  },
})
