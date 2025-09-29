import { Router } from "express";
import { getAll, getById } from "@controllers/admin/role.controller";

import { authenticateJWT } from "@middlewares/auth.middleware";
import { requireAdmin } from "@middlewares/role.middleware";

const router = Router();
router.use(authenticateJWT, requireAdmin);
router.get("/", getAll);
router.get("/:id", getById);

export default router;
