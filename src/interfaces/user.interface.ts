import { User } from "src/generated/prisma";

export type UserRequest = Omit<User, "id" | "createdAt" | "updatedAt">;
export type UserUpdate = Partial<User>;
