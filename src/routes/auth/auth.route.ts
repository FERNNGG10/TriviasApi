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
router.post("/register", registerValidator, registerController);

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
router.post("/login", loginValidator, loginController);

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

export default router;
