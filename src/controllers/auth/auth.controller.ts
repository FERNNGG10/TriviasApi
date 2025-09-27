import { Request, Response } from "express";
import prisma from "@config/database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRequest } from "@interfaces/user.interface";
import { validationResult } from "express-validator";

export const registerController = async (req: Request, res: Response) => {
  const userData = req.body as UserRequest;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: "Validation errors", errors: errors.array() });
  }
  if (!userData.password) {
    return res.status(422).json({ message: "Password is required" });
  }
  const user = await prisma.user.create({
    data: {
      ...userData,
      roleId: 2,
      password: await bcrypt.hash(userData.password, 10),
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
  return res
    .status(201)
    .json({ message: "User registered successfully", user });
};

export const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: "Validation errors", errors: errors.array() });
  }
  const user = await prisma.user.findUnique({ where: { email: email } });
  if (!user || !user.status) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  if (!user.password) {
    return res.status(401).json({ message: "User has no password set" });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const accessToken = jwt.sign(
    {
      id: user.id,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "2h" }
  );
  return res.json({ message: "Authentication successful", accessToken });
};

export const googleCallback = async (req: Request, res: Response) => {
  try {
    const user = req.user as any;

    if (!user) {
      return res.status(401).json({
        message: "Google authentication failed",
      });
    }

    const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "2h",
    });

    return res.json({
      message: "Google authentication successful",
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        provider: user.provider,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Authentication error",
    });
  }
};
