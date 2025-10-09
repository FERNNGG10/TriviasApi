import { PrismaClient, RoleName } from "../../src/generated/prisma";

export const roleSeeder = async (prisma: PrismaClient) => {
  const roles = [RoleName.admin, RoleName.player];
  for (const roleName of roles) {
    await prisma.role.upsert({
      where: { id: roles.indexOf(roleName) + 1 },
      update: {},
      create: { name: roleName },
    });
  }
};