import { Router } from "express";
import {
  getAll,
  getById,
  create,
  update,
  getQuestionsByQuizzId,
} from "@controllers/admin/question.controller";
import { authenticateJWT } from "@middlewares/auth.middleware";
import { requireAdmin } from "@middlewares/role.middleware";
import {
  createQuestionValidator,
  updateQuestionValidator,
} from "@validators/question.validator";
const router = Router();
router.use(authenticateJWT, requireAdmin);

/**
 * @swagger
 * /admin/questions:
 *   get:
 *     tags:
 *       - Admin - Questions
 *     summary: Get all questions
 *     description: Retrieve a list of all questions.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: A list of questions.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Question'
 *       '401':
 *         description: Unauthorized.
 *       '403':
 *         description: Forbidden.
 */
router.get("/", getAll);

/**
 * @swagger
 * /admin/questions/quizz/{quizzId}:
 *   get:
 *     tags:
 *       - Admin - Questions
 *     summary: Get questions by quizz ID
 *     description: Retrieve a list of questions by quizz ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: quizzId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the quizz to retrieve questions for.
 *     responses:
 *       '200':
 *         description: A list of questions.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Question'
 *       '401':
 *         description: Unauthorized.
 *       '403':
 *         description: Forbidden.
 */
router.get("/quizz/:quizzId", getQuestionsByQuizzId);

/**
 * @swagger
 * /admin/questions/{id}:
 *   get:
 *     tags:
 *       - Admin - Questions
 *     summary: Get a question by ID
 *     description: Retrieve a single question by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the question to retrieve.
 *     responses:
 *       '200':
 *         description: The question object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Question'
 *       '401':
 *         description: Unauthorized.
 *       '403':
 *         description: Forbidden.
 *       '404':
 *         description: Question not found.
 */
router.get("/:id", getById);

/**
 * @swagger
 * /admin/questions:
 *   post:
 *     tags:
 *       - Admin - Questions
 *     summary: Create a new question
 *     description: Create a new question.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QuestionInput'
 *     responses:
 *       '201':
 *         description: The created question object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Question'
 *       '400':
 *         description: Bad request.
 *       '401':
 *         description: Unauthorized.
 *       '403':
 *         description: Forbidden.
 */
router.post("/", createQuestionValidator, create);

/**
 * @swagger
 * /admin/questions/{id}:
 *   patch:
 *     tags:
 *       - Admin - Questions
 *     summary: Update a question
 *     description: Update an existing question.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the question to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QuestionInput'
 *     responses:
 *       '200':
 *         description: The updated question object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Question'
 *       '400':
 *         description: Bad request.
 *       '401':
 *         description: Unauthorized.
 *       '403':
 *         description: Forbidden.
 *       '404':
 *         description: Question not found.
 */
router.patch("/:id", updateQuestionValidator, update);
export default router;
