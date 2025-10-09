import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Trivias API",
    version: "1.0.0",
    description:
      "API for a trivia game application, allowing users to play quizzes and administrators to manage content.",
    contact: {
      name: "Fernando Olmos & Miguel Villalpando",
    },
  },
  servers: [
    {
      url: "http://localhost:3000/api",
      description: "Development server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      // ROLES
      Role: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: {
            type: "string",
            enum: ["admin", "player"],
            example: "player",
          },
        },
      },
      // USERS
      User: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          email: {
            type: "string",
            format: "email",
            example: "user@example.com",
          },
          name: { type: "string", example: "John Doe" },
          roleId: { type: "integer", example: 2 },
          status: { type: "boolean", example: true },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      UserInput: {
        type: "object",
        required: ["email", "name", "password", "roleId"],
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "user@example.com",
          },
          name: { type: "string", example: "John Doe" },
          password: {
            type: "string",
            format: "password",
            example: "password123",
          },
          roleId: { type: "integer", example: 2 },
        },
      },
      // CATEGORIES
      Category: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Science" },
        },
      },
      CategoryInput: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", example: "History" },
        },
      },
      // QUIZZES
      Quiz: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          title: { type: "string", example: "World History Part 1" },
          description: {
            type: "string",
            example: "A quiz about ancient history.",
          },
          difficulty: { type: "string", example: "medium" },
          userId: { type: "integer" },
          categoryId: { type: "integer" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      QuizInput: {
        type: "object",
        required: ["title", "description", "difficulty", "categoryId"],
        properties: {
          title: { type: "string", example: "New Quiz" },
          description: { type: "string", example: "A brand new quiz." },
          difficulty: {
            type: "string",
            enum: ["easy", "medium", "hard"],
            example: "easy",
          },
          categoryId: { type: "integer", example: 1 },
        },
      },
      // QUESTIONS & OPTIONS
      Option: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          text: { type: "string", example: "H2O" },
          isCorrect: { type: "boolean", example: true },
          questionId: { type: "integer" },
        },
      },
      OptionInput: {
        type: "object",
        required: ["text", "isCorrect"],
        properties: {
          text: { type: "string", example: "A new option" },
          isCorrect: { type: "boolean", example: false },
        },
      },
      Question: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          question: {
            type: "string",
            example: "What is the capital of France?",
          },
          questionType: {
            type: "string",
            enum: ["multiple_choice", "true_false"],
            example: "multiple_choice",
          },
          quizId: { type: "integer" },
          Options: {
            type: "array",
            items: { $ref: "#/components/schemas/Option" },
          },
        },
      },
      QuestionInput: {
        type: "object",
        required: ["question", "questionType", "options"],
        properties: {
          question: { type: "string", example: "Is the sky blue?" },
          questionType: {
            type: "string",
            enum: ["multiple_choice", "true_false"],
            example: "true_false",
          },
          options: {
            type: "array",
            description:
              "A list of options for the question. For true/false, provide two options. For multiple choice, provide at least two.",
            items: { $ref: "#/components/schemas/OptionInput" },
          },
        },
      },
      // SCORES
      QuizScore: {
        type: "object",
        properties: {
          id: { type: "integer" },
          userId: { type: "integer" },
          quizId: { type: "integer" },
          score: { type: "integer", example: 85 },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      // AUTH
      Login: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string", format: "password" },
        },
      },
      AuthResponse: {
        type: "object",
        properties: {
          user: { $ref: "#/components/schemas/User" },
          token: {
            type: "string",
            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          },
        },
      },
      // PLAYER
      PlayerAnswer: {
        type: "object",
        required: ["questionId", "optionId"],
        properties: {
          questionId: {
            type: "integer",
            description: "ID of the question being answered",
          },
          optionId: {
            type: "integer",
            description: "ID of the selected option",
          },
        },
      },
      PlayerAnswersInput: {
        type: "object",
        required: ["answers"],
        properties: {
          answers: {
            type: "array",
            items: { $ref: "#/components/schemas/PlayerAnswer" },
          },
        },
      },
      PlayQuizResponse: {
        type: "object",
        properties: {
          message: { type: "string" },
          totalQuestions: { type: "integer" },
          correctAnswers: { type: "integer" },
          score: { type: "integer" },
        },
      },
      // ERROR
      Error: {
        type: "object",
        properties: {
          message: { type: "string", example: "Error message" },
        },
      },
    },
  },
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ["./src/routes/**/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);
