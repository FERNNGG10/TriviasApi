import { Router } from "express";
import {
  getAll,
  getAllWithQuestions,
  getAllWithQuestionsAndAnswers,
  getById,
  getQuizzByCategoryId,
  create,
  update,
  createQuizzWithQuestions,
  createQuizzWithQuestionsAndAnswers,
} from "@controllers/admin/quizz.controller";

import { authenticateJWT } from "@middlewares/auth.middleware";
import { requireAdmin } from "@middlewares/role.middleware";
import {
  createQuizzValidator,
  updateQuizzValidator,
  createQuizzWithQuestionsValidator,
  createQuizzWithOptionsValidator,
} from "@validators/quizz.validator";

const router = Router();
router.use(authenticateJWT, requireAdmin);

/**
 * @swagger
 * /admin/quizzes:
 *   get:
 *     tags:
 *       - Admin - Quizzes
 *     summary: Get all quizzes
 *     description: Retrieve a list of all quizzes.
 *     security:
 *       - bearerAuth: []
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
 *       '403':
 *         description: Forbidden.
 */
router.get("/", getAll);

/**
 * @swagger
 * /admin/quizzes/with-questions:
 *   get:
 *     tags:
 *       - Admin - Quizzes
 *     summary: Get all quizzes with their questions
 *     description: Retrieve a list of all quizzes, including their questions.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: A list of quizzes with questions.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Quiz'
 *       '401':
 *         description: Unauthorized.
 *       '403':
 *         description: Forbidden.
 */
router.get("/with-questions", getAllWithQuestions);

/**
 * @swagger
 * /admin/quizzes/with-questions-answers:
 *   get:
 *     tags:
 *       - Admin - Quizzes
 *     summary: Get all quizzes with questions and answers
 *     description: Retrieve a list of all quizzes, including their questions and answers.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: A list of quizzes with questions and answers.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Quiz'
 *       '401':
 *         description: Unauthorized.
 *       '403':
 *         description: Forbidden.
 */
router.get("/with-questions-answers", getAllWithQuestionsAndAnswers);

/**
 * @swagger
 * /admin/quizzes/by-category/{categoryId}:
 *   get:
 *     tags:
 *       - Admin - Quizzes
 *     summary: Get quizzes by category ID
 *     description: Retrieve a list of quizzes by category ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the category to retrieve quizzes for.
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
 *       '403':
 *         description: Forbidden.
 */
router.get("/by-category/:categoryId", getQuizzByCategoryId);

/**
 * @swagger
 * /admin/quizzes/{id}:
 *   get:
 *     tags:
 *       - Admin - Quizzes
 *     summary: Get a quiz by ID
 *     description: Retrieve a single quiz by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the quiz to retrieve.
 *     responses:
 *       '200':
 *         description: The quiz object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quiz'
 *       '401':
 *         description: Unauthorized.
 *       '403':
 *         description: Forbidden.
 *       '404':
 *         description: Quiz not found.
 */
router.get("/:id", getById);

/**
 * @swagger
 * /admin/quizzes:
 *   post:
 *     tags:
 *       - Admin - Quizzes
 *     summary: Create a new quiz
 *     description: Create a new quiz.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QuizInput'
 *     responses:
 *       '201':
 *         description: The created quiz object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quiz'
 *       '400':
 *         description: Bad request.
 *       '401':
 *         description: Unauthorized.
 *       '403':
 *         description: Forbidden.
 */
router.post("/", createQuizzValidator, create);

/**
 * @swagger
 * /admin/quizzes/with-questions:
 *   post:
 *     tags:
 *       - Admin - Quizzes
 *     summary: Create a new quiz with questions
 *     description: Create a new quiz with questions.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QuizInput'
 *     responses:
 *       '201':
 *         description: The created quiz object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quiz'
 *       '400':
 *         description: Bad request.
 *       '401':
 *         description: Unauthorized.
 *       '403':
 *         description: Forbidden.
 */
router.post(
  "/with-questions",
  createQuizzWithQuestionsValidator,
  createQuizzWithQuestions
);

/**
 * @swagger
 * /admin/quizzes/with-options:
 *   post:
 *     tags:
 *       - Admin - Quizzes
 *     summary: Create a new quiz with questions and options
 *     description: Create a new quiz with questions and options.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QuizInput'
 *     responses:
 *       '201':
 *         description: The created quiz object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quiz'
 *       '400':
 *         description: Bad request.
 *       '401':
 *         description: Unauthorized.
 *       '403':
 *         description: Forbidden.
 */
router.post(
  "/with-options",
  createQuizzWithOptionsValidator,
  createQuizzWithQuestionsAndAnswers
);

/**
 * @swagger
 * /admin/quizzes/{id}:
 *   patch:
 *     tags:
 *       - Admin - Quizzes
 *     summary: Update a quiz
 *     description: Update an existing quiz.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the quiz to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QuizInput'
 *     responses:
 *       '200':
 *         description: The updated quiz object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quiz'
 *       '400':
 *         description: Bad request.
 *       '401':
 *         description: Unauthorized.
 *       '403':
 *         description: Forbidden.
 *       '404':
 *         description: Quiz not found.
 */
router.patch("/:id", updateQuizzValidator, update);

export default router;
