import { Question } from "src/generated/prisma";

export type QuestionRequest = Omit<Question, "id" | "createdAt">;
export type QuestionUpdate = Partial<Question>;
