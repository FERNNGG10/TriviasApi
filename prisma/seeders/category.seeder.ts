import { PrismaClient } from "../../src/generated/prisma";

export const categorySeeder = async (prisma: PrismaClient) => {
  const categories = [
    { name: "Science" },
    { name: "History" },
    { name: "Programming" },
  ];
  for (const category of categories) {
    await prisma.category.upsert({
      where: { id: categories.indexOf(category) + 1 },
      update: {},
      create: category,
    });
  }
};