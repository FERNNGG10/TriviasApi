# Guía Completa de Rutas del API - Trivias

> **Base URL**: `http://localhost:3000/api/v1`
> 
> **Autenticación**: La mayoría de rutas requieren JWT token en el header `Authorization: Bearer <token>`

---

## Tabla de Contenidos

1. [Autenticación](#autenticación)
2. [Rutas de Admin - Dashboard](#admin---dashboard)
3. [Rutas de Admin - Usuarios](#admin---usuarios)
4. [Rutas de Admin - Categorías](#admin---categorías)
5. [Rutas de Admin - Quizzes](#admin---quizzes)
6. [Rutas de Admin - Preguntas](#admin---preguntas)
7. [Rutas de Admin - Opciones](#admin---opciones)
8. [Rutas de Player - Quizzes](#player---quizzes)
9. [Rutas de Player - Estadísticas](#player---estadísticas)

---

## Autenticación

### 1. Registro de Usuario
```
POST /api/v1/auth/register
```

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "roleId": 2,
    "status": true,
    "createdAt": "2025-11-26T..."
  }
}
```

**Ejemplo Fetch:**
```javascript
const response = await fetch('http://localhost:3000/api/v1/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: "Juan Pérez",
    email: "juan@example.com",
    password: "password123"
  })
});
const data = await response.json();
```

---

### 2. Login
```
POST /api/v1/auth/login
```

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "juan@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "role": {
      "name": "player"
    }
  }
}
```

---

### 3. Obtener Perfil
```
GET /api/v1/auth/profile
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": 1,
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "role": {
    "name": "player"
  }
}
```

---

### 4. Login con Google
```
GET /api/v1/auth/google
```

Redirige al usuario a la página de autenticación de Google.

---

## Admin - Dashboard

> **Nota**: Todas estas rutas requieren rol de **admin**

### Obtener Estadísticas del Dashboard
```
GET /api/v1/admin/dashboard/stats
```

**Headers:**
```
Authorization: Bearer <token_admin>
```

**Response (200):**
```json
{
  "stats": {
    "totalQuizzes": 25,
    "totalCategories": 8,
    "totalUsers": 150,
    "totalQuestions": 200
  }
}
```

**Descripción:**
Esta ruta devuelve las estadísticas generales del sistema para mostrar en el dashboard de administración:
- **totalQuizzes**: Total de trivias/quizzes creados
- **totalCategories**: Total de categorías disponibles
- **totalUsers**: Total de usuarios registrados (admin + players)
- **totalQuestions**: Total de preguntas en todos los quizzes

**Ejemplo Fetch:**
```javascript
const response = await fetch('http://localhost:3000/api/v1/admin/dashboard/stats', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
const data = await response.json();
console.log(`Total de Trivias: ${data.stats.totalQuizzes}`);
console.log(`Total de Categorías: ${data.stats.totalCategories}`);
console.log(`Total de Usuarios: ${data.stats.totalUsers}`);
console.log(`Total de Preguntas: ${data.stats.totalQuestions}`);
```

**Ejemplo para mostrar en el Dashboard:**
```javascript
async function loadDashboardStats() {
  const data = await api.getDashboardStats();
  
  // Actualizar el HTML con los valores
  document.getElementById('total-trivias').textContent = data.stats.totalQuizzes;
  document.getElementById('total-categorias').textContent = data.stats.totalCategories;
  document.getElementById('total-usuarios').textContent = data.stats.totalUsers;
  document.getElementById('total-preguntas').textContent = data.stats.totalQuestions;
}
```

---

## Admin - Usuarios

> **Nota**: Todas estas rutas requieren rol de **admin**

### 1. Obtener Todos los Usuarios
```
GET /api/v1/admin/users
```

**Headers:**
```
Authorization: Bearer <token_admin>
```

**Response (200):**
```json
{
  "users": [
    {
      "id": 1,
      "name": "Fernando García",
      "email": "fernando@gmail.com",
      "status": true,
      "provider": "local",
      "role": {
        "name": "admin"
      },
      "createdAt": "2025-11-26T..."
    },
    {
      "id": 2,
      "name": "Laura Martínez",
      "email": "laura@gmail.com",
      "status": true,
      "provider": "local",
      "role": {
        "name": "player"
      },
      "createdAt": "2025-11-26T..."
    }
  ]
}
```

**Ejemplo Fetch:**
```javascript
const token = localStorage.getItem('token');
const response = await fetch('http://localhost:3000/api/v1/admin/users', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
const data = await response.json();
console.log(data.users);
```

---

### 2. Obtener Usuario por ID
```
GET /api/v1/admin/users/:id
```

**Headers:**
```
Authorization: Bearer <token_admin>
```

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "name": "Fernando García",
    "email": "fernando@gmail.com",
    "status": true,
    "provider": "local",
    "role": {
      "name": "admin"
    },
    "createdAt": "2025-11-26T..."
  }
}
```

**Ejemplo Fetch:**
```javascript
const userId = 1;
const response = await fetch(`http://localhost:3000/api/v1/admin/users/${userId}`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
const data = await response.json();
```

---

### 3. Crear Usuario
```
POST /api/v1/admin/users
```

**Headers:**
```
Authorization: Bearer <token_admin>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Nuevo Usuario",
  "email": "nuevo@example.com",
  "password": "password123",
  "roleId": 2,
  "status": true
}
```

**Campos:**
- `name` (string, requerido): Nombre del usuario
- `email` (string, requerido): Email único
- `password` (string, requerido): Contraseña (será hasheada)
- `roleId` (number, requerido): 1 = admin, 2 = player
- `status` (boolean, opcional): true por defecto
- `provider` (string, opcional): "local", "google", etc.

**Response (201):**
```json
{
  "message": "User created successfully",
  "user": {
    "id": 10,
    "name": "Nuevo Usuario",
    "email": "nuevo@example.com",
    "role": {
      "name": "player"
    },
    "provider": "local"
  }
}
```

**Ejemplo Fetch:**
```javascript
const response = await fetch('http://localhost:3000/api/v1/admin/users', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: "Nuevo Usuario",
    email: "nuevo@example.com",
    password: "password123",
    roleId: 2,
    status: true
  })
});
const data = await response.json();
```

---

### 4. Actualizar Usuario
```
PUT /api/v1/admin/users/:id
```

**Headers:**
```
Authorization: Bearer <token_admin>
Content-Type: application/json
```

**Request Body (todos los campos son opcionales):**
```json
{
  "name": "Nombre Actualizado",
  "email": "actualizado@example.com",
  "password": "newpassword123",
  "roleId": 1,
  "status": false
}
```

**Response (200):**
```json
{
  "message": "User updated successfully",
  "user": {
    "id": 10,
    "name": "Nombre Actualizado",
    "email": "actualizado@example.com",
    "status": false,
    "provider": "local",
    "role": {
      "name": "admin"
    },
    "createdAt": "2025-11-26T..."
  }
}
```

**Ejemplo Fetch:**
```javascript
const userId = 10;
const response = await fetch(`http://localhost:3000/api/v1/admin/users/${userId}`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: "Nombre Actualizado",
    status: false
  })
});
const data = await response.json();
```

---

### 5. Eliminar Usuario (Soft Delete)
```
DELETE /api/v1/admin/users/:id
```

**Headers:**
```
Authorization: Bearer <token_admin>
```

**Response (200):**
```json
{
  "message": "User deleted successfully"
}
```

**Nota**: Esto es un soft delete, solo cambia el `status` a `false`.

**Ejemplo Fetch:**
```javascript
const userId = 10;
const response = await fetch(`http://localhost:3000/api/v1/admin/users/${userId}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

---

## Admin - Categorías

> **Nota**: Todas estas rutas requieren rol de **admin**

### 1. Obtener Todas las Categorías
```
GET /api/v1/admin/categories
```

**Headers:**
```
Authorization: Bearer <token_admin>
```

**Response (200):**
```json
{
  "categories": [
    {
      "id": 1,
      "name": "Historia",
      "createdAt": "2025-11-26T..."
    },
    {
      "id": 2,
      "name": "Ciencia",
      "createdAt": "2025-11-26T..."
    },
    {
      "id": 3,
      "name": "Deportes",
      "createdAt": "2025-11-26T..."
    }
  ]
}
```

**Ejemplo Fetch:**
```javascript
const response = await fetch('http://localhost:3000/api/v1/admin/categories', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
const data = await response.json();
```

---

### 2. Obtener Categoría por ID
```
GET /api/v1/admin/categories/:id
```

**Headers:**
```
Authorization: Bearer <token_admin>
```

**Response (200):**
```json
{
  "category": {
    "id": 1,
    "name": "Historia",
    "createdAt": "2025-11-26T..."
  }
}
```

---

### 3. Crear Categoría
```
POST /api/v1/admin/categories
```

**Headers:**
```
Authorization: Bearer <token_admin>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Tecnología"
}
```

**Campos:**
- `name` (string, requerido): Nombre de la categoría

**Response (201):**
```json
{
  "category": {
    "id": 10,
    "name": "Tecnología",
    "createdAt": "2025-11-26T..."
  }
}
```

**Ejemplo Fetch:**
```javascript
const response = await fetch('http://localhost:3000/api/v1/admin/categories', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: "Tecnología"
  })
});
const data = await response.json();
```

---

### 4. Actualizar Categoría
```
PUT /api/v1/admin/categories/:id
```

**Headers:**
```
Authorization: Bearer <token_admin>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Tecnología e Innovación"
}
```

**Response (200):**
```json
{
  "category": {
    "id": 10,
    "name": "Tecnología e Innovación",
    "createdAt": "2025-11-26T..."
  }
}
```

**Ejemplo Fetch:**
```javascript
const categoryId = 10;
const response = await fetch(`http://localhost:3000/api/v1/admin/categories/${categoryId}`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: "Tecnología e Innovación"
  })
});
const data = await response.json();
```

---

## Admin - Quizzes

> **Nota**: Todas estas rutas requieren rol de **admin**

### 1. Obtener Todos los Quizzes
```
GET /api/v1/admin/quizzes
```

**Headers:**
```
Authorization: Bearer <token_admin>
```

**Response (200):**
```json
{
  "quizzes": [
    {
      "id": 1,
      "userId": 1,
      "categoryId": 1,
      "title": "Historia Mundial",
      "description": "Quiz sobre eventos históricos importantes",
      "difficulty": "medium",
      "createdAt": "2025-11-26T..."
    }
  ]
}
```

---

### 2. Obtener Quizzes con Preguntas
```
GET /api/v1/admin/quizzes/with-questions
```

**Headers:**
```
Authorization: Bearer <token_admin>
```

**Response (200):**
```json
{
  "quizzes": [
    {
      "id": 1,
      "userId": 1,
      "categoryId": 1,
      "title": "Historia Mundial",
      "description": "Quiz sobre eventos históricos importantes",
      "difficulty": "medium",
      "createdAt": "2025-11-26T...",
      "Question": [
        {
          "id": 1,
          "quizId": 1,
          "question": "¿En qué año comenzó la Segunda Guerra Mundial?",
          "questionType": "multiple_choice",
          "createdAt": "2025-11-26T..."
        },
        {
          "id": 2,
          "quizId": 1,
          "question": "¿La Revolución Francesa ocurrió en el siglo XVIII?",
          "questionType": "true_false",
          "createdAt": "2025-11-26T..."
        }
      ]
    }
  ]
}
```

---

### 3. Obtener Quizzes con Preguntas y Opciones
```
GET /api/v1/admin/quizzes/with-questions-answers
```

**Headers:**
```
Authorization: Bearer <token_admin>
```

**Response (200):**
```json
{
  "quizzes": [
    {
      "id": 1,
      "userId": 1,
      "categoryId": 1,
      "title": "Historia Mundial",
      "description": "Quiz sobre eventos históricos importantes",
      "difficulty": "medium",
      "createdAt": "2025-11-26T...",
      "Question": [
        {
          "id": 1,
          "quizId": 1,
          "question": "¿En qué año comenzó la Segunda Guerra Mundial?",
          "questionType": "multiple_choice",
          "createdAt": "2025-11-26T...",
          "Options": [
            {
              "id": 1,
              "questionId": 1,
              "text": "1939",
              "isCorrect": true,
              "createdAt": "2025-11-26T..."
            },
            {
              "id": 2,
              "questionId": 1,
              "text": "1945",
              "isCorrect": false,
              "createdAt": "2025-11-26T..."
            },
            {
              "id": 3,
              "questionId": 1,
              "text": "1914",
              "isCorrect": false,
              "createdAt": "2025-11-26T..."
            }
          ]
        }
      ]
    }
  ]
}
```

---

### 4. Obtener Quiz por ID
```
GET /api/v1/admin/quizzes/:id
```

**Headers:**
```
Authorization: Bearer <token_admin>
```

**Response (200):**
```json
{
  "quizz": {
    "id": 1,
    "userId": 1,
    "categoryId": 1,
    "title": "Historia Mundial",
    "description": "Quiz sobre eventos históricos importantes",
    "difficulty": "medium",
    "createdAt": "2025-11-26T...",
    "Question": [
      {
        "id": 1,
        "quizId": 1,
        "question": "¿En qué año comenzó la Segunda Guerra Mundial?",
        "questionType": "multiple_choice",
        "createdAt": "2025-11-26T...",
        "Options": [...]
      }
    ]
  }
}
```

---

### 5. Obtener Quizzes por Categoría
```
GET /api/v1/admin/quizzes/category/:categoryId
```

**Headers:**
```
Authorization: Bearer <token_admin>
```

**Response (200):**
```json
{
  "quizzes": [
    {
      "id": 1,
      "categoryId": 1,
      "title": "Historia Mundial",
      "description": "Quiz sobre eventos históricos importantes",
      "difficulty": "medium",
      "Question": [...]
    }
  ]
}
```

---

### 6. Crear Quiz Simple
```
POST /api/v1/admin/quizzes
```

**Headers:**
```
Authorization: Bearer <token_admin>
Content-Type: application/json
```

**Request Body:**
```json
{
  "categoryId": 1,
  "title": "Geografía Europea",
  "description": "Quiz sobre países y capitales de Europa",
  "difficulty": "easy"
}
```

**Campos:**
- `categoryId` (number, requerido): ID de la categoría
- `title` (string, requerido): Título del quiz
- `description` (string, requerido): Descripción del quiz
- `difficulty` (string, requerido): "easy", "medium", "hard"
- `userId` se asigna automáticamente del token

**Response (201):**
```json
{
  "quizz": {
    "id": 20,
    "userId": 1,
    "categoryId": 1,
    "title": "Geografía Europea",
    "description": "Quiz sobre países y capitales de Europa",
    "difficulty": "easy",
    "createdAt": "2025-11-26T..."
  }
}
```

**Ejemplo Fetch:**
```javascript
const response = await fetch('http://localhost:3000/api/v1/admin/quizzes', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    categoryId: 1,
    title: "Geografía Europea",
    description: "Quiz sobre países y capitales de Europa",
    difficulty: "easy"
  })
});
const data = await response.json();
```

---

### 7. Crear Quiz con Preguntas
```
POST /api/v1/admin/quizzes/with-questions
```

**Headers:**
```
Authorization: Bearer <token_admin>
Content-Type: application/json
```

**Request Body:**
```json
{
  "categoryId": 1,
  "title": "Geografía Europea",
  "description": "Quiz sobre países y capitales de Europa",
  "difficulty": "easy",
  "questions": [
    {
      "question": "¿Cuál es la capital de Francia?",
      "questionType": "multiple_choice"
    },
    {
      "question": "¿España está en Europa?",
      "questionType": "true_false"
    }
  ]
}
```

**Campos de questions:**
- `question` (string, requerido): Texto de la pregunta
- `questionType` (enum, requerido): "multiple_choice" o "true_false"

**Response (201):**
```json
{
  "quizz": {
    "id": 20,
    "userId": 1,
    "categoryId": 1,
    "title": "Geografía Europea",
    "description": "Quiz sobre países y capitales de Europa",
    "difficulty": "easy",
    "createdAt": "2025-11-26T...",
    "Question": [
      {
        "id": 50,
        "quizId": 20,
        "question": "¿Cuál es la capital de Francia?",
        "questionType": "multiple_choice",
        "createdAt": "2025-11-26T..."
      },
      {
        "id": 51,
        "quizId": 20,
        "question": "¿España está en Europa?",
        "questionType": "true_false",
        "createdAt": "2025-11-26T..."
      }
    ]
  }
}
```

**Ejemplo Fetch:**
```javascript
const response = await fetch('http://localhost:3000/api/v1/admin/quizzes/with-questions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    categoryId: 1,
    title: "Geografía Europea",
    description: "Quiz sobre países y capitales de Europa",
    difficulty: "easy",
    questions: [
      {
        question: "¿Cuál es la capital de Francia?",
        questionType: "multiple_choice"
      },
      {
        question: "¿España está en Europa?",
        questionType: "true_false"
      }
    ]
  })
});
const data = await response.json();
```

---

### 8. Crear Quiz Completo (con Preguntas y Opciones)
```
POST /api/v1/admin/quizzes/with-questions-answers
```

**Headers:**
```
Authorization: Bearer <token_admin>
Content-Type: application/json
```

**Request Body:**
```json
{
  "categoryId": 1,
  "title": "Geografía Europea",
  "description": "Quiz sobre países y capitales de Europa",
  "difficulty": "easy",
  "questions": [
    {
      "question": "¿Cuál es la capital de Francia?",
      "questionType": "multiple_choice",
      "options": [
        {
          "text": "París",
          "isCorrect": true
        },
        {
          "text": "Londres",
          "isCorrect": false
        },
        {
          "text": "Berlín",
          "isCorrect": false
        },
        {
          "text": "Madrid",
          "isCorrect": false
        }
      ]
    },
    {
      "question": "¿España está en Europa?",
      "questionType": "true_false",
      "options": [
        {
          "text": "Verdadero",
          "isCorrect": true
        },
        {
          "text": "Falso",
          "isCorrect": false
        }
      ]
    }
  ]
}
```

**Campos de options:**
- `text` (string, requerido): Texto de la opción
- `isCorrect` (boolean, requerido): true si es la respuesta correcta

**Response (201):**
```json
{
  "quizz": {
    "id": 20,
    "userId": 1,
    "categoryId": 1,
    "title": "Geografía Europea",
    "description": "Quiz sobre países y capitales de Europa",
    "difficulty": "easy",
    "createdAt": "2025-11-26T...",
    "Question": [
      {
        "id": 50,
        "quizId": 20,
        "question": "¿Cuál es la capital de Francia?",
        "questionType": "multiple_choice",
        "createdAt": "2025-11-26T...",
        "Options": [
          {
            "id": 100,
            "questionId": 50,
            "text": "París",
            "isCorrect": true,
            "createdAt": "2025-11-26T..."
          },
          {
            "id": 101,
            "questionId": 50,
            "text": "Londres",
            "isCorrect": false,
            "createdAt": "2025-11-26T..."
          },
          {
            "id": 102,
            "questionId": 50,
            "text": "Berlín",
            "isCorrect": false,
            "createdAt": "2025-11-26T..."
          },
          {
            "id": 103,
            "questionId": 50,
            "text": "Madrid",
            "isCorrect": false,
            "createdAt": "2025-11-26T..."
          }
        ]
      },
      {
        "id": 51,
        "quizId": 20,
        "question": "¿España está en Europa?",
        "questionType": "true_false",
        "createdAt": "2025-11-26T...",
        "Options": [
          {
            "id": 104,
            "questionId": 51,
            "text": "Verdadero",
            "isCorrect": true,
            "createdAt": "2025-11-26T..."
          },
          {
            "id": 105,
            "questionId": 51,
            "text": "Falso",
            "isCorrect": false,
            "createdAt": "2025-11-26T..."
          }
        ]
      }
    ]
  }
}
```

**Ejemplo Fetch:**
```javascript
const response = await fetch('http://localhost:3000/api/v1/admin/quizzes/with-questions-answers', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    categoryId: 1,
    title: "Geografía Europea",
    description: "Quiz sobre países y capitales de Europa",
    difficulty: "easy",
    questions: [
      {
        question: "¿Cuál es la capital de Francia?",
        questionType: "multiple_choice",
        options: [
          { text: "París", isCorrect: true },
          { text: "Londres", isCorrect: false },
          { text: "Berlín", isCorrect: false },
          { text: "Madrid", isCorrect: false }
        ]
      },
      {
        question: "¿España está en Europa?",
        questionType: "true_false",
        options: [
          { text: "Verdadero", isCorrect: true },
          { text: "Falso", isCorrect: false }
        ]
      }
    ]
  })
});
const data = await response.json();
```

---

### 9. Actualizar Quiz
```
PUT /api/v1/admin/quizzes/:id
```

**Headers:**
```
Authorization: Bearer <token_admin>
Content-Type: application/json
```

**Request Body (todos los campos son opcionales):**
```json
{
  "title": "Geografía Europea Actualizada",
  "description": "Nueva descripción",
  "difficulty": "medium",
  "categoryId": 2
}
```

**Response (200):**
```json
{
  "quizz": {
    "id": 20,
    "userId": 1,
    "categoryId": 2,
    "title": "Geografía Europea Actualizada",
    "description": "Nueva descripción",
    "difficulty": "medium",
    "createdAt": "2025-11-26T..."
  }
}
```

**Ejemplo Fetch:**
```javascript
const quizId = 20;
const response = await fetch(`http://localhost:3000/api/v1/admin/quizzes/${quizId}`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: "Geografía Europea Actualizada",
    difficulty: "medium"
  })
});
const data = await response.json();
```

---

## Admin - Preguntas

> **Nota**: Todas estas rutas requieren rol de **admin**

### 1. Obtener Todas las Preguntas
```
GET /api/v1/admin/questions
```

**Headers:**
```
Authorization: Bearer <token_admin>
```

**Response (200):**
```json
{
  "questions": [
    {
      "id": 1,
      "quizId": 1,
      "question": "¿En qué año comenzó la Segunda Guerra Mundial?",
      "questionType": "multiple_choice",
      "createdAt": "2025-11-26T..."
    },
    {
      "id": 2,
      "quizId": 1,
      "question": "¿La Revolución Francesa ocurrió en el siglo XVIII?",
      "questionType": "true_false",
      "createdAt": "2025-11-26T..."
    }
  ]
}
```

---

### 2. Obtener Preguntas por Quiz ID
```
GET /api/v1/admin/questions/quizz/:quizzId
```

**Headers:**
```
Authorization: Bearer <token_admin>
```

**Response (200):**
```json
{
  "questions": [
    {
      "id": 50,
      "quizId": 20,
      "question": "¿Cuál es la capital de Francia?",
      "questionType": "multiple_choice",
      "createdAt": "2025-11-26T...",
      "Options": [
        {
          "id": 100,
          "questionId": 50,
          "text": "París",
          "isCorrect": true,
          "createdAt": "2025-11-26T..."
        }
      ]
    }
  ]
}
```

**Ejemplo Fetch:**
```javascript
const quizId = 20;
const response = await fetch(`http://localhost:3000/api/v1/admin/questions/quizz/${quizId}`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
const data = await response.json();
```

---

### 3. Obtener Pregunta por ID
```
GET /api/v1/admin/questions/:id
```

**Headers:**
```
Authorization: Bearer <token_admin>
```

**Response (200):**
```json
{
  "question": {
    "id": 50,
    "quizId": 20,
    "question": "¿Cuál es la capital de Francia?",
    "questionType": "multiple_choice",
    "createdAt": "2025-11-26T..."
  }
}
```

---

### 4. Crear Pregunta
```
POST /api/v1/admin/questions
```

**Headers:**
```
Authorization: Bearer <token_admin>
Content-Type: application/json
```

**Request Body:**
```json
{
  "quizId": 20,
  "question": "¿Cuál es el río más largo del mundo?",
  "questionType": "multiple_choice"
}
```

**Campos:**
- `quizId` (number, requerido): ID del quiz
- `question` (string, requerido): Texto de la pregunta
- `questionType` (enum, requerido): "multiple_choice" o "true_false"

**Response (201):**
```json
{
  "question": {
    "id": 52,
    "quizId": 20,
    "question": "¿Cuál es el río más largo del mundo?",
    "questionType": "multiple_choice",
    "createdAt": "2025-11-26T..."
  }
}
```

**Ejemplo Fetch:**
```javascript
const response = await fetch('http://localhost:3000/api/v1/admin/questions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    quizId: 20,
    question: "¿Cuál es el río más largo del mundo?",
    questionType: "multiple_choice"
  })
});
const data = await response.json();
```

---

### 5. Actualizar Pregunta
```
PUT /api/v1/admin/questions/:id
```

**Headers:**
```
Authorization: Bearer <token_admin>
Content-Type: application/json
```

**Request Body (todos los campos son opcionales):**
```json
{
  "question": "¿Cuál es el río más largo del mundo? (actualizada)",
  "questionType": "true_false"
}
```

**Response (200):**
```json
{
  "question": {
    "id": 52,
    "quizId": 20,
    "question": "¿Cuál es el río más largo del mundo? (actualizada)",
    "questionType": "true_false",
    "createdAt": "2025-11-26T..."
  }
}
```

**Ejemplo Fetch:**
```javascript
const questionId = 52;
const response = await fetch(`http://localhost:3000/api/v1/admin/questions/${questionId}`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    question: "¿Cuál es el río más largo del mundo? (actualizada)"
  })
});
const data = await response.json();
```

---

## Admin - Opciones

> **Nota**: Todas estas rutas requieren rol de **admin**

### 1. Obtener Todas las Opciones
```
GET /api/v1/admin/options
```

**Headers:**
```
Authorization: Bearer <token_admin>
```

**Response (200):**
```json
{
  "options": [
    {
      "id": 1,
      "questionId": 1,
      "text": "1939",
      "isCorrect": true,
      "createdAt": "2025-11-26T..."
    },
    {
      "id": 2,
      "questionId": 1,
      "text": "1945",
      "isCorrect": false,
      "createdAt": "2025-11-26T..."
    }
  ]
}
```

---

### 2. Obtener Opciones por Pregunta ID
```
GET /api/v1/admin/options/question/:questionId
```

**Headers:**
```
Authorization: Bearer <token_admin>
```

**Response (200):**
```json
{
  "options": [
    {
      "id": 100,
      "questionId": 50,
      "text": "París",
      "isCorrect": true,
      "createdAt": "2025-11-26T..."
    },
    {
      "id": 101,
      "questionId": 50,
      "text": "Londres",
      "isCorrect": false,
      "createdAt": "2025-11-26T..."
    }
  ]
}
```

**Ejemplo Fetch:**
```javascript
const questionId = 50;
const response = await fetch(`http://localhost:3000/api/v1/admin/options/question/${questionId}`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
const data = await response.json();
```

---

### 3. Obtener Opción por ID
```
GET /api/v1/admin/options/:id
```

**Headers:**
```
Authorization: Bearer <token_admin>
```

**Response (200):**
```json
{
  "option": {
    "id": 100,
    "questionId": 50,
    "text": "París",
    "isCorrect": true,
    "createdAt": "2025-11-26T..."
  }
}
```

---

### 4. Crear Opción
```
POST /api/v1/admin/options
```

**Headers:**
```
Authorization: Bearer <token_admin>
Content-Type: application/json
```

**Request Body:**
```json
{
  "questionId": 52,
  "text": "Amazonas",
  "isCorrect": false
}
```

**Campos:**
- `questionId` (number, requerido): ID de la pregunta
- `text` (string, requerido): Texto de la opción
- `isCorrect` (boolean, requerido): true si es la respuesta correcta

**Response (201):**
```json
{
  "option": {
    "id": 106,
    "questionId": 52,
    "text": "Amazonas",
    "isCorrect": false,
    "createdAt": "2025-11-26T..."
  }
}
```

**Ejemplo Fetch:**
```javascript
const response = await fetch('http://localhost:3000/api/v1/admin/options', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    questionId: 52,
    text: "Amazonas",
    isCorrect: false
  })
});
const data = await response.json();
```

---

### 5. Actualizar Opción
```
PUT /api/v1/admin/options/:id
```

**Headers:**
```
Authorization: Bearer <token_admin>
Content-Type: application/json
```

**Request Body (todos los campos son opcionales):**
```json
{
  "text": "Río Amazonas",
  "isCorrect": true
}
```

**Response (200):**
```json
{
  "option": {
    "id": 106,
    "questionId": 52,
    "text": "Río Amazonas",
    "isCorrect": true,
    "createdAt": "2025-11-26T..."
  }
}
```

**Ejemplo Fetch:**
```javascript
const optionId = 106;
const response = await fetch(`http://localhost:3000/api/v1/admin/options/${optionId}`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    text: "Río Amazonas",
    isCorrect: true
  })
});
const data = await response.json();
```

---

## Player - Quizzes

> **Nota**: Estas rutas requieren autenticación (cualquier usuario autenticado)

### 1. Obtener Quizzes Disponibles
```
GET /api/v1/player/quizz
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters (todos opcionales):**
- `categoryId` (number): Filtrar por categoría
- `played` (boolean): Filtrar quizzes ya jugados
- `mostPlayed` (boolean): Ordenar por más jugados
- `oldest` (boolean): Ordenar por más antiguos
- `news` (boolean): Ordenar por más nuevos (default)

