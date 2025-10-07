import { Quizzes, Question, Options } from "src/generated/prisma";
import { OptionRequest } from "@interfaces/option.interface";
import { QuestionRequest } from "@interfaces/question.interface";
export type QuizzRequest = Omit<Quizzes, "id" | "createdAt">;
export type QuizzUpdate = Partial<Quizzes>;

export interface QuizzWithQuestions extends Quizzes {
  questions: QuestionRequest[];
}

export interface QuizzWithQuestionsAndAnswers extends QuizzWithQuestions {
  questions: (Question & { options: OptionRequest[] })[];
}
