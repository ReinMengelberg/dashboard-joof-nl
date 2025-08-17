import { z } from 'zod'
import { ApiResponse } from "~~/src/helpers/ApiResponse";
import { UserRepository } from "~~/server/db/UserRepository";
import { setResponseStatus } from 'h3'

const bodySchema = z.object({
    email: z.email(),
    password: z.string().min(8)
})

export default eventHandler({
    onRequest: [unauthenticated],
    handler: async (event) => {
        const { email, password } = await readValidatedBody(event, bodySchema.parse)

        // Find user in DB
        const user = await UserRepository.findByEmail(email)

        // If no user or password mismatch -> 401
        if (!user || user.password !== password) {
            setResponseStatus(event, 401)
            return ApiResponse.error(401, 'Invalid credentials')
        }

        // Establish session with Auth utils
        await setUserSession(event, {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                admin: user.admin,
            },
        })

        return ApiResponse.success('Logged in successfully')
    },
})