**Ejemplos de URLs:**
```
GET /api/v1/player/quizz
GET /api/v1/player/quizz?categoryId=1
GET /api/v1/player/quizz?played=true
GET /api/v1/player/quizz?mostPlayed=true
GET /api/v1/player/quizz?categoryId=2&news=true
```

**Response (200):**
```json
{
  "quizzes": [
    {
      "id": 1,
      "userId": 1,
      "categoryId": 1,
      "title": "Historia Mundial",
      "description": "Quiz sobre eventos históricos importantes",
      "difficulty": "medium",
      "createdAt": "2025-11-26T...",
      "_count": {
        "QuizScores": 15
      }
    },
    {
      "id": 2,
      "userId": 1,
      "categoryId": 2,
      "title": "Ciencia Básica",
      "description": "Conceptos básicos de ciencia",
      "difficulty": "easy",
      "createdAt": "2025-11-26T...",
      "_count": {
        "QuizScores": 8
      }
    }
  ]
}
```

**Ejemplo Fetch:**
```javascript
// Obtener todos los quizzes
const response = await fetch('http://localhost:3000/api/v1/player/quizz', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
const data = await response.json();

// Filtrar por categoría
const responseWithCategory = await fetch('http://localhost:3000/api/v1/player/quizz?categoryId=1', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

// Ordenar por más jugados
const responseMostPlayed = await fetch('http://localhost:3000/api/v1/player/quizz?mostPlayed=true', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

---

### 2. Jugar Quiz (Enviar Respuestas)
```
POST /api/v1/player/quizz/:quizId/play
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "answers": [
    {
      "questionId": 1,
      "optionId": 2
    },
    {
      "questionId": 2,
      "optionId": 5
    },
    {
      "questionId": 3,
      "optionId": 10
    }
  ]
}
```

**Campos:**
- `answers` (array, requerido): Array de respuestas
  - `questionId` (number, requerido): ID de la pregunta
  - `optionId` (number, requerido): ID de la opción seleccionada

**Response (200):**
```json
---

