import { body } from "express-validator";

export const createAnswerValidator = [
  body("questionId")
    .isInt({ gt: 0 })
    .withMessage("Question ID must be a positive integer"),
  body("optionId")
    .isInt({ gt: 0 })
    .withMessage("Option ID must be a positive integer"),
];
