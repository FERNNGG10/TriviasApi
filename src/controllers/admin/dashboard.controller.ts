import { Request, Response } from "express";
import prisma from "@config/database";

export const getDashboardStats = async (_: Request, res: Response) => {
  try {
    const [totalQuizzes, totalCategories, totalUsers, totalQuestions] =
      await Promise.all([
        prisma.quizzes.count(),
        prisma.category.count(),
        prisma.user.count(),
        prisma.question.count(),
      ]);

    return res.status(200).json({
      stats: {
        totalQuizzes,
        totalCategories,
        totalUsers,
        totalQuestions,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return res.status(500).json({ message: "Error fetching dashboard stats" });
  }
};
