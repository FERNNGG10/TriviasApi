# Guía de Implementación de Autenticación - Frontend

## Flujo de Autenticación

Tu API usa **JWT (JSON Web Tokens)** para autenticación. El token se envía en el header `Authorization` con formato `Bearer <token>`.

> ⚠️ **IMPORTANTE**: Todas las rutas del API usan el prefijo `/api/v1`
> 
> **Base URL**: `http://localhost:3000/api/v1`

---

## 1. Registro de Usuario

### Endpoint
```
POST http://localhost:3000/api/v1/auth/register
```

### Request Body
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123"
}
```

### Response (Success - 201)
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

### Ejemplo en JavaScript/Fetch
```javascript
async function register(name, email, password) {
  try {
    const response = await fetch('http://localhost:3000/api/v1/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('Usuario registrado:', data.user);
      // Después del registro, debes hacer login
      return data;
    } else {
      throw new Error(data.message || 'Error en el registro');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

---

## 2. Login (Autenticación Local)

### Endpoint
```
POST http://localhost:3000/api/v1/auth/login
```

### Request Body
```json
{
  "email": "juan@example.com",
  "password": "password123"
}
```

### Response (Success - 200)
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "role": {
      "name": "player"  // o "admin"
    }
  }
}
```

### Ejemplo en JavaScript/Fetch
```javascript
async function login(email, password) {
  try {
    const response = await fetch('http://localhost:3000/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Guardar el token en localStorage o sessionStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      console.log('Login exitoso:', data.user);
      return data;
    } else {
      throw new Error(data.message || 'Credenciales inválidas');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

---

## 3. Obtener Perfil del Usuario Autenticado

### Endpoint
```
GET http://localhost:3000/api/v1/auth/profile
```

### Headers Requeridos
```
Authorization: Bearer <tu_token_jwt>
```

### Response (Success - 200)
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

### Ejemplo en JavaScript/Fetch
```javascript
async function getProfile() {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('No hay sesión activa');
  }
  
  try {
    const response = await fetch('http://localhost:3000/api/v1/auth/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    
    const data = await response.json();
    
    if (response.ok) {
      return data;
    } else if (response.status === 401) {
      // Token inválido o expirado
      logout();
      throw new Error('Sesión expirada, por favor inicia sesión de nuevo');
    } else {
      throw new Error(data.message || 'Error al obtener perfil');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

---

## 4. Login con Google (OAuth2)

### Flujo
1. Redirigir al usuario a: `http://localhost:3000/api/v1/auth/google`
2. El usuario autoriza en Google
3. Google redirige a: `http://localhost:3000/api/v1/auth/google/callback`
4. La API maneja el callback y devuelve el token

### Implementación en HTML
```html
<button onclick="loginWithGoogle()">Iniciar sesión con Google</button>

<script>
function loginWithGoogle() {
  // Redirigir a la ruta de Google OAuth
  window.location.href = 'http://localhost:3000/api/v1/auth/google';
}
</script>
```

### Manejo del Callback
Después de la autenticación, Google redirige a tu callback. Necesitas configurar en tu `.env`:
```
GOOGLE_CALLBACK_URL=http://localhost:3000/api/v1/auth/google/callback
```

La API debe redirigir al frontend con el token. Si estás usando un frontend separado, modifica el callback en `src/controllers/auth/auth.controller.ts` para que redirija a tu frontend con el token en la URL:

```typescript
// Ejemplo de redirección al frontend con token
res.redirect(`http://localhost:5173/auth/callback?token=${token}`);
```

Luego en tu frontend:
```javascript
// En la página de callback (ej: /auth/callback)
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

if (token) {
  localStorage.setItem('token', token);
  // Obtener el perfil del usuario
  await getProfile();
  // Redirigir al dashboard
  window.location.href = '/dashboard';
}
```

---

## 5. Logout

### Implementación en Frontend
```javascript
function logout() {
  // Eliminar token y datos del usuario
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  // Redirigir al login
  window.location.href = '/login';
}
```

---

## 6. Hacer Peticiones Autenticadas

Para cualquier ruta que requiera autenticación (marcadas como "require Admin privileges" o "require user authentication"), debes incluir el token en el header.

### Función Helper
```javascript
async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('No hay sesión activa');
  }
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers
  };
  
  try {
    const response = await fetch(url, {
      ...options,
      headers
    });
    
    if (response.status === 401) {
      // Token expirado o inválido
      logout();
      throw new Error('Sesión expirada');
    }
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error en la petición');
    }
    
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

### Ejemplo de Uso
```javascript
// GET request
const quizzes = await fetchWithAuth('http://localhost:3000/api/v1/player/quizz');

// POST request
const result = await fetchWithAuth('http://localhost:3000/api/v1/player/quizz/1/play', {
  method: 'POST',
  body: JSON.stringify({
    answers: [
      { questionId: 1, optionId: 2 },
      { questionId: 2, optionId: 5 }
    ]
  })
});
```

---

## 7. Verificar Roles

Si necesitas verificar si el usuario es admin o player:

```javascript
function isAdmin() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user?.role?.name === 'admin';
}

function isPlayer() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user?.role?.name === 'player';
}

// Proteger rutas en tu router
if (!isAdmin()) {
  console.error('Acceso denegado: requiere permisos de administrador');
  window.location.href = '/dashboard';
}
```

---

## 8. Ejemplo Completo - Clase AuthService

```javascript
class AuthService {
  constructor() {
    this.baseURL = 'http://localhost:3000/api/v1';
  }

  async register(name, email, password) {
    const response = await fetch(`${this.baseURL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    return await response.json();
  }

  async login(email, password) {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  }

  async getProfile() {
    const token = this.getToken();
    const response = await fetch(`${this.baseURL}/auth/profile`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.status === 401) {
      this.logout();
      throw new Error('Sesión expirada');
    }
    
    return await response.json();
  }

  loginWithGoogle() {
    window.location.href = `${this.baseURL}/auth/google`;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

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

  async fetchWithAuth(endpoint, options = {}) {
    const token = this.getToken();
    
    if (!token) {
      throw new Error('No autenticado');
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
      }
    });

    if (response.status === 401) {
      this.logout();
      throw new Error('Sesión expirada');
    }

    return await response.json();
  }
}

