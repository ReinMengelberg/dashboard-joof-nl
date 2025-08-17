import { ApiResponse } from "~~/src/helpers/ApiResponse";

export default eventHandler({
  onRequest: [authenticated],
  handler: async (event) => {
    await clearUserSession(event)
    return ApiResponse.success('Logged out successfully')
  },
})
