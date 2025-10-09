import { Request, Response } from "express";
import prisma from "@config/database";
import { validationResult } from "express-validator";
import {
  CategoryRequest,
  CategoryUpdate,
} from "@interfaces/category.interface";

export const getAll = async (_: Request, res: Response) => {
  const categories = await prisma.category.findMany({
    orderBy: { id: "asc" },
  });
  return res.status(200).json({ categories });
};

export const getById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const category = await prisma.category.findUnique({
    where: { id },
  });
  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }
  return res.status(200).json({ category });
};

export const create = async (req: Request, res: Response) => {
  const categoryData = req.body as CategoryRequest;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: "Validation errors", errors: errors.array() });
  }
  const category = await prisma.category.create({
    data: categoryData,
  });
  return res.status(201).json({ category });
};

export const update = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const categoryData = req.body as CategoryUpdate;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: "Validation errors", errors: errors.array() });
  }
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }
  const updatedCategory = await prisma.category.update({
    where: { id },
    data: categoryData,
  });
  return res.status(200).json({ category: updatedCategory });
};
