import { Request, Response } from "express";
import prisma from "@config/database";

export const getAll = async (req: Request, res: Response) => {
  const roles = await prisma.role.findMany({
    orderBy: { id: "asc" },
  });
  return res.status(200).json({ roles });
};

export const getById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const role = await prisma.role.findUnique({
    where: { id },
  });
  if (!role) {
    return res.status(404).json({ message: "Role not found" });
  }
  return res.status(200).json({ role });
};
