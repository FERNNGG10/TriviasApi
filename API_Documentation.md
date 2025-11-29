
# Trivias API Documentation

This document provides a detailed overview of all the API endpoints available in the Trivias API.

> ⚠️ **IMPORTANT**: All API routes use the prefix `/api/v1`
> 
> **Base URL**: `http://localhost:3000/api/v1`
> 
> Example: `POST http://localhost:3000/api/v1/auth/register`

## Authentication

### POST /auth/register

Registers a new user.

- **Request Body:**
  ```json
  {
    "name": "string (max 100)",
    "email": "string (email format, unique)",
    "password": "string (min 8)"
  }
  ```

### POST /auth/login

Logs in a user.

- **Request Body:**
  ```json
  {
    "email": "string (email format)",
    "password": "string"
  }
  ```

### GET /auth/profile

Retrieves the profile of the currently authenticated user.

- **Authentication:** JWT Token required.

### GET /auth/google

Initiates Google OAuth2 authentication.

### GET /auth/google/callback

Handles the Google OAuth2 callback.

### GET /auth/google/failure

Endpoint for failed Google authentication.

---

## Admin - Users

All routes in this section require Admin privileges.

### GET /admin/users

Retrieves a list of all users.

### GET /admin/users/{id}

Retrieves a single user by ID.

- **Parameters:**
  - `id` (number, path): The user's ID.

### POST /admin/users

Creates a new user.

- **Request Body:**
  ```json
  {
    "name": "string (required, max 100)",
    "email": "string (required, email, unique)",
    "password": "string (required, min 8)",
    "roleId": "integer (required, must exist)"
  }
  ```

### PATCH /admin/users/{id}

Updates an existing user.

- **Parameters:**
  - `id` (number, path): The user's ID.
- **Request Body:**
  ```json
  {
    "name": "string (optional, max 100)",
    "email": "string (optional, email, unique)",
    "password": "string (optional, min 8)",
    "status": "boolean (optional)",
    "roleId": "integer (optional, must exist)"
  }
  ```

### DELETE /admin/users/{id}

Soft deletes a user.

- **Parameters:**
  - `id` (number, path): The user's ID.

---

## Admin - Roles

All routes in this section require Admin privileges.

### GET /admin/roles

Retrieves a list of all roles.

### GET /admin/roles/{id}

Retrieves a single role by ID.

- **Parameters:**
  - `id` (number, path): The role's ID.

---

## Admin - Categories

All routes in this section require Admin privileges.

### GET /admin/categories

Retrieves a list of all categories.

### GET /admin/categories/{id}

Retrieves a single category by ID.

- **Parameters:**
  - `id` (number, path): The category's ID.

### POST /admin/categories

Creates a new category.

- **Request Body:**
  ```json
  {
    "name": "string (required, max 255)"
  }
  ```

### PATCH /admin/categories/{id}

Updates an existing category.

- **Parameters:**
  - `id` (number, path): The category's ID.
- **Request Body:**
  ```json
  {
    "name": "string (optional, max 255)"
  }
  ```

---

## Admin - Quizzes

All routes in this section require Admin privileges.

### GET /admin/quizzes

Retrieves a list of all quizzes.

### GET /admin/quizzes/with-questions

Retrieves all quizzes with their associated questions.

### GET /admin/quizzes/with-questions-answers

Retrieves all quizzes with their questions and options.

### GET /admin/quizzes/by-category/{categoryId}

Retrieves quizzes belonging to a specific category.

- **Parameters:**
  - `categoryId` (number, path): The category's ID.

### GET /admin/quizzes/{id}

Retrieves a single quiz by ID.

- **Parameters:**
  - `id` (number, path): The quiz's ID.

### POST /admin/quizzes

Creates a new quiz.

- **Request Body:**
  ```json
  {
    "title": "string (required, max 255)",
    "categoryId": "integer (required, must exist)",
    "description": "string (required)",
    "difficulty": "string (required, one of: 'easy', 'medium', 'hard')"
  }
  ```

### POST /admin/quizzes/with-questions

Creates a new quiz along with its questions.

