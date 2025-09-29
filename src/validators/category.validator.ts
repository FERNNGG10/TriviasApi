import { body } from "express-validator";

export const createCategoryValidator = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ max: 255 })
    .withMessage("Name must be at most 255 characters"),
];

export const updateCategoryValidator = [
  body("name")
    .optional()
    .isLength({ max: 255 })
    .withMessage("Name must be at most 255 characters"),
];
