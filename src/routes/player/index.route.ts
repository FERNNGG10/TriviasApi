import { Router } from "express";
import quizzRouter from "@routes/player/quizz.route";
const router = Router();
router.use("/quizz", quizzRouter);
export default router;
