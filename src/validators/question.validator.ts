import { body } from "express-validator";
import prisma from "@config/database";

export const createQuestionValidator = [
  body("question").notEmpty().withMessage("Question text is required"),
  body("quizId")
    .isInt()
    .withMessage("Quiz ID must be an integer")
    .custom(async (quizId: number) => {
      if (!quizId) return true;
      const quiz = await prisma.quizzes.findUnique({
        where: { id: quizId },
      });
      if (!quiz) {
        throw new Error("Quiz ID does not exist");
      }
    }),
  body("questionType")
    .isIn(["multiple_choice", "true_false"])
    .withMessage("Invalid question type"),
];

export const updateQuestionValidator = [
  body("question")
    .optional()
    .notEmpty()
    .withMessage("Question text is required"),
  body("quizId")
    .optional()
    .isInt()
    .withMessage("Quiz ID must be an integer")
    .custom(async (quizId: number) => {
      if (!quizId) return true;
      const quiz = await prisma.quizzes.findUnique({
        where: { id: quizId },
      });
      if (!quiz) {
        throw new Error("Quiz ID does not exist");
      }
      return true;
    }),
  body("questionType")
    .optional()
    .isIn(["multiple_choice", "true_false"])
    .withMessage("Invalid question type"),
];
