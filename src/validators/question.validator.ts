import { body } from "express-validator";
import prisma from "@config/database";

export const createQuestionValidator = [
  body("question").notEmpty().withMessage("Question text is required"),
  body("quizzId")
    .isInt()
    .withMessage("Quizz ID must be an integer")
    .custom(async (quizzId: number) => {
      if (!quizzId) return true;
      const quizz = await prisma.quizzes.findUnique({
        where: { id: quizzId },
      });
      if (!quizz) {
        throw new Error("Quizz ID does not exist");
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
  body("quizzId")
    .optional()
    .isInt()
    .withMessage("Quizz ID must be an integer")
    .custom(async (quizzId: number) => {
      if (!quizzId) return true;
      const quizz = await prisma.quizzes.findUnique({
        where: { id: quizzId },
      });
      if (!quizz) {
        throw new Error("Quizz ID does not exist");
      }
      return true;
    }),
  body("questionType")
    .optional()
    .isIn(["multiple_choice", "true_false"])
    .withMessage("Invalid question type"),
];
