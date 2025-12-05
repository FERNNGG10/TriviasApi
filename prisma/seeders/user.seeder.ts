import { PrismaClient } from "../../src/generated/prisma";
import bcrypt from "bcrypt";

export const userSeeder = async (prisma: PrismaClient) => {
  const users = [
    {
      name: "Fernando Admin",
      email: "fgolmos10@gmail.com",
      password: await bcrypt.hash("admin123", 10),
      roleId: 1,
      status: true,
    },
    {
      name: "Miguel Admin",
      email: "miguelvillalpando19@gmail.com",
      password: await bcrypt.hash("admin123", 10),
      roleId: 1,
      status: true,
    },
    {
      name: "Laura Player",
      email: "fernando.g.olmos10@gmail.com",
      password: await bcrypt.hash("player123", 10),
      roleId: 2,
      status: true,
    },
    {
      name: "Carlos Player",
      email: "carlos@gmail.com",
      password: await bcrypt.hash("player123", 10),
      roleId: 2,
      status: true,
    },
    {
      name: "Ana Player",
      email: "ana@gmail.com",
      password: await bcrypt.hash("player123", 10),
      roleId: 2,
      status: true,
    },
    {
      name: "Pedro Player",
      email: "pedro@gmail.com",
      password: await bcrypt.hash("player123", 10),
      roleId: 2,
      status: true,
    },
  ];
  for (const userData of users) {
    await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        roleId: userData.roleId,
        status: userData.status,
      },
    });
  }
};