import { Request, Response } from "express";
import prisma from "@config/database";
import { Prisma } from "src/generated/prisma";
import { Answer } from "@interfaces/answer.interface";

export const playQuiz = async (req: Request, res: Response) => {
  try {
    const quizId = Number(req.params.quizId);
    const userId = req.user?.id;
    const answers: Answer[] = req.body.answers;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!answers || !Array.isArray(answers)) {
      return res
        .status(400)
        .json({ message: "Se requiere un array de 'answers'." });
    }

    const questions = await prisma.question.findMany({
      where: { quizId },
      select: { id: true },
    });

    if (!questions) {
      return res.status(404).json({ message: "Quizz not found" });
    }
    const totalQuestions = questions.length;

    const correctOptions = await prisma.options.findMany({
      where: {
        question: {
          quizId: quizId,
        },
        isCorrect: true,
      },
      select: {
        id: true,
        questionId: true,
      },
    });

    let correctAnswersCount = 0;
    for (const userAnswer of answers) {
      const isCorrect = correctOptions.some(
        (correct) =>
          correct.questionId === userAnswer.questionId &&
          correct.id === userAnswer.optionId
      );

      if (isCorrect) {
        correctAnswersCount++;
      }
    }

    const score = Math.round((correctAnswersCount / totalQuestions) * 100);

    await prisma.quizScores.create({
      data: {
        userId: userId,
        quizId: quizId,
        score: score,
      },
    });

    return res.status(200).json({
      message: "Quiz played successfully",
      totalQuestions,
      correctAnswers: correctAnswersCount,
      score,
    });
  } catch (error) {
    console.error("Error al jugar el quiz:", error);
    return res.status(500).json({ message: "Ocurrió un error en el servidor" });
  }
};

export const getQuizzes = async (req: Request, res: Response) => {
  const { categoryId, played, mostPlayed, oldest, news } = req.query;

  try {
    const where: Prisma.QuizzesWhereInput = {};
    const orderBy: Prisma.QuizzesOrderByWithRelationInput[] = [];

    if (categoryId) {
      where.categoryId = Number(categoryId);
    }

    if (played) {
      where.QuizScores = {
        some: {},
      };
    }

    if (mostPlayed) {
      orderBy.push({
        QuizScores: {
          _count: "desc",
        },
      });
    }

    if (news) {
      orderBy.push({
        createdAt: "desc",
      });
    } else if (oldest) {
      orderBy.push({
        createdAt: "asc",
      });
    }

    if (orderBy.length === 0) {
      orderBy.push({
        createdAt: "desc",
      });
    }

    const quizzes = await prisma.quizzes.findMany({
      where,
      include: {
        _count: {
          select: {
            QuizScores: true,
          },
        },
      },
      orderBy,
    });

    return res.status(200).json({ quizzes });
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
