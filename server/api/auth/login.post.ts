import { z } from 'zod'
import {ApiResponse} from "~~/src/helpers/ApiResponse";


const bodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
})

export default defineEventHandler(async (event) => {
    const { email, password } = await readValidatedBody(event, bodySchema.parse)

    if (email === 'admin@admin.com' && password === 'iamtheadmin') {
        // TODO: implement authentication logic
        await setUserSession(event, {
            user: {
                name: 'John Doe'
            }
        })
        return ApiResponse.success('Logged in successfully');
    }
})