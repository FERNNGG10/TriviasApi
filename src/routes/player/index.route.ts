import { Router } from "express";
import quizzRouter from "@routes/player/quizz.route";
import statsRouter from "@routes/player/stats.route";
import categoryRouter from "@routes/player/category.route";
const router = Router();
router.use("/quizz", quizzRouter);
router.use("/stats", statsRouter);
router.use("/categories", categoryRouter);
export default router;
