import { Role } from "src/generated/prisma";

export type RoleRequest = Omit<Role, "id">;
export type RoleUpdate = Partial<Role>;
