import { ApiResponse } from "~~/src/helpers/ApiResponse";
import { getUserSession } from "#auth-utils";

export default eventHandler({
  onRequest: [authenticated],
  handler: async (event) => {
    const session = await getUserSession(event)
    // authenticated middleware guarantees session.user
    return ApiResponse.success(session.user)
  },
})
