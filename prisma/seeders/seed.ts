import { PrismaClient } from "../../src/generated/prisma";
import { roleSeeder } from "./role.seeder";
import { userSeeder } from "./user.seeder";
import { categorySeeder } from "./category.seeder";
import { quizzSeeder } from "./quizz.seeder";
import { questionSeeder } from "./question.seeder";
import { optionSeeder } from "./option.seeder";
import { scoreSeeder } from "./score.seeder";

const prisma = new PrismaClient();

async function main() {
  await roleSeeder(prisma);
  await userSeeder(prisma);
  await categorySeeder(prisma);
  await quizzSeeder(prisma);
  await questionSeeder(prisma);
  await optionSeeder(prisma);
  await scoreSeeder(prisma);

  console.log("Seeding completed.");
}

main().catch((err) => {
  console.warn("Error While generating Seed: \n", err);
});