import { Request, Response } from "express";
import prisma from "@config/database";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { UserRequest, UserUpdate } from "@interfaces/user.interface";

export const getAll = async (_: Request, res: Response) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      provider: true,
      role: { select: { name: true } },
      createdAt: true,
    },
    orderBy: { id: "asc" },
  });
  return res.status(200).json({ users });
};

export const getById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      provider: true,
      role: { select: { name: true } },
      createdAt: true,
    },
  });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  return res.status(200).json({ user });
};

export const create = async (req: Request, res: Response) => {
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
      password: await bcrypt.hash(userData.password, 10),
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: { select: { name: true } },
      provider: true,
    },
  });
  return res.status(201).json({ message: "User created successfully", user });
};

export const update = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const userData = req.body as UserUpdate;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: "Validation errors", errors: errors.array() });
  }
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  if (userData.password) {
    userData.password = await bcrypt.hash(userData.password, 10);
  }
  const updatedUser = await prisma.user.update({
    where: { id },
    data: userData,
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      provider: true,
      role: { select: { name: true } },
      createdAt: true,
    },
  });
  return res
    .status(200)
    .json({ message: "User updated successfully", user: updatedUser });
};

export const softDelete = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  await prisma.user.update({ where: { id }, data: { status: false } });
  return res.status(200).json({ message: "User deleted successfully" });
};
