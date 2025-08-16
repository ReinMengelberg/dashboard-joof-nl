import prisma from "./GeneralConnection";
import { Prisma, User } from "~~/generated/prisma";

export type CreateUserData = Omit<Prisma.UserUncheckedCreateInput,
  "id" | "created_at" | "updated_at"
>;

export type UpdateUserData = Omit<Prisma.UserUncheckedUpdateInput,
  "id" | "created_at" | "updated_at"
>;

export type ListUsersParams = {
  skip?: number;
  take?: number;
  where?: Prisma.UserWhereInput;
  orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
  include?: Prisma.UserInclude;
  select?: Prisma.UserSelect;
};

function mapPrismaError(err: unknown): never {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint failed
    if (err.code === "P2002") {
      throw new Error("A user with the provided unique field already exists.");
    }
    // Record not found or other known errors
    if (err.code === "P2025") {
      throw new Error("User not found.");
    }
  }
  // Fallback
  throw err as Error;
}

export const UserRepository = {
  async create(data: CreateUserData, options?: { include?: Prisma.UserInclude; select?: Prisma.UserSelect }): Promise<User> {
    try {
      return await prisma.user.create({
        data,
        include: options?.include,
        select: options?.select as any,
      } as Prisma.UserCreateArgs);
    } catch (err) {
      mapPrismaError(err);
    }
  },

  async findById(id: number, options?: { include?: Prisma.UserInclude; select?: Prisma.UserSelect }): Promise<User | null> {
    return prisma.user.findUnique({
        where: {id},
        include: options?.include,
        select: options?.select as any,
    } as Prisma.UserFindUniqueArgs);
  },

  async findByEmail(email: string, options?: { include?: Prisma.UserInclude; select?: Prisma.UserSelect }): Promise<User | null> {
    return prisma.user.findUnique({
        where: {email},
        include: options?.include,
        select: options?.select as any,
    } as Prisma.UserFindUniqueArgs);
  },

  async list(params: ListUsersParams = {}): Promise<User[]> {
    const { skip, take, where, orderBy, include, select } = params;
    return prisma.user.findMany({
        skip,
        take,
        where,
        orderBy: orderBy as any,
        include,
        select: select as any,
    } as Prisma.UserFindManyArgs);
  },

  async update(id: number, data: UpdateUserData, options?: { include?: Prisma.UserInclude; select?: Prisma.UserSelect }): Promise<User> {
    try {
      return await prisma.user.update({
        where: { id },
        data,
        include: options?.include,
        select: options?.select as any,
      } as Prisma.UserUpdateArgs);
    } catch (err) {
      mapPrismaError(err);
    }
  },

  async delete(id: number): Promise<boolean> {
    try {
      await prisma.user.delete({ where: { id } });
      return true;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
        // Not found
        return false;
      }
      throw err;
    }
  },
};

export default UserRepository;
