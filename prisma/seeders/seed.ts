import { PrismaClient, RoleName } from "../../src/generated/prisma";
const prisma = new PrismaClient();

async function main() {
  const roles = [RoleName.admin, RoleName.player];
  for (const roleName of roles) {
    await prisma.role.create({
      data: { name: roleName },
    });
  }
  console.log("Seeding completed.");
}

main().catch((err) => {
  console.warn("Error While generating Seed: \n", err);
});
