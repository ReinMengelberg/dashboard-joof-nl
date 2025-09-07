import { ApiResponse } from "~~/server/utils/ApiResponse";
import authenticated from "@/server/utils/middleware/authenticated";
import { setHeader } from "h3";
import { UserRepository } from "~~/server/db/UserRepository";

export default eventHandler({
    onRequest: [authenticated],
    handler: async (event) => {
        const session = await getUserSession(event);

        if (!session?.user?.id) {
            return ApiResponse.success(null);
        }

        // Load latest user via repository
        const fresh = await UserRepository.findById(Number(session.user.id));

        // Shape to session-safe payload
        const user = fresh
            ? {
                id: fresh.id,
                name: fresh.name,
                email: fresh.email,
                admin: fresh.admin,
            }
            : null;

        // Prevent caching
        setHeader(event, "Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");

        // Update session with fresh user when available
        if (user) {
            await setUserSession(event, { ...session, user });
        }

        return ApiResponse.success(user);
    },
});



