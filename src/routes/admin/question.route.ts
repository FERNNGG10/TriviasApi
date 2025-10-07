import { Router } from "express";
import {
  getAll,
  getById,
  create,
  update,
} from "@controllers/admin/question.controller";
import { authenticateJWT } from "@middlewares/auth.middleware";
import { requireAdmin } from "@middlewares/role.middleware";
import {
  createQuestionValidator,
  updateQuestionValidator,
} from "@validators/question.validator";
const router = Router();
router.use(authenticateJWT, requireAdmin);
router.get("/", getAll);
router.get("/:id", getById);
router.post("/", createQuestionValidator, create);
router.patch("/:id", updateQuestionValidator, update);
export default router;
