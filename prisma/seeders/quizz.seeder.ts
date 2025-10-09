import { PrismaClient } from "../../src/generated/prisma";

export const quizzSeeder = async (prisma: PrismaClient) => {
  const quizzes = [
    {
      userId: 1,
      categoryId: 1,
      title: "Science Quiz",
      description: "A quiz about science.",
      difficulty: "easy",
    },
    {
      userId: 2,
      categoryId: 2,
      title: "History Quiz",
      description: "A quiz about history.",
      difficulty: "medium",
    },
  ];
  for (const quizz of quizzes) {
    await prisma.quizzes.upsert({
      where: { id: quizzes.indexOf(quizz) + 1 },
      update: {},
      create: quizz,
    });
  }
};