## Player - Estadísticas

> **Nota**: Estas rutas requieren autenticación (cualquier usuario autenticado)

### 1. Obtener Estadísticas del Jugador
```
GET /api/v1/player/stats
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "stats": {
    "totalQuizzesPlayed": 15,
    "averageScore": 75,
    "bestScore": 95,
    "worstScore": 45,
    "categoriesPlayed": 5,
    "scoresByCategory": {
      "Historia": {
        "total": 225,
        "count": 3,
        "average": 75
      },
      "Ciencia": {
        "total": 340,
        "count": 4,
        "average": 85
      },
      "Deportes": {
        "total": 160,
        "count": 2,
        "average": 80
      }
    },
    "recentQuizzes": [
      {
        "quizId": 5,
        "quizTitle": "Historia Mundial",
        "categoryName": "Historia",
        "score": 85,
        "playedAt": "2025-11-28T10:30:00Z"
      },
      {
        "quizId": 3,
        "quizTitle": "Ciencia Básica",
        "categoryName": "Ciencia",
        "score": 90,
        "playedAt": "2025-11-27T15:20:00Z"
      }
    ]
  }
}
```

**Descripción de los campos:**
- `totalQuizzesPlayed`: Total de quizzes que el jugador ha completado
- `averageScore`: Promedio de todas las puntuaciones (0-100)
- `bestScore`: Mejor puntuación obtenida
- `worstScore`: Peor puntuación obtenida
- `categoriesPlayed`: Número de categorías diferentes jugadas
- `scoresByCategory`: Estadísticas detalladas por categoría
  - `total`: Suma total de puntos en esa categoría
  - `count`: Número de quizzes jugados en esa categoría
  - `average`: Promedio de puntuación en esa categoría
