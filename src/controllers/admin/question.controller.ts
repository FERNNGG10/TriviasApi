import { Request, Response } from "express";
import { validationResult } from "express-validator";
import {
  QuestionRequest,
  QuestionUpdate,
} from "@interfaces/question.interface";
import prisma from "@config/database";

export const getAll = async (_: Request, res: Response) => {
  const questions = await prisma.question.findMany({
    orderBy: { id: "asc" },
  });
  return res.status(200).json({ questions });
};

export const getById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const question = await prisma.question.findUnique({
    where: { id },
  });
  if (!question) {
    return res.status(404).json({ message: "Question not found" });
  }
  return res.status(200).json({ question });
};

export const create = async (req: Request, res: Response) => {
  const { quizId, question: questionText, questionType, options } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: "Validation errors", errors: errors.array() });
  }
  
  // Crear pregunta con opciones en una transacción
  const question = await prisma.question.create({
    data: {
      question: questionText,
      questionType: questionType || 'multiple_choice',
      quiz: {
        connect: { id: quizId }
      },
      // Si se proporcionan opciones, crearlas junto con la pregunta
      ...(options && options.length > 0 && {
        Options: {
          create: options.map((opt: { text: string; isCorrect: boolean }) => ({
            text: opt.text,
            isCorrect: opt.isCorrect
          }))
        }
      })
    },
    include: {
      Options: true
    }
  });
  return res.status(201).json({ question });
};

export const update = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { quizId, question: questionText, questionType } = req.body;
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: "Validation errors", errors: errors.array() });
  }
  
  const updateData: any = {};
  if (questionText !== undefined) updateData.question = questionText;
  if (questionType !== undefined) updateData.questionType = questionType;
  if (quizId !== undefined) {
    updateData.quiz = { connect: { id: quizId } };
  }
  
  const question = await prisma.question.update({
    where: { id },
    data: updateData,
  });
  return res.status(200).json({ question });
};

export const getQuestionsByQuizzId = async (req: Request, res: Response) => {
  const quizzId = Number(req.params.quizzId);

  const questions = await prisma.question.findMany({
    where: { id: quizzId },
    orderBy: { id: "asc" },
    include: {
      Options: true,
    },
  });
  if (!questions) {
    return res.status(404).json({ message: "Questions not found" });
  }

  return res.status(200).json({ questions });
};
