import { Category } from "src/generated/prisma";

export type CategoryRequest = Omit<Category, "id" | "createdAt">;
export type CategoryUpdate = Partial<Category>;
