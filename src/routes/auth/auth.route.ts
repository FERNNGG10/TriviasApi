import { Router } from "express";
import {
  registerController,
  loginController,
  googleCallback,
} from "@controllers/auth/auth.controller";
import { registerValidator, loginValidator } from "@validators/auth.validator";
import { authenticateJWT } from "@middlewares/auth.middleware";
import passport from "passport";

const router = Router();

router.post("/register", registerValidator, registerController);
router.post("/login", loginValidator, loginController);
router.get("/profile", authenticateJWT, (req, res) => {
  res.json({ user: req.user });
});

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/api/v1/auth/google/failure",
  }),
  googleCallback
);

router.get("/google/failure", (req, res) => {
  res.status(401).json({
    message: "Google authentication failed",
  });
});

export default router;
