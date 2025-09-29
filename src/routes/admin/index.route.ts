import userRouter from "@routes/admin/users.route";
import roleRouter from "@routes/admin/role.route";
import categoryRouter from "@routes/admin/category.route";
import quizzRouter from "@routes/admin/quizz.route";
import { Router } from "express";

const router = Router();
router.use("/users", userRouter);
router.use("/roles", roleRouter);
router.use("/categories", categoryRouter);
router.use("/quizzes", quizzRouter);

export default router;
