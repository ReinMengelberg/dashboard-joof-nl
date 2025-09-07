import { z } from 'zod'
import { ApiResponse } from "~~/server/utils/ApiResponse";
import admin from "@/server/utils/middleware/admin";
import { UserRepository } from "~~/server/db/UserRepository";
import { hash } from 'bcryptjs'

const bodySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  admin: z.boolean().optional().default(false),
})

export default eventHandler({
  onRequest: [admin],
  handler: async (event) => {
    const { name, email, password, admin: isAdmin } = await readValidatedBody(event, bodySchema.parse)

    const hashed = await hash(password, 12)

    try {
      const user = await UserRepository.create({
        name,
        email,
        password: hashed,
        admin: isAdmin ?? false,
      })
      const { password: _pw, ...safe } = user as any
      return ApiResponse.success(safe, 'User created', 201)
    } catch (e: any) {
      const msg = (e?.message || '').toLowerCase()
      if (msg.includes('already exists')) {
        return ApiResponse.error(409, 'A user with the provided unique field already exists.')
      }
      return ApiResponse.error(400, 'Failed to create user')
    }
  },
})
