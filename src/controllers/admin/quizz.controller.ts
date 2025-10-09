import { Request, Response } from "express";
import prisma from "@config/database";
import { validationResult } from "express-validator";
import {
  QuizzRequest,
  QuizzUpdate,
  QuizzWithQuestions,
  QuizzWithQuestionsAndAnswers,
} from "@interfaces/quizz.interface";

export const getAll = async (_: Request, res: Response) => {
  const quizzes = await prisma.quizzes.findMany({
    orderBy: { id: "asc" },
  });
  return res.status(200).json({ quizzes });
};

export const getAllWithQuestions = async (_: Request, res: Response) => {
  const quizzes = await prisma.quizzes.findMany({
    orderBy: { id: "asc" },
    include: {
      Question: true,
    },
  });
  return res.status(200).json({ quizzes });
};

export const getAllWithQuestionsAndAnswers = async (
  _: Request,
  res: Response
) => {
  const quizzes = await prisma.quizzes.findMany({
    orderBy: { id: "asc" },
    include: {
      Question: {
        include: {
          Options: true,
        },
      },
    },
  });
  return res.status(200).json({ quizzes });
};

export const getById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const quizz = await prisma.quizzes.findUnique({
    where: { id },
    include: {
      Question: {
        include: {
          Options: true,
        },
      },
    },
  });
  if (!quizz) {
    return res.status(404).json({ message: "Quizz not found" });
  }
  return res.status(200).json({ quizz });
};

export const create = async (req: Request, res: Response) => {
  const quizzData = req.body as QuizzRequest;
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if ("questions" in req.body) {
    return res.status(400).json({
      message:
        "To create quiz with questions, use POST /quizzes/with-questions",
    });
  }
  quizzData.userId = userId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: "Validation errors", errors: errors.array() });
  }
  const quizz = await prisma.quizzes.create({
    data: quizzData,
  });
  return res.status(201).json({ quizz });
};

export const update = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const quizzData = req.body as QuizzUpdate;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: "Validation errors", errors: errors.array() });
  }
  const quizz = await prisma.quizzes.findUnique({ where: { id } });
  if (!quizz) {
    return res.status(404).json({ message: "Quizz not found" });
  }
  const updatedQuizz = await prisma.quizzes.update({
    where: { id },
    data: quizzData,
  });
  return res.status(200).json({ quizz: updatedQuizz });
};

export const createQuizzWithQuestions = async (req: Request, res: Response) => {
  const quizzData = req.body as QuizzWithQuestions;
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  quizzData.userId = userId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: "Validation errors", errors: errors.array() });
  }
  try {
    const quizz = await prisma.quizzes.create({
      data: {
        title: quizzData.title,
        description: quizzData.description,
        categoryId: quizzData.categoryId,
        difficulty: quizzData.difficulty,
        userId: quizzData.userId,
        Question: {
          create: quizzData.questions.map((questionData) => ({
            question: questionData.question,
            questionType: questionData.questionType,
          })),
        },
      },
      include: {
        Question: true,
      },
    });
    return res.status(201).json({ quizz });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({
      message: "Failed to create quiz with questions",
    });
  }
};

export const createQuizzWithQuestionsAndAnswers = async (
  req: Request,
  res: Response
) => {
  const quizzData = req.body as QuizzWithQuestionsAndAnswers;
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  quizzData.userId = userId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: "Validation errors", errors: errors.array() });
  }
  try {
    const quizz = await prisma.quizzes.create({
      data: {
        title: quizzData.title,
        description: quizzData.description,
        categoryId: quizzData.categoryId,
        difficulty: quizzData.difficulty,
        userId: quizzData.userId,
        Question: {
          create: quizzData.questions.map((questionData) => ({
            question: questionData.question,
            questionType: questionData.questionType,
            Options: {
              create: questionData.options.map((answerData) => ({
                text: answerData.text,
                isCorrect: answerData.isCorrect,
              })),
            },
          })),
        },
      },
      include: {
        Question: {
          include: {
            Options: true,
          },
        },
      },
    });
    return res.status(201).json({ quizz });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({
      message: "Failed to create quiz with questions and answers",
    });
  }
};

export const getQuizzByCategoryId = async (req: Request, res: Response) => {
  const categoryId = Number(req.params.categoryId);
  const quizzes = await prisma.quizzes.findMany({
    orderBy: { id: "asc" },
    where: { categoryId: categoryId },
    include: {
      Question: {
        include: {
          Options: true,
        },
      },
    },
  });
  if (quizzes) {
    return res.status(404).json({ message: "Quizz not found" });
  }
  return res.status(200).json({ quizzes });
};
