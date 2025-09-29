import { body } from "express-validator";
import prisma from "@config/database";

export const createQuizzValidator = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 255 })
    .withMessage("Title must be at most 255 characters"),
  body("categoryId")
    .notEmpty()
    .isInt()
    .withMessage("Category ID is required and must be an integer")
    .custom(async (categoryId: number) => {
      if (!categoryId) return true;
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
      });
      if (!category) {
        throw new Error("Category ID does not exist");
      }
      return true;
    }),
  body("description")
    .notEmpty()
    .isString()
    .withMessage("Description must be a string"),
  body("difficulty")
    .notEmpty()
    .isIn(["easy", "medium", "hard"])
    .withMessage("Difficulty must be one of: easy, medium, hard"),
];
export const updateQuizzValidator = [
  body("title")
    .optional()
    .isLength({ max: 255 })
    .withMessage("Title must be at most 255 characters"),
  body("categoryId")
    .optional()
    .isInt()
    .withMessage("Category ID must be an integer")
    .custom(async (categoryId: number) => {
      if (!categoryId) return true;
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
      });
      if (!category) {
        throw new Error("Category ID does not exist");
      }
      return true;
    }),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
  body("difficulty")
    .optional()
    .isIn(["easy", "medium", "hard"])
    .withMessage("Difficulty must be one of: easy, medium, hard"),
];

export const createQuizzWithQuestionsValidator = [
  ...createQuizzValidator,
  body("questions")
    .isArray({ min: 1 })
    .withMessage("Questions must be a non-empty array"),
  body("questions.*.question")
    .notEmpty()
    .withMessage("Each question must have a question text")
    .isString()
    .withMessage("Question text must be a string"),
  body("questions.*.questionType")
    .notEmpty()
    .withMessage("Each question must have a question type")
    .isIn(["multiple_choice", "true-false"])
    .withMessage(
      "Question type must be either 'multiple_choice' or 'true_false'"
    ),
];

export const createQuizzWithOptionsValidator = [
  ...createQuizzWithQuestionsValidator,
  body("questions.*.options")
    .isArray({ min: 1 })
    .withMessage("Options must be a non-empty array"),
  body("questions.*.options.*.text")
    .notEmpty()
    .withMessage("Each option must have text")
    .isString()
    .withMessage("Option text must be a string"),
  body("questions.*.options.*.isCorrect")
    .notEmpty()
    .isBoolean()
    .withMessage("Option isCorrect must be a boolean"),
];