- `recentQuizzes`: Los últimos 5 quizzes jugados con sus detalles

**Ejemplo Fetch:**
```javascript
const response = await fetch('http://localhost:3000/api/v1/player/stats', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
const data = await response.json();
console.log(`Has jugado ${data.stats.totalQuizzesPlayed} quizzes`);
console.log(`Tu promedio es: ${data.stats.averageScore}%`);
console.log(`Tu mejor puntaje: ${data.stats.bestScore}%`);
```

**Ejemplo para mostrar estadísticas:**
```javascript
async function loadPlayerStats() {
  const data = await api.getPlayerStats();
  const stats = data.stats;
  
  // Mostrar estadísticas generales
  document.getElementById('total-played').textContent = stats.totalQuizzesPlayed;
  document.getElementById('average-score').textContent = `${stats.averageScore}%`;
  document.getElementById('best-score').textContent = `${stats.bestScore}%`;
  document.getElementById('worst-score').textContent = `${stats.worstScore}%`;
  
  // Mostrar estadísticas por categoría
  const categoryContainer = document.getElementById('category-stats');
  Object.keys(stats.scoresByCategory).forEach(category => {
    const categoryData = stats.scoresByCategory[category];
    const categoryElement = `
      <div class="category-stat">
        <h4>${category}</h4>
        <p>Promedio: ${categoryData.average}%</p>
        <p>Jugados: ${categoryData.count}</p>
      </div>
    `;
    categoryContainer.innerHTML += categoryElement;
  });
  
  // Mostrar quizzes recientes
  const recentContainer = document.getElementById('recent-quizzes');
  stats.recentQuizzes.forEach(quiz => {
    const quizElement = `
      <div class="recent-quiz">
        <h5>${quiz.quizTitle}</h5>
        <p>Categoría: ${quiz.categoryName}</p>
        <p>Puntaje: ${quiz.score}%</p>
        <p>Fecha: ${new Date(quiz.playedAt).toLocaleDateString()}</p>
      </div>
    `;
    recentContainer.innerHTML += quizElement;
  });
}
```

