import { Request, Response } from "express";
import prisma from "@config/database";

export const getPlayerStats = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Obtener todas las puntuaciones del jugador
    const playerScores = await prisma.quizScores.findMany({
      where: { userId },
      include: {
        quiz: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calcular estadísticas
    const totalQuizzesPlayed = playerScores.length;
    const totalScore = playerScores.reduce((sum: number, score: any) => sum + score.score, 0);
    const averageScore =
      totalQuizzesPlayed > 0 ? Math.round(totalScore / totalQuizzesPlayed) : 0;

    // Encontrar el mejor puntaje
    const bestScore =
      playerScores.length > 0
        ? Math.max(...playerScores.map((s: any) => s.score))
        : 0;

    // Encontrar el peor puntaje
    const worstScore =
      playerScores.length > 0
        ? Math.min(...playerScores.map((s: any) => s.score))
        : 0;

    // Puntajes por categoría
    const scoresByCategory: Record<
      string,
      { total: number; count: number; average: number }
    > = {};

    playerScores.forEach((score: any) => {
      const categoryName = score.quiz.category.name;
      if (!scoresByCategory[categoryName]) {
        scoresByCategory[categoryName] = { total: 0, count: 0, average: 0 };
      }
      scoresByCategory[categoryName].total += score.score;
      scoresByCategory[categoryName].count += 1;
    });

    // Calcular promedios por categoría
    Object.keys(scoresByCategory).forEach((category) => {
      const data = scoresByCategory[category];
      if (data) {
        data.average = Math.round(data.total / data.count);
      }
    });

    // Últimos 5 quizzes jugados
    const recentQuizzes = playerScores.slice(0, 5).map((score: any) => ({
      quizId: score.quizId,
      quizTitle: score.quiz.title,
      categoryName: score.quiz.category.name,
      score: score.score,
      playedAt: score.createdAt,
    }));

    // Total de categorías jugadas
    const categoriesPlayed = new Set(
      playerScores.map((s: any) => s.quiz.categoryId)
    ).size;

    return res.status(200).json({
      stats: {
        totalQuizzesPlayed,
        averageScore,
        bestScore,
        worstScore,
        categoriesPlayed,
        scoresByCategory,
        recentQuizzes,
      },
    });
  } catch (error) {
    console.error("Error fetching player stats:", error);
    return res.status(500).json({ message: "Error fetching player stats" });
  }
};

export const getPlayerHistory = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const history = await prisma.quizScores.findMany({
      where: { userId },
      include: {
        quiz: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedHistory = history.map((score: any) => ({
      id: score.id,
      quizId: score.quizId,
      quizTitle: score.quiz.title,
      quizDescription: score.quiz.description,
      categoryName: score.quiz.category.name,
      difficulty: score.quiz.difficulty,
      score: score.score,
      playedAt: score.createdAt,
    }));

    return res.status(200).json({
      history: formattedHistory,
      totalPlayed: formattedHistory.length,
    });
  } catch (error) {
    console.error("Error fetching player history:", error);
    return res.status(500).json({ message: "Error fetching player history" });
  }
};