- **Request Body:**
  ```json
  {
    "title": "string (required, max 255)",
    "categoryId": "integer (required, must exist)",
    "description": "string (required)",
    "difficulty": "string (required, one of: 'easy', 'medium', 'hard')",
    "questions": [
      {
        "question": "string (required)",
        "questionType": "string (required, one of: 'multiple_choice', 'true_false')"
      }
    ]
  }
  ```

### POST /admin/quizzes/with-options

Creates a new quiz with its questions and their options.

- **Request Body:**
  ```json
  {
    "title": "string (required, max 255)",
    "categoryId": "integer (required, must exist)",
    "description": "string (required)",
    "difficulty": "string (required, one of: 'easy', 'medium', 'hard')",
    "questions": [
      {
        "question": "string (required)",
        "questionType": "string (required, one of: 'multiple_choice', 'true_false')",
        "options": [
          {
            "text": "string (required)",
            "isCorrect": "boolean (required)"
          }
        ]
      }
    ]
  }
  ```

### PATCH /admin/quizzes/{id}

Updates an existing quiz.

- **Parameters:**
  - `id` (number, path): The quiz's ID.
- **Request Body:**
  ```json
  {
    "title": "string (optional, max 255)",
    "categoryId": "integer (optional, must exist)",
    "description": "string (optional)",
    "difficulty": "string (optional, one of: 'easy', 'medium', 'hard')"
  }
  ```

---

## Admin - Questions

All routes in this section require Admin privileges.

### GET /admin/questions

Retrieves a list of all questions.

### GET /admin/questions/quizz/{quizzId}

Retrieves all questions for a specific quiz.

- **Parameters:**
  - `quizzId` (number, path): The quiz's ID.

### GET /admin/questions/{id}

Retrieves a single question by ID.

- **Parameters:**
  - `id` (number, path): The question's ID.

### POST /admin/questions

Creates a new question.

- **Request Body:**
  ```json
  {
    "question": "string (required)",
    "quizzId": "integer (required, must exist)",
    "questionType": "string (required, one of: 'multiple_choice', 'true_false')"
  }
  ```

### PATCH /admin/questions/{id}

Updates an existing question.

- **Parameters:**
  - `id` (number, path): The question's ID.
- **Request Body:**
  ```json
  {
    "question": "string (optional)",
    "quizzId": "integer (optional, must exist)",
    "questionType": "string (optional, one of: 'multiple_choice', 'true_false')"
  }
  ```

---

## Admin - Options

All routes in this section require Admin privileges.

### GET /admin/options

Retrieves a list of all options.

### GET /admin/options/question/{questionId}

Retrieves all options for a specific question.

- **Parameters:**
  - `questionId` (number, path): The question's ID.

### GET /admin/options/{id}

Retrieves a single option by ID.

- **Parameters:**
  - `id` (number, path): The option's ID.

### POST /admin/options

Creates a new option.

- **Request Body:**
  ```json
  {
    "text": "string (required, max 255)",
    "isCorrect": "boolean (required)",
    "questionId": "integer (required, must exist)"
  }
  ```

### PATCH /admin/options/{id}

Updates an existing option.

- **Parameters:**
  - `id` (number, path): The option's ID.
- **Request Body:**
  ```json
  {
    "text": "string (optional, max 255)",
    "isCorrect": "boolean (optional)",
    "questionId": "integer (optional, must exist)"
  }
  ```

---

## Player

All routes in this section require user authentication.

### GET /player/quizz

Retrieves available quizzes for the player.

- **Query Parameters:**
  - `categoryId` (number, optional): Filter by category.
  - `played` (boolean, optional): Filter by quizzes the user has played.
  - `mostPlayed` (boolean, optional): Order by most played.
  - `oldest` (boolean, optional): Order by oldest first.
  - `news` (boolean, optional): Order by newest first (default).

### POST /player/quizz/{quizId}/play

Submits answers for a quiz and gets the score.

- **Parameters:**
  - `quizId` (number, path): The quiz's ID.
- **Request Body:**
  ```json
  {
    "answers": [
      {
        "questionId": "integer (required)",
        "optionId": "integer (required)"
      }
    ]
  }
  ```
