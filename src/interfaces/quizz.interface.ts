import { Quizzes, Question, Options } from "src/generated/prisma";

export type QuizzRequest = Omit<Quizzes, "id" | "createdAt">;
export type QuizzUpdate = Partial<Quizzes>;
export type QuestionRequest = Omit<Question, "id" | "createdAt">;
export type QuestionUpdate = Partial<Question>;
export type OptionRequest = Omit<Options, "id" | "createdAt">;
export type OptionUpdate = Partial<Options>;

export interface QuizzWithQuestions extends Quizzes {
  questions: QuestionRequest[];
}

export interface QuizzWithQuestionsAndAnswers extends QuizzWithQuestions {
  questions: (Question & { options: OptionRequest[] })[];
}
