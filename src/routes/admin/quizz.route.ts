import { Router } from "express";
import {
  getAll,
  getById,
  create,
  update,
  createQuizzWithQuestions,
  createQuizzWithQuestionsAndAnswers,
} from "@controllers/admin/quizz.controller";

import { authenticateJWT } from "@middlewares/auth.middleware";
import { requireAdmin } from "@middlewares/role.middleware";
import {
  createQuizzValidator,
  updateQuizzValidator,
  createQuizzWithQuestionsValidator,
  createQuizzWithOptionsValidator,
} from "@validators/quizz.validator";

const router = Router();
router.use(authenticateJWT, requireAdmin);
router.get("/", getAll);
router.get("/:id", getById);
router.post("/", createQuizzValidator, create);
router.post(
  "/with-questions",
  createQuizzWithQuestionsValidator,
  createQuizzWithQuestions
);
router.post(
  "/with-options",
  createQuizzWithOptionsValidator,
  createQuizzWithQuestionsAndAnswers
);
router.patch("/:id", updateQuizzValidator, update);

export default router;
