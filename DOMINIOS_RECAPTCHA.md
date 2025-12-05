# 🌐 Configuración de Dominios para reCAPTCHA

## Dominios Actuales Configurados

Tus claves de reCAPTCHA ya están configuradas:

- **Clave de Sitio (Site Key):** `6LfyqyEsAAAAAODH6-3MPyV2Q6nZsuBwnmxlaRlh`
- **Clave Secreta (Secret Key):** `6LfyqyEsAAAAABR1JldspGbzCyCGAawQj0G69qlC`

## ✅ Cómo Agregar Dominios Locales

### Paso 1: Acceder al Panel de reCAPTCHA

1. Ve a: https://www.google.com/recaptcha/admin
2. Inicia sesión con tu cuenta de Google
3. Busca tu sitio "Trivia Challenge" (o el nombre que le hayas dado)
4. Haz clic en el ícono de **⚙️ Configuración** o en el nombre del sitio

### Paso 2: Agregar Dominios

En la sección **Dominios**, agrega los siguientes:

#### Para Desarrollo Local:

```
localhost
127.0.0.1
```

#### Para Producción:

```
triviachallenge.online
www.triviachallenge.online
app.triviachallenge.online
api.triviachallenge.online
```

### Paso 3: Guardar Cambios

1. Haz clic en **Guardar** en la parte inferior
2. Los cambios son inmediatos, no necesitas esperar

## 🔍 Verificar Dominios Registrados

### Opción A: Panel de reCAPTCHA

1. Ve a https://www.google.com/recaptcha/admin
2. Haz clic en tu sitio
3. En la sección "Dominios" verás la lista completa

### Opción B: Probar desde el Navegador

Abre la consola del navegador (F12) y ejecuta:

```javascript
// Si ves el widget de reCAPTCHA sin errores, el dominio está registrado
grecaptcha.ready(() => {
  console.log('reCAPTCHA cargado correctamente');
});
```

## 🐛 Solución de Problemas

### Error: "Invalid domain for site key"

**Causa:** El dominio actual no está registrado en reCAPTCHA

**Solución:**
1. Verifica que el dominio esté en la lista (incluyendo `localhost`)
2. Asegúrate de no tener `http://` o `https://` en la lista
3. Solo agrega el dominio: `localhost`, no `http://localhost:4200`

### Error: "localhost refused to connect"

**Causa:** Firewall o puerto bloqueado

**Solución:**
```bash
# Verifica que tu app frontend esté corriendo
ng serve --host 0.0.0.0 --port 4200

# O con Ionic
ionic serve --address=0.0.0.0 --port=4200
```

### reCAPTCHA no se muestra

**Causa:** Script no cargado o bloqueado

**Solución en HTML:**
```html
<!-- Agrega esto en index.html -->
<script src="https://www.google.com/recaptcha/api.js" async defer></script>
```

**Solución en Angular:**
```typescript
// Instalar dependencia
npm install ng-recaptcha

// En app.module.ts o standalone component
import { RecaptchaModule } from 'ng-recaptcha';
```

## 📝 Configuración Completa para localhost

### 1. Backend (.env)

```env
# Puerto del backend
PORT=3000

# reCAPTCHA
RECAPTCHA_SECRET_KEY=6LfyqyEsAAAAABR1JldspGbzCyCGAawQj0G69qlC

# CORS (permite localhost)
CORS_ORIGIN=http://localhost:4200
```

