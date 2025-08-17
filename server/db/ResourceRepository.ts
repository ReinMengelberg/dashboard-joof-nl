import prisma from "./GeneralConnection";
import { Prisma, Resource, User } from "~~/generated/prisma";

export type CreateResourceData = Omit<Prisma.ResourceUncheckedCreateInput,
  "id" | "created_at" | "updated_at"
>;

export type UpdateResourceData = Omit<Prisma.ResourceUncheckedUpdateInput,
  "id" | "created_at" | "updated_at"
>;

export type ListResourcesParams = {
  skip?: number;
  take?: number;
  where?: Prisma.ResourceWhereInput;
  orderBy?: Prisma.ResourceOrderByWithRelationInput | Prisma.ResourceOrderByWithRelationInput[];
  include?: Prisma.ResourceInclude;
  select?: Prisma.ResourceSelect;
};

function mapPrismaError(err: unknown): never {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint failed
    if (err.code === "P2002") {
      throw new Error("A resource with the provided unique field already exists.");
    }
    // Record not found or other known errors
    if (err.code === "P2025") {
      throw new Error("Resource not found.");
    }
    // Foreign key constraint failed (e.g., assigning non-existing user/resource)
    if (err.code === "P2003") {
      throw new Error("Related record not found (user or resource).");
    }
  }
  // Fallback
  throw err as Error;
}

export const ResourceRepository = {
  async create(
    data: CreateResourceData,
    options?: { include?: Prisma.ResourceInclude; select?: Prisma.ResourceSelect }
  ): Promise<Resource> {
    try {
      return await prisma.resource.create({
        data,
        include: options?.include,
        select: options?.select as any,
      } as Prisma.ResourceCreateArgs);
    } catch (err) {
      mapPrismaError(err);
    }
  },

  async findById(
    id: number,
    options?: { include?: Prisma.ResourceInclude; select?: Prisma.ResourceSelect }
  ): Promise<Resource | null> {
    return prisma.resource.findUnique({
      where: { id },
      include: options?.include,
      select: options?.select as any,
    } as Prisma.ResourceFindUniqueArgs);
  },

  async findByName(
    name: string,
    options?: { include?: Prisma.ResourceInclude; select?: Prisma.ResourceSelect }
  ): Promise<Resource | null> {
    return prisma.resource.findUnique({
      where: { name },
      include: options?.include,
      select: options?.select as any,
    } as Prisma.ResourceFindUniqueArgs);
  },

  async list(params: ListResourcesParams = {}): Promise<Resource[]> {
    const { skip, take, where, orderBy, include, select } = params;
    return prisma.resource.findMany({
      skip,
      take,
      where,
      orderBy: orderBy as any,
      include,
      select: select as any,
    } as Prisma.ResourceFindManyArgs);
  },

  async update(
    id: number,
    data: UpdateResourceData,
    options?: { include?: Prisma.ResourceInclude; select?: Prisma.ResourceSelect }
  ): Promise<Resource> {
    try {
      return await prisma.resource.update({
        where: { id },
        data,
        include: options?.include,
        select: options?.select as any,
      } as Prisma.ResourceUpdateArgs);
    } catch (err) {
      mapPrismaError(err);
    }
  },

  async delete(id: number): Promise<boolean> {
    try {
      await prisma.resource.delete({ where: { id } });
      return true;
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2025"
      ) {
        // Not found
        return false;
      }
      throw err;
    }
  },

  // Many-to-many relation helpers between resources and users
  async assignUser(resourceId: number, userId: number): Promise<void> {
    try {
      await prisma.userResource.create({
        data: { resource_id: resourceId, user_id: userId },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
          // Unique constraint on (user_id, resource_id)
          throw new Error("User is already assigned to this resource.");
        }
        if (err.code === "P2003") {
          // FK constraint
          throw new Error("User or Resource does not exist.");
        }
      }
      throw err;
    }
  },

  async unassignUser(resourceId: number, userId: number): Promise<boolean> {
    const res = await prisma.userResource.deleteMany({
      where: { resource_id: resourceId, user_id: userId },
    });
    return res.count > 0;
  },

  async listUsers(resourceId: number): Promise<User[]> {
    return prisma.user.findMany({
      where: { resources: { some: { resource_id: resourceId } } },
    });
  },

  async listResourcesForUser(userId: number): Promise<Resource[]> {
    return prisma.resource.findMany({
      where: { users: { some: { user_id: userId } } },
    });
  },
};

export default ResourceRepository;
