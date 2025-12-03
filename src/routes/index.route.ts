import { Router } from "express";
import authRouter from "@routes/auth/auth.route";
import adminRouter from "@routes/admin/index.route";
import plaayerRouter from "@routes/player/index.route";
import pushRouter from "@routes/push-subscription.routes";

const router = Router();

router.use("/auth", authRouter);
router.use("/admin", adminRouter);
router.use("/player", plaayerRouter);
router.use("/push", pushRouter);

export default router;
