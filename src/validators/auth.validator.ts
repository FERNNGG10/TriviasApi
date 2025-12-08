import { body } from "express-validator";
import prisma from "@config/database";

export const registerValidator = [
  body("name")
    .notEmpty()
    .isString()
    .isLength({ max: 100 })
    .withMessage("Name is required and must be a string with max length 100"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Valid email is required")
    .custom(async (email: string) => {
      if (!email) return true;
      const userExists = await prisma.user.findUnique({ where: { email } });
      if (userExists) {
        throw new Error("Email already in use");
      }
      return true;
    }),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Password must contain at least one uppercase letter and one number"),
];

export const loginValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];