---

### 2. Obtener Historial Completo del Jugador
```
GET /api/v1/player/stats/history
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "history": [
    {
      "id": 45,
      "quizId": 5,
      "quizTitle": "Historia Mundial",
      "quizDescription": "Quiz sobre eventos históricos importantes",
      "categoryName": "Historia",
      "difficulty": "medium",
      "score": 85,
      "playedAt": "2025-11-28T10:30:00Z"
    },
    {
      "id": 44,
      "quizId": 3,
      "quizTitle": "Ciencia Básica",
      "quizDescription": "Conceptos básicos de ciencia",
      "categoryName": "Ciencia",
      "difficulty": "easy",
      "score": 90,
      "playedAt": "2025-11-27T15:20:00Z"
    }
  ],
  "totalPlayed": 15
}
```

**Descripción:**
Devuelve el historial completo de todos los quizzes jugados por el jugador autenticado, ordenados del más reciente al más antiguo.

**Ejemplo Fetch:**
```javascript
const response = await fetch('http://localhost:3000/api/v1/player/stats/history', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
const data = await response.json();
console.log(`Historial de ${data.totalPlayed} quizzes`);
data.history.forEach(quiz => {
  console.log(`${quiz.quizTitle}: ${quiz.score}%`);
});
```

**Ejemplo para mostrar historial en tabla:**
```javascript
async function loadPlayerHistory() {
  const data = await api.getPlayerHistory();
  
  const tableBody = document.getElementById('history-table-body');
  tableBody.innerHTML = '';
  
  data.history.forEach(quiz => {
    const row = `
      <tr>
        <td>${quiz.quizTitle}</td>
        <td>${quiz.categoryName}</td>
        <td>${quiz.difficulty}</td>
        <td>${quiz.score}%</td>
        <td>${new Date(quiz.playedAt).toLocaleDateString()}</td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });
  
  document.getElementById('total-played-text').textContent = 
    `Has jugado ${data.totalPlayed} quizzes en total`;
}
```

---

## Códigos de Estado HTTP
  "correctAnswers": 3,
  "score": 60
}
```

