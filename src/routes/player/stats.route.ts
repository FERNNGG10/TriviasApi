import { Router } from "express";
import {
  getPlayerStats,
  getPlayerHistory,
} from "@controllers/player/stats.controller";
import { authenticateJWT } from "@middlewares/auth.middleware";

const router = Router();
router.use(authenticateJWT);

/**
 * @swagger
 * /player/stats:
 *   get:
 *     tags:
 *       - Player - Statistics
 *     summary: Get player statistics
 *     description: Retrieve comprehensive statistics for the authenticated player including scores, categories played, and recent activity.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Player statistics retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stats:
 *                   type: object
 *                   properties:
 *                     totalQuizzesPlayed:
 *                       type: integer
 *                       example: 15
 *                     averageScore:
 *                       type: integer
 *                       example: 75
 *                     bestScore:
 *                       type: integer
 *                       example: 95
 *                     worstScore:
 *                       type: integer
 *                       example: 45
 *                     categoriesPlayed:
 *                       type: integer
 *                       example: 5
 *                     scoresByCategory:
 *                       type: object
 *                       additionalProperties:
 *                         type: object
 *                         properties:
 *                           total:
 *                             type: integer
 *                           count:
 *                             type: integer
 *                           average:
 *                             type: integer
 *                     recentQuizzes:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           quizId:
 *                             type: integer
 *                           quizTitle:
 *                             type: string
 *                           categoryName:
 *                             type: string
 *                           score:
 *                             type: integer
 *                           playedAt:
 *                             type: string
 *                             format: date-time
 *       '401':
 *         description: Unauthorized.
 */
router.get("/", getPlayerStats);

/**
 * @swagger
 * /player/stats/history:
 *   get:
 *     tags:
 *       - Player - Statistics
 *     summary: Get player quiz history
 *     description: Retrieve complete history of all quizzes played by the authenticated player.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Player history retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 history:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       quizId:
 *                         type: integer
 *                       quizTitle:
 *                         type: string
 *                       quizDescription:
 *                         type: string
 *                       categoryName:
 *                         type: string
 *                       difficulty:
 *                         type: string
 *                       score:
 *                         type: integer
 *                       playedAt:
 *                         type: string
 *                         format: date-time
 *                 totalPlayed:
 *                   type: integer
 *       '401':
 *         description: Unauthorized.
 */
router.get("/history", getPlayerHistory);

export default router;
