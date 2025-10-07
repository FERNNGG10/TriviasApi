import { Router } from "express";
import {
  getAll,
  getById,
  create,
  update,
} from "@controllers/admin/option.controller";
import { authenticateJWT } from "@middlewares/auth.middleware";
import { requireAdmin } from "@middlewares/role.middleware";
import {
  createOptionValidator,
  updateOptionValidator,
} from "@validators/option.validator";
const router = Router();
router.use(authenticateJWT, requireAdmin);
router.get("/", getAll);
router.get("/:id", getById);
router.post("/", createOptionValidator, create);
router.patch("/:id", updateOptionValidator, update);
export default router;
