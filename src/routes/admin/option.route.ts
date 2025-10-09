import { Router } from "express";
import {
  getAll,
  getById,
  create,
  update,
  getOptionsByQuestionId,
} from "@controllers/admin/option.controller";
import { authenticateJWT } from "@middlewares/auth.middleware";
import { requireAdmin } from "@middlewares/role.middleware";
import {
  createOptionValidator,
  updateOptionValidator,
} from "@validators/option.validator";
const router = Router();
router.use(authenticateJWT, requireAdmin);

/**
 * @swagger
 * /admin/options:
 *   get:
 *     tags:
 *       - Admin - Options
 *     summary: Get all options
 *     description: Retrieve a list of all options.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: A list of options.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Option'
 *       '401':
 *         description: Unauthorized.
 *       '403':
 *         description: Forbidden.
 */
router.get("/", getAll);

/**
 * @swagger
 * /admin/options/question/{questionId}:
 *   get:
 *     tags:
 *       - Admin - Options
 *     summary: Get options by question ID
 *     description: Retrieve a list of options for a specific question.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the question to retrieve options for.
 *     responses:
 *       '200':
 *         description: A list of options.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Option'
 *       '401':
 *         description: Unauthorized.
 *       '403':
 *         description: Forbidden.
 */
router.get("/question/:questionId", getOptionsByQuestionId);

/**
 * @swagger
 * /admin/options/{id}:
 *   get:
 *     tags:
 *       - Admin - Options
 *     summary: Get an option by ID
 *     description: Retrieve a single option by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the option to retrieve.
 *     responses:
 *       '200':
 *         description: The option object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Option'
 *       '401':
 *         description: Unauthorized.
 *       '403':
 *         description: Forbidden.
 *       '404':
 *         description: Option not found.
 */
router.get("/:id", getById);

/**
 * @swagger
 * /admin/options:
 *   post:
 *     tags:
 *       - Admin - Options
 *     summary: Create a new option
 *     description: Create a new option for a question.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OptionInput'
 *     responses:
 *       '201':
 *         description: The created option object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Option'
 *       '400':
 *         description: Bad request.
 *       '401':
 *         description: Unauthorized.
 *       '403':
 *         description: Forbidden.
 */
router.post("/", createOptionValidator, create);

/**
 * @swagger
 * /admin/options/{id}:
 *   patch:
 *     tags:
 *       - Admin - Options
 *     summary: Update an option
 *     description: Update an existing option.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the option to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OptionInput'
 *     responses:
 *       '200':
 *         description: The updated option object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Option'
 *       '400':
 *         description: Bad request.
 *       '401':
 *         description: Unauthorized.
 *       '403':
 *         description: Forbidden.
 *       '404':
 *         description: Option not found.
 */
router.patch("/:id", updateOptionValidator, update);

export default router;
