import { Router } from "express";
import { getDashboardStats } from "@controllers/admin/dashboard.controller";
import { authenticateJWT } from "@middlewares/auth.middleware";
import { requireAdmin } from "@middlewares/role.middleware";

const router = Router();
router.use(authenticateJWT, requireAdmin);

/**
 * @swagger
 * /admin/dashboard/stats:
 *   get:
 *     tags:
 *       - Admin - Dashboard
 *     summary: Get dashboard statistics
 *     description: Retrieve general statistics for the admin dashboard including total quizzes, categories, users, and questions.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Dashboard statistics retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stats:
 *                   type: object
 *                   properties:
 *                     totalQuizzes:
 *                       type: integer
 *                       example: 25
 *                     totalCategories:
 *                       type: integer
 *                       example: 8
 *                     totalUsers:
 *                       type: integer
 *                       example: 150
 *                     totalQuestions:
 *                       type: integer
 *                       example: 200
 *       '401':
 *         description: Unauthorized.
 *       '403':
 *         description: Forbidden - Admin access required.
 */
router.get("/stats", getDashboardStats);

export default router;
