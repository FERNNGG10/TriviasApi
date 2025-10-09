import { Router } from "express";
import { getAll, getById } from "@controllers/admin/role.controller";

import { authenticateJWT } from "@middlewares/auth.middleware";
import { requireAdmin } from "@middlewares/role.middleware";

const router = Router();
router.use(authenticateJWT, requireAdmin);

/**
 * @swagger
 * /admin/roles:
 *   get:
 *     tags:
 *       - Admin - Roles
 *     summary: Get all roles
 *     description: Retrieve a list of all roles.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: A list of roles.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Role'
 *       '401':
 *         description: Unauthorized.
 *       '403':
 *         description: Forbidden.
 */
router.get("/", getAll);

/**
 * @swagger
 * /admin/roles/{id}:
 *   get:
 *     tags:
 *       - Admin - Roles
 *     summary: Get a role by ID
 *     description: Retrieve a single role by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the role to retrieve.
 *     responses:
 *       '200':
 *         description: The role object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       '401':
 *         description: Unauthorized.
 *       '403':
 *         description: Forbidden.
 *       '404':
 *         description: Role not found.
 */
router.get("/:id", getById);

export default router;
