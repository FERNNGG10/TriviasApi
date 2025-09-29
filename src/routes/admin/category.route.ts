import { Router } from "express";
import {
  getAll,
  getById,
  create,
  update,
} from "@controllers/admin/category.controller";

import { authenticateJWT } from "@middlewares/auth.middleware";
import { requireAdmin } from "@middlewares/role.middleware";
import {
  createCategoryValidator,
  updateCategoryValidator,
} from "@validators/category.validator";

const router = Router();
router.use(authenticateJWT, requireAdmin);
router.get("/", getAll);
router.get("/:id", getById);
router.post("/", createCategoryValidator, create);
router.patch("/:id", updateCategoryValidator, update);

export default router;
