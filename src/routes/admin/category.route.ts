import { Router } from "express";
import {
  getAll,
  getById,
  create,
  update,
} from "@controllers/admin/category.controller";

import { authenticateJWT } from "@middlewares/auth.middleware";
import { requireAdmin } from "@middlewares/role.middleware";
import {
  createCategoryValidator,
  updateCategoryValidator,
} from "@validators/category.validator";

const router = Router();
router.use(authenticateJWT, requireAdmin);

/**
 * @swagger
 * /admin/categories:
 *   get:
 *     tags:
 *       - Admin - Categories
 *     summary: Get all categories
 *     description: Retrieve a list of all categories.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: A list of categories.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       '401':
 *         description: Unauthorized.
 *       '403':
 *         description: Forbidden.
 */
router.get("/", getAll);

/**
 * @swagger
 * /admin/categories/{id}:
 *   get:
 *     tags:
 *       - Admin - Categories
 *     summary: Get a category by ID
 *     description: Retrieve a single category by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the category to retrieve.
 *     responses:
 *       '200':
 *         description: The category object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       '401':
 *         description: Unauthorized.
 *       '403':
 *         description: Forbidden.
 *       '404':
 *         description: Category not found.
 */
router.get("/:id", getById);

/**
 * @swagger
 * /admin/categories:
 *   post:
 *     tags:
 *       - Admin - Categories
 *     summary: Create a new category
 *     description: Create a new category.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *     responses:
 *       '201':
 *         description: The created category object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       '400':
 *         description: Bad request.
 *       '401':
 *         description: Unauthorized.
 *       '403':
 *         description: Forbidden.
 */
router.post("/", createCategoryValidator, create);

/**
 * @swagger
 * /admin/categories/{id}:
 *   patch:
 *     tags:
 *       - Admin - Categories
 *     summary: Update a category
 *     description: Update an existing category.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the category to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *     responses:
 *       '200':
 *         description: The updated category object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       '400':
 *         description: Bad request.
 *       '401':
 *         description: Unauthorized.
 *       '403':
 *         description: Forbidden.
 *       '404':
 *         description: Category not found.
 */
router.patch("/:id", updateCategoryValidator, update);

export default router;
