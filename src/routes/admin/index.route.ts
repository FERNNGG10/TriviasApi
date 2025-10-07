import userRouter from "@routes/admin/users.route";
import roleRouter from "@routes/admin/role.route";
import categoryRouter from "@routes/admin/category.route";
import quizzRouter from "@routes/admin/quizz.route";
import questionRouter from "@routes/admin/question.route";
import optionRouter from "@routes/admin/option.route";
import { Router } from "express";

const router = Router();
router.use("/users", userRouter);
router.use("/roles", roleRouter);
router.use("/categories", categoryRouter);
router.use("/quizzes", quizzRouter);
router.use("/questions", questionRouter);
router.use("/options", optionRouter);

export default router;
