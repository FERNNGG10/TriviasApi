import { PrismaClient } from "../../src/generated/prisma";

export const scoreSeeder = async (prisma: PrismaClient) => {
  await prisma.quizScores.deleteMany({});

  const scores = [
    {
      userId: 3,
      quizId: 1,
      score: Math.floor(Math.random() * 101),
    },
    {
      userId: 4,
      quizId: 2,
      score: Math.floor(Math.random() * 101),
    },
    {
      userId: 5,
      quizId: 1,
      score: Math.floor(Math.random() * 101),
    },
  ];

  for (const scoreData of scores) {
    await prisma.quizScores.create({
      data: scoreData,
    });
  }
};