**Campos de respuesta:**
- `message`: Mensaje de confirmación
- `totalQuestions`: Número total de preguntas en el quiz
- `correctAnswers`: Número de respuestas correctas
- `score`: Puntaje calculado (porcentaje de respuestas correctas)

**Ejemplo Fetch:**
```javascript
const quizId = 1;
const response = await fetch(`http://localhost:3000/api/v1/player/quizz/${quizId}/play`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    answers: [
      { questionId: 1, optionId: 2 },
      { questionId: 2, optionId: 5 },
      { questionId: 3, optionId: 10 }
    ]
  })
});
const data = await response.json();
console.log(`Obtuviste ${data.correctAnswers} de ${data.totalQuestions} correctas`);
console.log(`Puntaje: ${data.score}%`);
```

**Flujo completo de jugar un quiz:**
```javascript
// 1. Obtener el quiz con sus preguntas y opciones (usando ruta de admin o obteniendo detalles)
const quizResponse = await fetch(`http://localhost:3000/api/v1/admin/quizzes/1`, {
  headers: { 'Authorization': `Bearer ${token}` }
});
const quizData = await quizResponse.json();

// 2. El usuario responde las preguntas en el frontend
// 3. Enviar las respuestas
const playResponse = await fetch(`http://localhost:3000/api/v1/player/quizz/1/play`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    answers: [
      { questionId: 1, optionId: 2 },
      { questionId: 2, optionId: 5 }
    ]
  })
});
const result = await playResponse.json();
console.log(`Tu puntaje: ${result.score}%`);
```

---

## Códigos de Estado HTTP

### Códigos de Éxito
- **200 OK**: Petición exitosa (GET, PUT, DELETE)
- **201 Created**: Recurso creado exitosamente (POST)

### Códigos de Error del Cliente
- **400 Bad Request**: Petición malformada o datos inválidos
- **401 Unauthorized**: Token JWT inválido o ausente
- **403 Forbidden**: Usuario autenticado pero sin permisos (no es admin)
- **404 Not Found**: Recurso no encontrado
- **422 Unprocessable Entity**: Errores de validación

### Códigos de Error del Servidor
- **500 Internal Server Error**: Error interno del servidor

---

## Ejemplos de Errores Comunes

### Error 401 - No autorizado
```json
{
  "message": "Unauthorized"
}
```

### Error 403 - Sin permisos
```json
{
  "message": "Access denied: requires Admin privileges"
}
```

### Error 404 - No encontrado
```json
{
  "message": "User not found"
}
```

### Error 422 - Validación
```json
{
  "message": "Validation errors",
  "errors": [
    {
      "type": "field",
      "value": "",
      "msg": "Name is required",
      "path": "name",
      "location": "body"
    },
    {
      "type": "field",
      "value": "invalid-email",
      "msg": "Invalid email format",
      "path": "email",
      "location": "body"
    }
  ]
}
```

---

## Clase Helper Completa para el Frontend

```javascript
class TriviasAPI {
  constructor(baseURL = 'http://localhost:3000/api/v1') {
    this.baseURL = baseURL;
  }

