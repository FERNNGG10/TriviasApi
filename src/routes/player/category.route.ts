import { Router } from "express";
import { getCategories } from "@controllers/player/category.controller";
import { authenticateJWT } from "@middlewares/auth.middleware";

const router = Router();
router.use(authenticateJWT);

/**
 * @swagger
 * /player/categories:
 *   get:
 *     tags:
 *       - Player
 *     summary: Get all categories
 *     description: Retrieves a list of all available quiz categories for players.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: A list of categories.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *       '401':
 *         description: Unauthorized.
 */
router.get("/", getCategories);

export default router;
