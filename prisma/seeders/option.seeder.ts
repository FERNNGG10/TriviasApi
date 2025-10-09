import { PrismaClient } from "../../src/generated/prisma";

export const optionSeeder = async (prisma: PrismaClient) => {
  const options = [
    { questionId: 1, text: "H2O", isCorrect: true },
    { questionId: 1, text: "O2", isCorrect: false },
    { questionId: 1, text: "CO2", isCorrect: false },

    { questionId: 2, text: "True", isCorrect: false },
    { questionId: 2, text: "False", isCorrect: true },

    { questionId: 3, text: "George Washington", isCorrect: true },
    { questionId: 3, text: "Abraham Lincoln", isCorrect: false },
    { questionId: 3, text: "Thomas Jefferson", isCorrect: false },
  ];
  for (const option of options) {
    await prisma.options.upsert({
      where: { id: options.indexOf(option) + 1 },
      update: {},
      create: option,
    });
  }
};
