import { ApiResponse } from "~~/src/helpers/ApiResponse";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  // Return the user object from the session (or null if not logged in)
  return ApiResponse.success(session?.user ?? null)
})
