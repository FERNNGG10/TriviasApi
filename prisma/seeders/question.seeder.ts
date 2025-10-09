import { PrismaClient, QuestionType } from "../../src/generated/prisma";

export const questionSeeder = async (prisma: PrismaClient) => {
  const questions = [
    {
      quizId: 1,
      question: "What is the chemical symbol for water?",
      questionType: QuestionType.multiple_choice,
    },
    {
      quizId: 1,
      question: "The earth is flat.",
      questionType: QuestionType.true_false,
    },
    {
      quizId: 2,
      question: "Who was the first president of the United States?",
      questionType: QuestionType.multiple_choice,
    },
  ];
  for (const question of questions) {
    await prisma.question.upsert({
      where: { id: questions.indexOf(question) + 1 },
      update: {},
      create: question,
    });
  }
};