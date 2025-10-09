import { Router } from "express";
import {
  getQuizzes,
  playQuiz,
} from "@controllers/player/quizzPlayer.controller";
import { authenticateJWT } from "@middlewares/auth.middleware";
import { createAnswerValidator } from "@validators/answer.validator";

const router = Router();
router.use(authenticateJWT);

/**
 * @swagger
 * /player/quizzes:
 *   get:
 *     tags:
 *       - Player
 *     summary: Get available quizzes
 *     description: Retrieves a list of quizzes. Can be filtered by various criteria like category, played status, etc. This is for players.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *         description: Filter quizzes by category ID.
 *       - in: query
 *         name: played
 *         schema:
 *           type: boolean
 *         description: Filter quizzes that the user has already played.
 *       - in: query
 *         name: mostPlayed
 *         schema:
 *           type: boolean
 *         description: Order quizzes by the most played.
 *       - in: query
 *         name: oldest
 *         schema:
 *           type: boolean
 *         description: Order quizzes by oldest first.
 *       - in: query
 *         name: news
 *         schema:
 *           type: boolean
 *         description: Order quizzes by newest first (default).
 *     responses:
 *       '200':
 *         description: A list of quizzes.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Quiz'
 *       '401':
 *         description: Unauthorized.
 */
router.get("/", getQuizzes);

/**
 * @swagger
 * /player/quizzes/{quizId}/play:
 *   post:
 *     tags:
 *       - Player
 *     summary: Submit answers for a quiz
 *     description: Allows a player to submit their answers for a specific quiz and get their score.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: quizId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the quiz to play.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PlayerAnswersInput'
 *     responses:
 *       '200':
 *         description: Quiz completed successfully. Returns the score and results.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlayQuizResponse'
 *       '400':
 *         description: Bad Request - Invalid input for answers.
 *       '401':
 *         description: Unauthorized.
 *       '404':
 *         description: Quiz not found.
 */
router.post("/:quizId/play", createAnswerValidator, playQuiz);

export default router;
