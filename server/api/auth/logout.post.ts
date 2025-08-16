import { ApiResponse } from "~~/src/helpers/ApiResponse";

export default defineEventHandler(async (event) => {
  await clearUserSession(event)
  return ApiResponse.success('Logged out successfully')
})
