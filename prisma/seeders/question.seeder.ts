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
    {
      quizId: 3,
      question: "What does HTML stand for?",
      questionType: QuestionType.multiple_choice,
    },
    {
      quizId: 3,
      question: "Python is a compiled language.",
      questionType: QuestionType.true_false,
    },
    {
      quizId: 4,
      question: "What is the capital of France?",
      questionType: QuestionType.multiple_choice,
    },
    {
      quizId: 4,
      question: "The Amazon River is the longest river in the world.",
      questionType: QuestionType.true_false,
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