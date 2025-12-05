import { Router } from "express";
import {
  registerController,
  loginController,
  verifyLoginOtpController,
  googleCallback,
} from "@controllers/auth/auth.controller";
import {
  requestOTP,
  verifyOTP,
  checkOTP,
} from "@controllers/auth/otp.controller";
import { registerValidator, loginValidator } from "@validators/auth.validator";
import { authenticateJWT } from "@middlewares/auth.middleware";
import { verifyRecaptcha, verifyRecaptchaOptional } from "@middlewares/recaptcha.middleware";
import passport from "passport";

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new user
 *     description: Creates a new user account. The default role is 'player'.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       '201':
 *         description: User registered successfully. Returns the new user and a JWT token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       '400':
 *         description: Bad Request - Validation error (e.g., email already exists, invalid password).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  "/register",
  verifyRecaptchaOptional,
  registerValidator,
  registerController
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Log in a user
 *     description: Authenticates a user with email and password, returning a JWT token upon success.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       '200':
 *         description: Login successful. Returns the user and a JWT token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       '401':
 *         description: Unauthorized - Invalid credentials.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/login", verifyRecaptchaOptional, loginValidator, loginController);
router.post("/login/verify-otp", verifyLoginOtpController);

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Get user profile
 *     description: Retrieves the profile of the currently authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful response with user profile data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       '401':
 *         description: Unauthorized - Token is missing or invalid.
 */
router.get("/profile", authenticateJWT, (req, res) => {
  res.json({ user: req.user });
});

/**
 * @swagger
 * /auth/google:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Initiate Google OAuth2 authentication
 *     description: Redirects the user to Google's authentication page.
 *     responses:
 *       '302':
 *         description: Redirect to Google's OAuth2 server.
 */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Google OAuth2 callback URL
 *     description: Google redirects to this URL after authentication. It handles the login or registration and returns a JWT token. This endpoint is typically handled by the browser's redirection, not direct API calls.
 *     responses:
 *       '200':
 *         description: Authentication successful. Returns user and token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       '302':
 *          description: On failure, redirects to the failure route.
 */
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/api/v1/auth/google/failure",
  }),
  googleCallback
);

/**
 * @swagger
 * /auth/google/failure:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Google OAuth2 failure
 *     description: Endpoint to which the user is redirected if Google authentication fails.
 *     responses:
 *       '401':
 *         description: Google authentication failed.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/google/failure", (req, res) => {
  res.status(401).json({
    message: "Google authentication failed",
  });
});

// OTP Routes
/**
 * @swagger
 * /auth/otp/request:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Request OTP code
 *     description: Sends a 6-digit OTP code to the specified email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               recaptchaToken:
 *                 type: string
 *               purpose:
 *                 type: string
 *                 enum: [register, login]
 *     responses:
 *       '200':
 *         description: OTP sent successfully
 *       '400':
 *         description: Bad request
 */
router.post("/otp/request", verifyRecaptchaOptional, requestOTP);

/**
 * @swagger
 * /auth/otp/verify:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Verify OTP code
 *     description: Verifies if the provided OTP code is valid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               code:
 *                 type: string
 *     responses:
 *       '200':
 *         description: OTP verified successfully
 *       '400':
 *         description: Invalid or expired OTP
 */
router.post("/otp/verify", verifyOTP);

/**
 * @swagger
 * /auth/otp/check:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Check if valid OTP exists
 *     description: Checks if there is a valid OTP for the email without consuming it
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Returns whether a valid OTP exists
 */
router.post("/otp/check", checkOTP);

export default router;
