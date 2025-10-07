import { body } from "express-validator";
import prisma from "@config/database";

export const createOptionValidator = [
  body("text")
    .notEmpty()
    .withMessage("Option text is required")
    .isLength({ max: 255 })
    .withMessage("Option text must be at most 255 characters"),
  body("isCorrect").isBoolean().withMessage("isCorrect must be a boolean"),
  body("questionId")
    .isInt()
    .withMessage("Question ID must be an integer")
    .custom(async (questionId: number) => {
      if (!questionId) return true;
      const question = await prisma.question.findUnique({
        where: { id: questionId },
      });
      if (!question) {
        throw new Error("Question ID does not exist");
      }
      return true;
    }),
];

export const updateOptionValidator = [
  body("text")
    .optional()
    .notEmpty()
    .withMessage("Option text is required")
    .isLength({ max: 255 })
    .withMessage("Option text must be at most 255 characters"),
  body("isCorrect")
    .optional()
    .isBoolean()
    .withMessage("isCorrect must be a boolean"),
  body("questionId")
    .optional()
    .isInt()
    .withMessage("Question ID must be an integer")
    .custom(async (questionId: number) => {
      if (!questionId) return true;
      const question = await prisma.question.findUnique({
        where: { id: questionId },
      });
      if (!question) {
        throw new Error("Question ID does not exist");
      }
      return true;
    }),
];
