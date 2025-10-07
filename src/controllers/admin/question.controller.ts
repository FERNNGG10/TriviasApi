import { Request, Response } from "express";
import { validationResult } from "express-validator";
import {
  QuestionRequest,
  QuestionUpdate,
} from "@interfaces/question.interface";
import prisma from "@config/database";

export const getAll = async (req: Request, res: Response) => {
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
  const questionData = req.body as QuestionRequest;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: "Validation errors", errors: errors.array() });
  }
  const question = await prisma.question.create({
    data: questionData,
  });
  return res.status(201).json({ question });
};

export const update = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const questionData = req.body as QuestionUpdate;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: "Validation errors", errors: errors.array() });
  }
  const question = await prisma.question.update({
    where: { id },
    data: questionData,
  });
  return res.status(200).json({ question });
};

// export const updateQuestionFromQuizz = async (req: Request, res: Response) => {
//   const quizzId = Number(req.params.quizzId);
//   const questionId = Number(req.params.questionId);
//   const questionData = req.body as QuestionUpdate;
//   const errors = validationResult(req);
//   const quizz = await prisma.quizzes.findUnique({ where: { id: quizzId } });
//   if (!quizz) {
//     return res.status(404).json({ message: "Quizz not found" });
//   }
//   const question = await prisma.question

//   if (!errors.isEmpty()) {
//     return res
//       .status(422)
//       .json({ message: "Validation errors", errors: errors.array() });
//   }
//   const updatedQuestion = await prisma.question.update({
//     where: { id: questionId },
//     data: questionData,
//   });
//   return res.status(200).json({ question: updatedQuestion });
// };
