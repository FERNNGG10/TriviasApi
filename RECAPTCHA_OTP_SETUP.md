# 🔐 Configuración de reCAPTCHA y OTP

## 📋 Tabla de Contenidos
- [Configuración de reCAPTCHA](#configuración-de-recaptcha)
- [Configuración de Email para OTP](#configuración-de-email-para-otp)
- [Variables de Entorno](#variables-de-entorno)
- [Uso de la API](#uso-de-la-api)
- [Flujo de Registro](#flujo-de-registro)
- [Flujo de Login](#flujo-de-login)

---

## 🔒 Configuración de reCAPTCHA

### 1. Obtener Claves de reCAPTCHA

Ya tienes tus claves proporcionadas:

**Clave de Sitio (Site Key):** `6LfyqyEsAAAAAODH6-3MPyV2Q6nZsuBwnmxlaRlh`  
**Clave Secreta (Secret Key):** `6LfyqyEsAAAAABR1JldspGbzCyCGAawQj0G69qlC`

Si necesitas crear nuevas claves:
1. Ve a [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
2. Haz clic en el botón "+" para crear un nuevo sitio
3. Configuración:
   - **Label:** Trivia Challenge
   - **reCAPTCHA type:** reCAPTCHA v2 → "I'm not a robot" Checkbox
   - **Domains:** 
     - `localhost` (para desarrollo)
     - `triviachallenge.online`
     - `app.triviachallenge.online`
   - Acepta los términos y envía

### 2. Implementación en Angular/Ionic (Frontend)

#### Instalar el paquete de reCAPTCHA:

```bash
npm install ng-recaptcha
```

#### En tu `app.module.ts` o donde uses módulos standalone:

```typescript
import { RECAPTCHA_SETTINGS, RecaptchaSettings, RecaptchaModule } from 'ng-recaptcha';

@NgModule({
  imports: [
    RecaptchaModule,
    // ... otros módulos
  ],
  providers: [
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: '6LfyqyEsAAAAAODH6-3MPyV2Q6nZsuBwnmxlaRlh',
      } as RecaptchaSettings,
    },
  ],
})
export class AppModule { }
```

#### En tu componente de login/registro:

**login.component.ts:**
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  template: `
    <form (ngSubmit)="onSubmit()">
      <ion-input [(ngModel)]="email" name="email" type="email"></ion-input>
      <ion-input [(ngModel)]="password" name="password" type="password"></ion-input>
      
      <re-captcha
        (resolved)="onCaptchaResolved($event)"
        siteKey="6LfyqyEsAAAAAODH6-3MPyV2Q6nZsuBwnmxlaRlh">
      </re-captcha>
      
      <ion-button type="submit" [disabled]="!recaptchaToken">
        Login
      </ion-button>
    </form>
  `
})
export class LoginComponent {
  email = '';
  password = '';
  recaptchaToken = '';

  onCaptchaResolved(token: string) {
    this.recaptchaToken = token;
  }

  async onSubmit() {
    const response = await this.authService.login({
      email: this.email,
      password: this.password,
      recaptchaToken: this.recaptchaToken
    });
  }
}
```

---

## 📧 Configuración de Email para OTP

### 1. Configurar Gmail para envío de emails

#### Opción A: Usar Gmail con App Password (Recomendado)

1. Ve a tu cuenta de Google: https://myaccount.google.com/
2. Seguridad → Verificación en 2 pasos (debes activarla primero)
3. Contraseñas de aplicaciones
4. Selecciona "Correo" y "Otro (nombre personalizado)"
5. Escribe "Trivia Challenge API"
6. Google te dará una contraseña de 16 caracteres
7. Usa esa contraseña en tu archivo `.env`

#### Opción B: Usar otro proveedor SMTP

Puedes usar servicios como:
- **SendGrid**: Gratis hasta 100 emails/día
- **Mailgun**: Gratis hasta 5,000 emails/mes
- **AWS SES**: Muy económico
- **Resend**: Moderno y fácil de usar

### 2. Variables de Entorno

Crea o edita tu archivo `.env` en la raíz del proyecto:

```env
# reCAPTCHA
RECAPTCHA_SECRET_KEY=6LfyqyEsAAAAABR1JldspGbzCyCGAawQj0G69qlC

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=tu-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx  # App Password de 16 caracteres
EMAIL_FROM="Trivia Challenge <noreply@triviachallenge.online>"

# OTP Configuration
OTP_EXPIRATION_MINUTES=10
```

**Ejemplo con SendGrid:**
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=apikey
EMAIL_PASSWORD=SG.tu-api-key-aqui
EMAIL_FROM="Trivia Challenge <noreply@triviachallenge.online>"
```

---

## 🔄 Uso de la API

### Endpoints Disponibles

#### 1. **Solicitar OTP**
```http
POST /api/v1/auth/otp/request
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "recaptchaToken": "token-del-recaptcha",
  "purpose": "register"  // o "login"
}
```

**Respuesta exitosa:**
```json
{
  "message": "OTP sent successfully to your email"
}
```

#### 2. **Verificar OTP**
```http
POST /api/v1/auth/otp/verify
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "code": "123456"
}
```

**Respuesta exitosa:**
```json
{
  "message": "OTP verified successfully",
  "verified": true
}
```

#### 3. **Registro con OTP**
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "usuario@ejemplo.com",
  "password": "MiPassword123!",
  "otpCode": "123456",
  "recaptchaToken": "token-del-recaptcha"
}
```

#### 4. **Login con reCAPTCHA**
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "MiPassword123!",
  "recaptchaToken": "token-del-recaptcha"
}
```

---

## 📝 Flujo de Registro

### Frontend (Angular/Ionic)

```typescript
// 1. Usuario llena el formulario de registro
async onRegisterStep1() {
  // Solicitar OTP
  const response = await this.http.post('/api/v1/auth/otp/request', {
    email: this.email,
    recaptchaToken: this.recaptchaToken,
    purpose: 'register'
  }).toPromise();

  // Mostrar modal/página para ingresar código OTP
  this.showOTPInput = true;
}

// 2. Usuario ingresa el código OTP recibido por email
async onRegisterStep2() {
  // Verificar OTP primero (opcional, para dar feedback inmediato)
  const verified = await this.http.post('/api/v1/auth/otp/verify', {
    email: this.email,
    code: this.otpCode
  }).toPromise();

  if (verified) {
    // 3. Registrar usuario
    const user = await this.http.post('/api/v1/auth/register', {
      name: this.name,
      email: this.email,
      password: this.password,
      otpCode: this.otpCode,
      recaptchaToken: this.recaptchaToken
    }).toPromise();

    // Redirigir al usuario
    this.router.navigate(['/home']);
  }
}
```

### Flujo Completo

1. **Usuario llena formulario** → nombre, email, contraseña
2. **Completa reCAPTCHA** → obtiene token
3. **Hace clic en "Registrarse"** → POST `/otp/request`
4. **Recibe email con código OTP** de 6 dígitos
5. **Ingresa código OTP** en la app
6. **Hace clic en "Verificar y Registrar"** → POST `/register` con OTP
7. **Backend verifica OTP** y crea cuenta
8. **Usuario recibe email de bienvenida**
9. **Redirección automática** al dashboard

---

## 🔐 Flujo de Login

### Opción A: Login Simple (sin OTP)

```typescript
async login() {
  const response = await this.http.post('/api/v1/auth/login', {
    email: this.email,
    password: this.password,
    recaptchaToken: this.recaptchaToken
  }).toPromise();

  localStorage.setItem('token', response.token);
  this.router.navigate(['/dashboard']);
}
```

### Opción B: Login con OTP (2FA)

Si quieres agregar verificación de dos factores al login:

```typescript
// 1. Login inicial
async onLoginStep1() {
  const response = await this.http.post('/api/v1/auth/login/request-otp', {
    email: this.email,
    password: this.password,
    recaptchaToken: this.recaptchaToken
  }).toPromise();

  this.showOTPInput = true;
}

// 2. Verificar OTP
async onLoginStep2() {
  const response = await this.http.post('/api/v1/auth/login/verify-otp', {
    email: this.email,
    otpCode: this.otpCode
  }).toPromise();

  localStorage.setItem('token', response.token);
  this.router.navigate(['/dashboard']);
}
```

---

## 🧪 Pruebas

### Probar en Postman

1. **Solicitar OTP:**
```bash
POST http://localhost:3000/api/v1/auth/otp/request
{
  "email": "tu-email@gmail.com",
  "purpose": "register"
}
```

2. **Verificar en tu email** el código de 6 dígitos

3. **Registrar usuario:**
```bash
POST http://localhost:3000/api/v1/auth/register
{
  "name": "Test User",
  "email": "tu-email@gmail.com",
  "password": "Test123!",
  "otpCode": "123456"
}
```

### Modo Desarrollo

En desarrollo, puedes usar `verifyRecaptchaOptional` en lugar de `verifyRecaptcha` para saltear la verificación:

```typescript
// En auth.route.ts
router.post("/otp/request", verifyRecaptchaOptional, requestOTP);
```

---

## ⚠️ Seguridad

### Recomendaciones

1. **Nunca expongas tus claves** en el código fuente
2. **Usa HTTPS** en producción
3. **Limita intentos** de verificación OTP (implementar rate limiting)
4. **Expira tokens rápidamente** (10 minutos configurado)
5. **Valida emails** antes de enviar OTP
6. **Monitorea uso** de emails para detectar abusos

### Rate Limiting (Opcional pero Recomendado)

```bash
npm install express-rate-limit
```

```typescript
import rateLimit from 'express-rate-limit';

const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 3, // máximo 3 solicitudes por IP
  message: 'Too many OTP requests, please try again later'
});

router.post("/otp/request", otpLimiter, verifyRecaptcha, requestOTP);
```

---

## 🐛 Troubleshooting

### Error: "Error sending OTP"

- Verifica que las credenciales de email sean correctas
- Si usas Gmail, asegúrate de usar App Password
- Verifica que el puerto 587 esté abierto

### Error: "reCAPTCHA verification failed"

- Verifica que la clave secreta sea correcta
- Asegúrate de que el dominio esté registrado
- En desarrollo, usa `localhost`

### Email no llega

- Revisa la carpeta de spam
- Verifica que `EMAIL_FROM` tenga formato correcto
- Prueba con otro proveedor de email

---

## 📚 Recursos Adicionales

- [Google reCAPTCHA Docs](https://developers.google.com/recaptcha)
- [Nodemailer Documentation](https://nodemailer.com/)
- [ng-recaptcha](https://github.com/DethAriel/ng-recaptcha)

---

¡Listo! Tu API ahora tiene protección con reCAPTCHA y verificación por OTP. 🎉