### 2. Frontend (environment.ts)

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api/v1',
  recaptcha: {
    siteKey: '6LfyqyEsAAAAAODH6-3MPyV2Q6nZsuBwnmxlaRlh'
  }
};
```

### 3. Frontend (login.component.ts)

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  template: `
    <form (ngSubmit)="onSubmit()">
      <ion-item>
        <ion-label position="floating">Email</ion-label>
        <ion-input [(ngModel)]="email" name="email" type="email"></ion-input>
      </ion-item>

      <ion-item>
        <ion-label position="floating">Password</ion-label>
        <ion-input [(ngModel)]="password" name="password" type="password"></ion-input>
      </ion-item>

      <!-- reCAPTCHA v2 -->
      <re-captcha
        (resolved)="onCaptchaResolved($event)"
        siteKey="6LfyqyEsAAAAAODH6-3MPyV2Q6nZsuBwnmxlaRlh">
      </re-captcha>

      <ion-button 
        expand="block" 
        type="submit" 
        [disabled]="!recaptchaToken">
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
    console.log('✅ reCAPTCHA resuelto:', token.substring(0, 20) + '...');
  }

  async onSubmit() {
    try {
      const response = await this.authService.login({
        email: this.email,
        password: this.password,
        recaptchaToken: this.recaptchaToken
      }).toPromise();

      console.log('✅ Login exitoso');
      this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error('❌ Error en login:', error);
    }
  }
}
```

## 🧪 Probar reCAPTCHA en localhost

### Prueba Manual

1. Inicia tu backend:
```bash
cd TriviasApi
npm run dev
```

2. Inicia tu frontend:
```bash
cd ../TriviasFrontend  # o donde esté tu frontend
ionic serve
```

3. Abre el navegador en: `http://localhost:4200`

4. Ve a la página de login/registro

5. Deberías ver el checkbox de reCAPTCHA

6. Márcalo y envía el formulario

### Prueba con Postman

```bash
POST http://localhost:3000/api/v1/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test123!",
  "recaptchaToken": "03AGdBq24..."
}
```

**Nota:** Para obtener un token válido, debes resolverlo desde el navegador primero.

### Modo Desarrollo (Sin reCAPTCHA)

Si quieres probar sin reCAPTCHA durante el desarrollo, cambia en `auth.route.ts`:

```typescript
// Cambiar de:
router.post("/login", verifyRecaptcha, loginValidator, loginController);

// A:
import { verifyRecaptchaOptional } from "@middlewares/recaptcha.middleware";
router.post("/login", verifyRecaptchaOptional, loginValidator, loginController);
```

## 📱 Configuración para App Móvil

### Android (Capacitor)

1. En Google reCAPTCHA Admin, agrega:
```
localhost
10.0.2.2  # Emulador de Android
```

2. En `capacitor.config.ts`:
```typescript
const config: CapacitorConfig = {
  appId: 'com.triviachallenge.app',
  appName: 'Trivia Challenge',
  webDir: 'www',
  server: {
    androidScheme: 'https',
    allowNavigation: ['localhost', '*.google.com', '*.googleapis.com']
  }
};
```

### iOS (Capacitor)

1. En Google reCAPTCHA Admin, agrega:
```
localhost
```

2. En `Info.plist`:
```xml
<key>NSAppTransportSecurity</key>
<dict>
  <key>NSAllowsArbitraryLoads</key>
  <true/>
</dict>
```

## 🌍 Configuración para Producción

### Dominios a Registrar

```
triviachallenge.online
www.triviachallenge.online
app.triviachallenge.online
api.triviachallenge.online
```

### Variables de Entorno (.env.production)

```env
NODE_ENV=production
CORS_ORIGIN=https://app.triviachallenge.online
RECAPTCHA_SECRET_KEY=6LfyqyEsAAAAABR1JldspGbzCyCGAawQj0G69qlC
```

### Frontend (environment.prod.ts)

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.triviachallenge.online/api/v1',
  recaptcha: {
    siteKey: '6LfyqyEsAAAAAODH6-3MPyV2Q6nZsuBwnmxlaRlh'
  }
};
```

## 🔒 Mejores Prácticas

### ✅ Hacer

- Agregar `localhost` para desarrollo
- Usar HTTPS en producción
- Validar reCAPTCHA en el backend
- Manejar errores gracefully
- Probar en diferentes dispositivos

### ❌ No Hacer

- Exponer la Secret Key en el frontend
- Permitir dominios no autorizados
- Saltear validación en producción
- Hardcodear tokens de prueba
- Ignorar errores de reCAPTCHA

## 📚 Recursos

- [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
- [Documentación de reCAPTCHA](https://developers.google.com/recaptcha)
- [ng-recaptcha para Angular](https://github.com/DethAriel/ng-recaptcha)

---

¡Tu reCAPTCHA está listo para funcionar en localhost y producción! 🎉
