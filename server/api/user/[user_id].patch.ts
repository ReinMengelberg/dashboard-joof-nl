import {z} from 'zod'
import {ApiResponse} from "~~/server/utils/ApiResponse";
import admin from "@/server/utils/middleware/admin";
import {UserRepository} from "~~/server/db/UserRepository";
import {hash, compare} from 'bcryptjs'

const bodySchema = z.object({
    name: z.string().min(1).optional(),
    email: z.email().optional(),
    old_password: z.string().min(8).optional(),
    new_password: z.string().min(8).optional(),
    new_password_confirm: z.string().min(8).optional(),
    admin: z.boolean().optional(),
}).refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
})

export default eventHandler({
    onRequest: [admin],
    handler: async (event) => {
        const idParam = getRouterParam(event, 'user_id')
        const id = idParam ? Number(idParam) : NaN

        if (!idParam || Number.isNaN(id)) {
            return ApiResponse.error(400, 'Invalid user id')
        }

        const body = await readValidatedBody(event, bodySchema.parse)

        const data: any = { ...body }

        // Handle password change if any of the password-related fields are present
        const wantsPasswordChange = !!(body.old_password || body.new_password || body.new_password_confirm)
        if (wantsPasswordChange) {
            if (!body.old_password || !body.new_password || !body.new_password_confirm) {
                return ApiResponse.error(400, 'All password fields (old_password, new_password, new_password_confirm) are required')
            }
            if (body.new_password !== body.new_password_confirm) {
                return ApiResponse.error(400, 'New passwords do not match')
            }

            const existing = await UserRepository.findById(id)
            if (!existing) {
                return ApiResponse.error(404, 'User not found')
            }

            const matches = await compare(body.old_password, (existing as any).password)
            if (!matches) {
                return ApiResponse.error(401, 'Invalid password')
            }

            data.password = await hash(body.new_password, 12)
        }

        // Remove transient fields so they are not persisted
        delete data.old_password
        delete data.new_password
        delete data.new_password_confirm

        try {
            const user = await UserRepository.update(id, data)
            const {password: _pw, ...safe} = user as any
            return ApiResponse.success(safe, 'User updated')
        } catch (e: any) {
            const msg = (e?.message || '').toLowerCase()
            if (msg.includes('not found')) {
                return ApiResponse.error(404, 'User not found')
            }
            if (msg.includes('already exists')) {
                return ApiResponse.error(409, 'A user with the provided unique field already exists.')
            }
            return ApiResponse.error(400, 'Failed to update user')
        }
    },
})
