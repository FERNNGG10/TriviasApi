import { PrismaClient, RoleName } from "../../src/generated/prisma";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

async function main() {
  const roles = [RoleName.admin, RoleName.player];
  for (const roleName of roles) {
    await prisma.role.create({
      data: { name: roleName },
    });
  }
  const users = [
    {
      name: "Fernando Admin",
      email: "fernando@gmail.com",
      password: await bcrypt.hash("admin123", 10),
      roleId: 1,
      status: true,
    },
    {
      name: "Miguel Admin",
      email: "miguel@gmail.com",
      password: await bcrypt.hash("admin123", 10),
      roleId: 1,
      status: true,
    },
  ];
  for (const userData of users) {
    await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        roleId: userData.roleId,
      },
    });
  }

  console.log("Seeding completed.");
}

main().catch((err) => {
  console.warn("Error While generating Seed: \n", err);
});
