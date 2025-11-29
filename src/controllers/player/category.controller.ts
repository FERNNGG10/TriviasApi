import { Request, Response } from "express";
import prisma from "@config/database";

export const getCategories = async (_: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { id: "asc" },
    });
    return res.status(200).json({ categories });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching categories" });
  }
};
