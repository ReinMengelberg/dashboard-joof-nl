import { z } from 'zod'
import { ApiResponse } from "~~/server/utils/ApiResponse";
import admin from "@/server/utils/middleware/admin";
import { ResourceRepository } from "~~/server/db/ResourceRepository";

const bodySchema = z.object({
  name: z.string().min(1),
})

export default eventHandler({
  onRequest: [admin],
  handler: async (event) => {
    const { name } = await readValidatedBody(event, bodySchema.parse)

    try {
      const resource = await ResourceRepository.create({
        name,
      })
      return ApiResponse.success(resource, 'Resource created', 201)
    } catch (e: any) {
      const msg = (e?.message || '').toLowerCase()
      if (msg.includes('already exists')) {
        return ApiResponse.error(409, 'A resource with the provided unique field already exists.')
      }
      return ApiResponse.error(400, 'Failed to create resource')
    }
  },
})