// Uso
const auth = new AuthService();

// Login
await auth.login('user@example.com', 'password123');

// Obtener quizzes
const quizzes = await auth.fetchWithAuth('/player/quizz');

// Verificar si es admin
if (auth.isAdmin()) {
  console.log('Usuario es administrador');
}
```

---

## 9. Manejo de Errores Comunes

### 401 Unauthorized
- Token no válido o expirado
- **Solución**: Hacer logout y pedir login nuevamente

### 403 Forbidden
- Usuario no tiene permisos para esa acción
- **Solución**: Verificar rol del usuario

### 422 Unprocessable Entity
- Datos de validación incorrectos
- **Solución**: Revisar el formato de los datos enviados

---

## 10. Configuración CORS

Si tu frontend está en un puerto diferente (ej: `localhost:5173`), asegúrate de que el backend tenga CORS configurado correctamente en `src/app.ts`:

```typescript
import cors from 'cors';

app.use(cors({
  origin: 'http://localhost:5173', // Tu puerto del frontend
  credentials: true
}));
```

---

## 11. Obtener Lista de Usuarios (Solo Admin)

### Endpoint
```
GET http://localhost:3000/api/v1/admin/users
```

### Headers Requeridos
```
Authorization: Bearer <token_de_admin>
```

### Response (Success - 200)
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

### Ejemplo en JavaScript/Fetch
```javascript
async function getAllUsers() {
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch('http://localhost:3000/api/v1/admin/users', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('Usuarios:', data.users);
      return data.users;
    } else if (response.status === 403) {
      throw new Error('Acceso denegado: requiere permisos de administrador');
    } else {
      throw new Error(data.message || 'Error al obtener usuarios');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

### Usando AuthService
```javascript
// Obtener todos los usuarios (solo admin)
const data = await auth.fetchWithAuth('/admin/users');
console.log(data.users);
```

---

## 12. Usuarios de Prueba

La base de datos incluye usuarios precargados para testing:

### Administradores (Acceso a `/admin/*`):
| Email | Password | Rol |
|-------|----------|-----|
| `fernando@gmail.com` | `admin123` | admin |
| `miguel@gmail.com` | `admin123` | admin |

### Jugadores (Acceso a `/player/*`):
| Email | Password | Rol |
|-------|----------|-----|
| `laura@gmail.com` | `player123` | player |
| `carlos@gmail.com` | `player123` | player |
| `ana@gmail.com` | `player123` | player |
| `pedro@gmail.com` | `player123` | player |

### Ejemplo de Login como Admin:
```javascript
await auth.login('miguel@gmail.com', 'admin123');
// Response incluye user.role.name === 'admin'
```

---

## Resumen Rápido

1. **Registro**: `POST /api/v1/auth/register` → No devuelve token, hacer login después
2. **Login**: `POST /api/v1/auth/login` → Devuelve `token` y `user` (con rol), guardarlo en localStorage
3. **Peticiones autenticadas**: Incluir header `Authorization: Bearer <token>`
4. **Verificar sesión**: `GET /api/v1/auth/profile`
5. **Google OAuth**: Redirigir a `/api/v1/auth/google`
6. **Logout**: Eliminar token del localStorage

**Roles disponibles:**
- `admin` - Acceso completo a rutas `/admin/*`
- `player` - Acceso a rutas `/player/*` y `/auth/*`
