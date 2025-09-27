import { body } from "express-validator";
import prisma from "@config/database";

export const createUserValidator = [
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
    .isLength({ min: 8 })
    .withMessage("Password is required and must be at least 8 characters long"),
  body("roleId")
    .notEmpty()
    .isInt()
    .withMessage("Role ID is required and must be an integer")
    .custom(async (roleId: number) => {
      if (!roleId) return true;
      const role = await prisma.role.findUnique({ where: { id: roleId } });
      if (!role) {
        throw new Error("Role ID does not exist");
      }
      return true;
    }),
];

export const updateUserValidator = [
  body("name")
    .optional()
    .isString()
    .isLength({ max: 100 })
    .withMessage("Name must be a string with max length 100"),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Email inválido")
    .custom(async (email: string, { req }) => {
      if (!email) return true;
      const user = await prisma.user.findUnique({ where: { email } });

      const userId = req?.params?.id ? parseInt(req.params.id) : null;

      if (user && user.id !== userId) {
        throw new Error("El email ya está en uso");
      }
      return true;
    }),
  body("password")
    .optional()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .custom((value) => {
      if (value && value.trim() === "") {
        throw new Error("Password cannot be empty if provided");
      }
      return true;
    }),
  body("status")
    .optional()
    .isBoolean()
    .withMessage("Status must be a boolean value"),
  body("roleId")
    .optional()
    .isInt()
    .withMessage("Role ID must be an integer")
    .custom(async (roleId: number) => {
      if (!roleId) return true;
      const role = await prisma.role.findUnique({ where: { id: roleId } });
      if (!role) {
        throw new Error("Role ID does not exist");
      }
      return true;
    }),
];
