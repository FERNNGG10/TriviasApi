import { Router } from "express";
import {
  getAll,
  getById,
  create,
  update,
  softDelete,
} from "@controllers/admin/user.controller";
import {
  createUserValidator,
  updateUserValidator,
} from "@validators/user.validator";
import { authenticateJWT } from "@middlewares/auth.middleware";
import { requireAdmin } from "@middlewares/role.middleware";

const router = Router();
router.use(authenticateJWT, requireAdmin);

/**
 * @swagger
 * /admin/users:
 *   get:
 *     tags:
 *       - Admin - Users
 *     summary: Get all users
 *     description: Retrieve a list of all users.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       '401':
 *         description: Unauthorized.
 *       '403':
 *         description: Forbidden.
 */
router.get("/", getAll);

/**
 * @swagger
 * /admin/users/{id}:
 *   get:
 *     tags:
 *       - Admin - Users
 *     summary: Get a user by ID
 *     description: Retrieve a single user by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user to retrieve.
 *     responses:
 *       '200':
 *         description: The user object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '401':
 *         description: Unauthorized.
 *       '403':
 *         description: Forbidden.
 *       '404':
 *         description: User not found.
 */
router.get("/:id", getById);

/**
 * @swagger
 * /admin/users:
 *   post:
 *     tags:
 *       - Admin - Users
 *     summary: Create a new user
 *     description: Create a new user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       '201':
 *         description: The created user object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '400':
 *         description: Bad request.
 *       '401':
 *         description: Unauthorized.
 *       '403':
 *         description: Forbidden.
 */
router.post("/", createUserValidator, create);

/**
 * @swagger
 * /admin/users/{id}:
 *   patch:
 *     tags:
 *       - Admin - Users
 *     summary: Update a user
 *     description: Update an existing user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       '200':
 *         description: The updated user object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '400':
 *         description: Bad request.
 *       '401':
 *         description: Unauthorized.
 *       '403':
 *         description: Forbidden.
 *       '404':
 *         description: User not found.
 */
router.patch("/:id", updateUserValidator, update);

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     tags:
 *       - Admin - Users
 *     summary: Soft delete a user
 *     description: Soft delete a user by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user to soft delete.
 *     responses:
 *       '204':
 *         description: No content.
 *       '401':
 *         description: Unauthorized.
 *       '403':
 *         description: Forbidden.
 *       '404':
 *         description: User not found.
 */
router.delete("/:id", softDelete);

export default router;
