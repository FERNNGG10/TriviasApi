import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { OptionRequest, OptionUpdate } from "@interfaces/option.interface";
import prisma from "@config/database";

export const getAll = async (req: Request, res: Response) => {
  const options = await prisma.options.findMany({
    orderBy: { id: "asc" },
  });
  return res.status(200).json({ options });
};

export const getById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const option = await prisma.options.findUnique({
    where: { id },
  });
  if (!option) {
    return res.status(404).json({ message: "Option not found" });
  }
  return res.status(200).json({ option });
};

export const create = async (req: Request, res: Response) => {
  const optionData = req.body as OptionRequest;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res

      .status(422)
      .json({ message: "Validation errors", errors: errors.array() });
  }
  const option = await prisma.options.create({
    data: optionData,
  });
  return res.status(201).json({ option });
};

export const update = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const optionData = req.body as OptionUpdate;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: "Validation errors", errors: errors.array() });
  }
  const option = await prisma.options.update({
    where: { id },
    data: optionData,
  });
  return res.status(200).json({ option });
};
