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
    
    { questionId: 4, text: "Hyper Text Markup Language", isCorrect: true },
    { questionId: 4, text: "High Tech Modern Language", isCorrect: false },
    { questionId: 4, text: "Hyperlink and Text Markup Language", isCorrect: false },

    { questionId: 5, text: "True", isCorrect: false },
    { questionId: 5, text: "False", isCorrect: true },

    { questionId: 6, text: "Paris", isCorrect: true },
    { questionId: 6, text: "London", isCorrect: false },
    { questionId: 6, text: "Berlin", isCorrect: false },

    { questionId: 7, text: "True", isCorrect: false },
    { questionId: 7, text: "False", isCorrect: true },
  ];
  for (const option of options) {
    await prisma.options.upsert({
      where: { id: options.indexOf(option) + 1 },
      update: {},
      create: option,
    });
  }
};