  // Autenticación
  async register(name, email, password) {
    return await this.post('/auth/register', { name, email, password }, false);
  }

  async login(email, password) {
    const data = await this.post('/auth/login', { email, password }, false);
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  }

  async getProfile() {
    return await this.get('/auth/profile');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  // Dashboard (Admin)
  async getDashboardStats() {
    return await this.get('/admin/dashboard/stats');
  }

  // Usuarios (Admin)
  async getAllUsers() {
    return await this.get('/admin/users');
  }

  async getUserById(id) {
    return await this.get(`/admin/users/${id}`);
  }

  async createUser(userData) {
    return await this.post('/admin/users', userData);
  }

  async updateUser(id, userData) {
    return await this.put(`/admin/users/${id}`, userData);
  }

  async deleteUser(id) {
    return await this.delete(`/admin/users/${id}`);
  }

  // Categorías (Admin)
  async getAllCategories() {
    return await this.get('/admin/categories');
  }

  async getCategoryById(id) {
    return await this.get(`/admin/categories/${id}`);
  }

  async createCategory(name) {
    return await this.post('/admin/categories', { name });
  }

  async updateCategory(id, name) {
    return await this.put(`/admin/categories/${id}`, { name });
  }

  // Quizzes (Admin)
  async getAllQuizzes() {
    return await this.get('/admin/quizzes');
  }

  async getQuizzesWithQuestions() {
    return await this.get('/admin/quizzes/with-questions');
  }

  async getQuizzesWithQuestionsAndAnswers() {
    return await this.get('/admin/quizzes/with-questions-answers');
  }

  async getQuizById(id) {
    return await this.get(`/admin/quizzes/${id}`);
  }

  async createQuiz(quizData) {
    return await this.post('/admin/quizzes', quizData);
  }

  async createQuizWithQuestions(quizData) {
    return await this.post('/admin/quizzes/with-questions', quizData);
  }

  async createQuizComplete(quizData) {
    return await this.post('/admin/quizzes/with-questions-answers', quizData);
  }

  async updateQuiz(id, quizData) {
    return await this.put(`/admin/quizzes/${id}`, quizData);
  }

  // Preguntas (Admin)
  async getAllQuestions() {
    return await this.get('/admin/questions');
  }

  async getQuestionsByQuizId(quizId) {
    return await this.get(`/admin/questions/quizz/${quizId}`);
  }

  async getQuestionById(id) {
    return await this.get(`/admin/questions/${id}`);
  }

  async createQuestion(questionData) {
    return await this.post('/admin/questions', questionData);
  }

  async updateQuestion(id, questionData) {
    return await this.put(`/admin/questions/${id}`, questionData);
  }

  // Opciones (Admin)
  async getAllOptions() {
    return await this.get('/admin/options');
  }

  async getOptionsByQuestionId(questionId) {
    return await this.get(`/admin/options/question/${questionId}`);
  }

  async getOptionById(id) {
    return await this.get(`/admin/options/${id}`);
  }

  async createOption(optionData) {
    return await this.post('/admin/options', optionData);
  }

  async updateOption(id, optionData) {
    return await this.put(`/admin/options/${id}`, optionData);
  }

  // Player - Quizzes
  async getAvailableQuizzes(filters = {}) {
    const params = new URLSearchParams(filters);
    const queryString = params.toString();
    return await this.get(`/player/quizz${queryString ? '?' + queryString : ''}`);
  }

  async playQuiz(quizId, answers) {
    return await this.post(`/player/quizz/${quizId}/play`, { answers });
  }

  // Player - Estadísticas
  async getPlayerStats() {
    return await this.get('/player/stats');
  }

  async getPlayerHistory() {
    return await this.get('/player/stats/history');
  }

  // Métodos HTTP base
  async get(endpoint) {
    return await this.request(endpoint, 'GET');
  }

  async post(endpoint, data, requiresAuth = true) {
    return await this.request(endpoint, 'POST', data, requiresAuth);
  }

  async put(endpoint, data) {
    return await this.request(endpoint, 'PUT', data);
  }

  async delete(endpoint) {
    return await this.request(endpoint, 'DELETE');
  }

  async request(endpoint, method, data = null, requiresAuth = true) {
    const token = localStorage.getItem('token');
    
    if (requiresAuth && !token) {
      throw new Error('No autenticado');
    }

    const headers = {
      'Content-Type': 'application/json',
    };

    if (requiresAuth && token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
      method,
      headers,
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, options);
      
      if (response.status === 401) {
        this.logout();
        throw new Error('Sesión expirada');
      }

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Error en la petición');
      }

      return responseData;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Utilidades
  getToken() {
    return localStorage.getItem('token');
  }

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  isAdmin() {
    const user = this.getUser();
    return user?.role?.name === 'admin';
  }

// Ejemplos de uso
// await api.login('admin@example.com', 'password123');
// const dashboardStats = await api.getDashboardStats();
// const quizzes = await api.getAllQuizzes();
// const result = await api.playQuiz(1, [{ questionId: 1, optionId: 2 }]);
// const playerStats = await api.getPlayerStats();
// const history = await api.getPlayerHistory();
}

// Exportar instancia
const api = new TriviasAPI();

// Ejemplos de uso
// await api.login('admin@example.com', 'password123');
// const quizzes = await api.getAllQuizzes();
// const result = await api.playQuiz(1, [{ questionId: 1, optionId: 2 }]);
```

---

## Usuarios de Prueba

### Administradores
| Email | Password |
|-------|----------|
| `fernando@gmail.com` | `admin123` |
| `miguel@gmail.com` | `admin123` |

### Jugadores
| Email | Password |
|-------|----------|
| `laura@gmail.com` | `player123` |
| `carlos@gmail.com` | `player123` |
| `ana@gmail.com` | `player123` |
| `pedro@gmail.com` | `player123` |

---

## Documentación Swagger

Accede a la documentación interactiva completa en:
```
http://localhost:3000/api-docs
```
