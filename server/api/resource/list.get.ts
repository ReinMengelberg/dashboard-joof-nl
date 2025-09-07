import { ApiResponse } from "~~/server/utils/ApiResponse";
import admin from "@/server/utils/middleware/admin";
import { ResourceRepository } from "~~/server/db/ResourceRepository";
import type { Prisma } from "~~/generated/prisma";

export default eventHandler({
  onRequest: [admin],
  handler: async (event) => {
    const query = getQuery(event);

    const skip = query.skip ? Number(query.skip) : undefined;
    const rawTake = query.take ? Number(query.take) : undefined;
    const q = typeof query.q === 'string' ? query.q.trim() : undefined;

    if ((skip !== undefined && Number.isNaN(skip)) || (rawTake !== undefined && Number.isNaN(rawTake))) {
      return ApiResponse.error(400, 'Invalid pagination parameters');
    }

    // Put a reasonable cap on take
    const take = rawTake !== undefined ? Math.min(Math.max(rawTake, 1), 100) : 25;

    const where: Prisma.ResourceWhereInput | undefined = q
      ? {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
          ],
        }
      : undefined;

    const resources = await ResourceRepository.list({ skip, take, where });

    return ApiResponse.success(resources);
  },
});
