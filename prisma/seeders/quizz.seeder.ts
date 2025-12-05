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
    {
      userId: 1,
      categoryId: 3, // Assuming category 3 exists or will be created
      title: "General Knowledge",
      description: "Test your general knowledge.",
      difficulty: "easy",
    },
    {
      userId: 2,
      categoryId: 4, // Assuming category 4 exists or will be created
      title: "Geography Challenge",
      description: "How well do you know the world?",
      difficulty: "hard",
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