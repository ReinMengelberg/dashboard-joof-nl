import { z } from 'zod'
import { ApiResponse } from "~~/server/utils/ApiResponse";
import admin from "@/server/utils/middleware/admin";
import { ResourceRepository } from "~~/server/db/ResourceRepository";

const bodySchema = z.object({
  resource_id: z.number().int().positive(),
  user_id: z.number().int().positive(),
})

export default eventHandler({
  onRequest: [admin],
  handler: async (event) => {
    const body = await readValidatedBody(event, bodySchema.parse)

    try {
      await ResourceRepository.assignUser(body.resource_id, body.user_id)
      return ApiResponse.success({ resource_id: body.resource_id, user_id: body.user_id }, 'User assigned to resource', 201)
    } catch (e: any) {
      const msg = (e?.message || '').toLowerCase()
      if (msg.includes('already assigned') || msg.includes('already exists')) {
        return ApiResponse.error(409, 'User is already assigned to this resource')
      }
      if (msg.includes('does not exist') || msg.includes('not found') || msg.includes('related record')) {
        return ApiResponse.error(404, 'User or Resource not found')
      }
      return ApiResponse.error(400, 'Failed to assign user to resource')
    }
  },
})
