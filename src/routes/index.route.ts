import { Router } from "express";
import authRouter from "@routes/auth/auth.route";
import adminRouter from "@routes/admin/index.route";

const router = Router();

router.use("/auth", authRouter);
router.use("/admin", adminRouter);
//router.use('/player',plaayerRouter);

export default router;
