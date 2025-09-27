import { Router } from "express";
import {
  getAll,
  getById,
  create,
  update,
  softDelete,
} from "@controllers/admin/user.controller";
import {
  createUserValidator,
  updateUserValidator,
} from "@validators/user.validator";
import { authenticateJWT } from "@middlewares/auth.middleware";
import { requireAdmin } from "@middlewares/role.middleware";

const router = Router();
router.use(authenticateJWT, requireAdmin);
router.get("/users", getAll);
router.get("/users/:id", getById);
router.post("/users", createUserValidator, create);
router.patch("/users/:id", updateUserValidator, update);
router.delete("/users/:id", softDelete);

export default router;
