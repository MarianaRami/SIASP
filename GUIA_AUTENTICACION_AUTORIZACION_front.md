# 📘 Guía de Autenticación y Autorización - SIASP

## 📋 Tabla de Contenidos

1. [Arquitectura General](#arquitectura-general)
2. [Flujo de Autenticación](#flujo-de-autenticación)
3. [Gestión de Sesión](#gestión-de-sesión)
4. [Interceptor de Credenciales](#interceptor-de-credenciales)
5. [Flujo de Autorización](#flujo-de-autorización)
6. [Implementación en Componentes](#implementación-en-componentes)
7. [Consideraciones de Seguridad](#consideraciones-de-seguridad)
8. [Diagramas de Flujo](#diagramas-de-flujo)

---

## 🏗️ Arquitectura General

El sistema SIASP implementa un modelo de autenticación basado en **cookies HTTP** con respaldo en **localStorage** para mantener la información del usuario. La arquitectura sigue el patrón de Angular con servicios centralizados e interceptores HTTP.

### Componentes Principales

```
┌─────────────────────────────────────────────────────────┐
│                    CAPA DE PRESENTACIÓN                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Login      │  │  Menu        │  │  Componentes │  │
│  │  Component   │  │  Superior    │  │  de Páginas  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                         ↓ ↓ ↓
┌─────────────────────────────────────────────────────────┐
│                    CAPA DE SERVICIOS                     │
│  ┌──────────────────────────────────────────────────┐   │
│  │            AuthService                           │   │
│  │  - login()      - getUser()                     │   │
│  │  - logout()     - setUser()                     │   │
│  │  - checkAuth()                                  │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │         AutorizacionesService                    │   │
│  │  - getPacienteByDocumento()                     │   │
│  │  - createAutorizacionNueva()                    │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                         ↓ ↓ ↓
┌─────────────────────────────────────────────────────────┐
│                  CAPA DE INTERCEPTORES                   │
│  ┌──────────────────────────────────────────────────┐   │
│  │        credentialsInterceptor                    │   │
│  │  - Añade withCredentials: true                  │   │
│  │  - Maneja errores 401                           │   │
│  │  - Registra todas las peticiones HTTP           │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                         ↓ ↓ ↓
┌─────────────────────────────────────────────────────────┐
│                    BACKEND (API REST)                    │
│              http://localhost:3000                       │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Endpoints:                                      │   │
│  │  POST /auth/login                               │   │
│  │  POST /auth/logout                              │   │
│  │  GET  /auth/check                               │   │
│  │  GET  /gestion-pacientes/autorizaciones/...    │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## 🔐 Flujo de Autenticación

### 1. Proceso de Login

El flujo de autenticación comienza cuando el usuario accede a la aplicación y se presenta con el componente de login.

#### Componente: `LoginComponent`
**Ubicación:** `src/app/pages/login/login.component.ts`

```typescript
onLogin() {
  this.authService.login(this.username).subscribe({
    next: (res) => {
      this.loginResponse = res;
      this.loginError = false;
      this.authService.setUser(this.username); // Guarda el usuario en localStorage
      this.router.navigate(['admin-sistema']); // Redirección al módulo principal
    },
    error: (err) => {
      console.error('Error en login:', err);
      this.loginError = true;
    }
  });
}
```

#### Servicio: `AuthService.login()`
**Ubicación:** `src/app/services/auth.service.ts`

```typescript
login(nombreUsuario: string): Observable<any> {
  const body = { nombreUsuario };
  
  return this.http.post(`${this.baseUrl}/auth/login`, body, {
    withCredentials: true  // ⭐ CRÍTICO: Permite enviar/recibir cookies
  }).pipe(
    tap(response => {
      console.log('✅ Login exitoso, cookie debería estar guardada');
      if (this.user) {
        this.setUser(this.user);
      }
    })
  );
}
```

### 2. Secuencia del Login

```
1. Usuario ingresa credenciales
   ↓
2. LoginComponent.onLogin() se ejecuta
   ↓
3. AuthService.login(username) envía POST a /auth/login
   ↓
4. Backend valida credenciales
   ↓
5. Backend establece cookie HttpOnly con JWT
   ↓
6. Frontend recibe respuesta exitosa
   ↓
7. AuthService.setUser() guarda usuario en localStorage
   ↓
8. Router navega a página principal
   ↓
9. Cookie se envía automáticamente en requests subsecuentes
```

### 3. Verificación de Autenticación

```typescript
checkAuth(): Observable<any> {
  return this.http.get(`${this.baseUrl}/auth/check`, {
    withCredentials: true
  });
}
```

Este método permite verificar si la sesión del usuario sigue siendo válida consultando al backend.

---

## 💾 Gestión de Sesión

El sistema utiliza un **modelo dual** de almacenamiento de sesión:

### 1. Cookies HTTP (Primario)
- **Tipo:** HttpOnly cookie
- **Contenido:** JWT (JSON Web Token)
- **Establecida por:** Backend
- **Propósito:** Autenticación real en cada petición HTTP
- **Seguridad:** No accesible desde JavaScript (protección contra XSS)

### 2. LocalStorage (Secundario)
- **Clave:** `jwtUser`
- **Contenido:** Nombre de usuario
- **Establecido por:** Frontend (AuthService)
- **Propósito:** Mantener información de usuario en la UI y persistencia entre recargas

### Métodos de Gestión

```typescript
// Guardar usuario
setUser(user: string) {
  this.user = user;
  localStorage.setItem('jwtUser', user);
}

// Obtener usuario
getUser(): string | null {
  if (!this.user) {
    this.user = localStorage.getItem('jwtUser');
  }
  return this.user;
}

// Limpiar sesión (logout)
logout(): Observable<any> {
  return this.http.post(`${this.baseUrl}/auth/logout`, {}, {
    withCredentials: true
  }).pipe(
    tap(() => {
      this.user = null;
      localStorage.removeItem('jwtUser');
      console.log('✅ Logout exitoso, cookie debería estar limpiada');
    })
  );
}
```

### Flujo de Recuperación de Sesión

```
1. Usuario recarga la página
   ↓
2. AuthService.getUser() busca en localStorage
   ↓
3. Si existe 'jwtUser', se restablece this.user
   ↓
4. Cookie HTTP sigue presente en el navegador
   ↓
5. Próxima petición HTTP incluye cookie automáticamente
   ↓
6. Backend valida JWT de la cookie
   ↓
7. Sesión se mantiene activa
```

---

## 🔄 Interceptor de Credenciales

El **credentialsInterceptor** es fundamental para el sistema de autenticación. Se ejecuta en **TODAS** las peticiones HTTP realizadas por la aplicación.

### Configuración Global
**Ubicación:** `src/app/app.config.ts`

```typescript
import { credentialsInterceptor } from './interceptors/credentials.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([credentialsInterceptor])  // ⭐ Registro del interceptor
    )
  ],
};
```

### Implementación del Interceptor
**Ubicación:** `src/app/interceptors/credentials.interceptor.ts`

```typescript
export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  // Clonar la petición añadiendo withCredentials
  const clonedRequest = req.clone({
    withCredentials: true  // ⭐ Incluye cookies en todas las peticiones
  });
  
  console.log('🔍 Petición con credenciales:', {
    url: clonedRequest.url,
    withCredentials: clonedRequest.withCredentials,
    method: clonedRequest.method
  });
  
  return next(clonedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.error('❌ Error 401 - No autorizado');
        // Aquí podrías redirigir al login
      }
      return throwError(() => error);
    })
  );
};
```

### Funciones del Interceptor

1. **Añadir Credenciales:** Agrega `withCredentials: true` a todas las peticiones
2. **Logging:** Registra información detallada de cada petición
3. **Manejo de Errores 401:** Intercepta errores de autenticación
4. **Consistencia:** Garantiza que todas las cookies se envíen siempre

### ¿Por qué es importante `withCredentials: true`?

```
Sin withCredentials:
┌─────────┐                      ┌─────────┐
│ Browser │ ─── GET /api ────→   │ Backend │
│         │ (sin cookies)         │         │
│         │ ←── 401 ────────      │         │
└─────────┘                      └─────────┘

Con withCredentials:
┌─────────┐                      ┌─────────┐
│ Browser │ ─── GET /api ────→   │ Backend │
│         │ + Cookie: jwt=xxx    │         │
│         │ ←── 200 + Data ──    │         │
└─────────┘                      └─────────┘
```

---

## 🛡️ Flujo de Autorización

La autorización en SIASP se refiere a permitir a usuarios autenticados realizar acciones específicas sobre recursos del sistema, principalmente gestión de pacientes, medicamentos y ciclos de tratamiento.

### 1. Servicio de Autorizaciones

**Ubicación:** `src/app/services/autorizaciones.service.ts`

```typescript
@Injectable({
  providedIn: 'root'
})
export class AutorizacionesService {
  private apiUrl = 'http://localhost:3000/gestion-pacientes';

  // Obtener datos del paciente para autorización
  getPacienteByDocumento(pacienteId: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/autorizaciones/datos/${pacienteId}`
    );
  }

  // Crear nueva autorización de ciclo
  createAutorizacionNueva(dto: any) {
    return this.http.post<any>(
      `${this.apiUrl}/autorizar-ciclo`,
      dto
    );
  }
}
```

### 2. Flujo de Autorización de Ciclo

Este es uno de los flujos más importantes del sistema:

```
1. Usuario autenticado navega a Autorizaciones
   ↓
2. Busca paciente por documento
   ↓
3. Sistema consulta getPacienteByDocumento(documento)
   ↓
4. Backend verifica JWT de la cookie
   ↓
5. Retorna datos del paciente + medicamentos + laboratorios
   ↓
6. Usuario completa formulario de autorización
   ↓
7. Sistema captura idUsuario = AuthService.getUser()
   ↓
8. Se envía DTO con todos los datos + idUsuario
   ↓
9. Backend valida permisos y registra autorización
   ↓
10. Sistema confirma operación exitosa
```

### 3. Ejemplo Real: AutorizacionComponent

**Ubicación:** `src/app/views/autorizaciones/autorizacion/autorizacion.component.ts`

```typescript
ngOnInit() {
  this.cargaDatos()
}

cargaDatos() {
  this.identificacion = this.route.snapshot.paramMap.get('cedula') || '';

  this.autorizacionesService.getPacienteByDocumento(this.identificacion)
    .subscribe({
      next: (resp) => {
        // Asignar datos del paciente
        this.pacienteData = resp.paciente;
        this.idCicloPaciente = resp.idCicloPaciente;
        this.paciente = `${resp.paciente.nombre1} ...`;
        
        // ⭐ IMPORTANTE: Capturar usuario autenticado
        this.idUsuario = this.AuthService.getUser() || '';
        
        // Cargar medicamentos para autorización
        this.datos = resp.medicamentos || [];
        
        // Cargar laboratorios
        this.laboratoriosAut = resp.laboratorios.map(...);
      },
      error: (err) => {
        console.error('Error al cargar datos:', err);
      }
    });
}
```

### 4. Integración Usuario en Operaciones

El usuario autenticado se incluye en todas las operaciones críticas:

```typescript
// Ejemplo: Guardar aplicación de medicamento
const payloadAplicacion = {
  IdCicloMedicamento: this.selectedMed.id,
  Fecha: fechaFormatoISO,
  IdUsuario: this.AuthService.getUser(),  // ⭐ Usuario autenticado
  idPaciente: Number(this.selectedMed.idPaciente),
  motivo: this.popUpData.motivo || null,
  observaciones: this.popUpData.observaciones || null
};
```

---

## 💻 Implementación en Componentes

### 1. Patrón de Uso del AuthService

Todos los componentes que necesitan identificar al usuario siguen este patrón:

```typescript
import { AuthService } from '../../services/auth.service';

export class MiComponente {
  constructor(private authService: AuthService) {}

  realizarAccion() {
    const usuario = this.authService.getUser();
    
    if (!usuario) {
      console.error('Usuario no autenticado');
      this.router.navigate(['/']);
      return;
    }
    
    // Proceder con la operación incluyendo el usuario
    this.miServicio.operacion(datos, usuario).subscribe(...);
  }
}
```

### 2. MenuSuperiorComponent

Muestra información del usuario y gestiona el logout:

```typescript
export class MenuSuperiorComponent implements OnInit {
  user: string | null = '';

  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.authService.getUser();  // Muestra nombre de usuario
  }

  logout(event: MouseEvent) {
    event.stopPropagation();
    this.router.navigate(['/']);  // Redirige al login
    this.showLogoutMenu = false;
  }
}
```

**Nota:** Actualmente el logout NO llama a `authService.logout()`, solo redirige. Esto podría mejorarse.

### 3. Componentes que Usan Autenticación

El sistema tiene múltiples componentes que dependen del usuario autenticado:

#### QF (Químico Farmacéutico)
- `paciente.component.ts` - Registro de observaciones de pacientes
- `configuracion-ciclo.component.ts` - Configuración de ciclos de tratamiento
- `configuracion-aplicaciones.component.ts` - Registro de aplicaciones de medicamentos

#### Programación
- `historial.component.ts` - Modificación de programaciones
- `confirmacion.component.ts` - Confirmación de citas

#### Autorizaciones
- `autorizacion.component.ts` - Autorización de ciclos de quimioterapia

#### Administración
- `conf-medicamentos.component.ts` - Configuración de medicamentos
- `inf-medicamentos.component.ts` - Información de medicamentos

#### Enfermería
- `enfermeria.component.ts` - Registro de actividades de enfermería
- `jefe-enfermeria.component.ts` - Gestión de personal

#### Exámenes
- `examenes.component.ts` - Registro de resultados de exámenes

---

## 🔒 Consideraciones de Seguridad

### ✅ Aspectos Implementados Correctamente

1. **Cookies HttpOnly**
   - No son accesibles desde JavaScript
   - Protección contra ataques XSS
   - Enviadas automáticamente con cada petición

2. **withCredentials en todas las peticiones**
   - Garantiza que las cookies se envíen siempre
   - Implementado via interceptor global

3. **Separación de responsabilidades**
   - Cookie (backend) para autenticación
   - localStorage (frontend) solo para UI

4. **Logging y debugging**
   - Trazabilidad de todas las peticiones
   - Identificación rápida de problemas de autenticación

### ⚠️ Áreas de Mejora Recomendadas

#### 1. **Guards de Ruta**

Actualmente **NO existen guards** en las rutas. Cualquier usuario puede acceder a cualquier ruta escribiendo la URL.

**Recomendación:** Implementar AuthGuard

```typescript
// src/app/guards/auth.guard.ts
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.checkAuth().pipe(
    map(response => {
      if (response.authenticated) {
        return true;
      } else {
        router.navigate(['/']);
        return false;
      }
    })
  );
};
```

**Aplicar en rutas:**

```typescript
export const routes: Routes = [
  { path: '', component: LoginComponent },
  { 
    path: 'admin-sistema', 
    component: AdministradorSistemaComponent,
    canActivate: [authGuard]  // ⭐ Protegida
  },
  // ... resto de rutas con authGuard
];
```

#### 2. **Logout Completo**

El método logout actual solo redirige, no invalida la sesión:

```typescript
// ACTUAL (incompleto)
logout(event: MouseEvent) {
  this.router.navigate(['/']);
}

// RECOMENDADO
logout(event: MouseEvent) {
  event.stopPropagation();
  
  this.authService.logout().subscribe({
    next: () => {
      this.router.navigate(['/']);
    },
    error: (err) => {
      console.error('Error en logout:', err);
      // Redirigir de todos modos
      this.router.navigate(['/']);
    }
  });
}
```

#### 3. **Manejo de Sesión Expirada**

Cuando el backend retorna 401, debería redirigir automáticamente al login:

```typescript
// En credentials.interceptor.ts
catchError((error: HttpErrorResponse) => {
  if (error.status === 401) {
    console.error('❌ Sesión expirada o no autorizado');
    
    // Limpiar estado local
    localStorage.removeItem('jwtUser');
    
    // Redirigir al login
    const router = inject(Router);
    router.navigate(['/']);
  }
  return throwError(() => error);
})
```

#### 4. **Validación de Usuario en Operaciones Críticas**

```typescript
// Siempre validar antes de operaciones críticas
const usuario = this.authService.getUser();

if (!usuario) {
  alert('Sesión expirada. Por favor inicie sesión nuevamente.');
  this.router.navigate(['/']);
  return;
}
```

#### 5. **CORS Configuration**

Asegurar que el backend tenga configurado CORS correctamente:

```javascript
// Backend (Node.js/Express ejemplo)
app.use(cors({
  origin: 'http://localhost:4200',  // URL del frontend
  credentials: true,                // ⭐ CRÍTICO para cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

#### 6. **Refresh Token**

Implementar refresh tokens para renovar sesiones sin requerir nuevo login:

```typescript
refreshToken(): Observable<any> {
  return this.http.post(`${this.baseUrl}/auth/refresh`, {}, {
    withCredentials: true
  });
}
```

#### 7. **Role-Based Access Control (RBAC)**

El sistema tiene diferentes roles (QF, Enfermería, Admin, etc.) pero no hay control de acceso implementado:

```typescript
// src/app/guards/role.guard.ts
export const roleGuard = (allowedRoles: string[]) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const userRole = authService.getUserRole();
  
  if (allowedRoles.includes(userRole)) {
    return true;
  } else {
    router.navigate(['/unauthorized']);
    return false;
  }
};
```

**Aplicar en rutas:**

```typescript
{
  path: 'admin-sistema',
  component: AdministradorSistemaComponent,
  canActivate: [authGuard, roleGuard(['admin'])]
}
```

---

## 📊 Diagramas de Flujo

### Flujo Completo de Autenticación

```
┌─────────────────────────────────────────────────────────────────┐
│                    INICIO: Usuario sin autenticar                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    ┌─────────────────┐
                    │ Página de Login │
                    │  - username     │
                    │  - password     │
                    └─────────────────┘
                              ↓
                    [Usuario hace clic en "Acceder"]
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ LoginComponent.onLogin()                                         │
│   authService.login(username)                                    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ AuthService.login()                                              │
│   POST http://localhost:3000/auth/login                         │
│   Body: { nombreUsuario: "xxx" }                               │
│   Options: { withCredentials: true }                           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ credentialsInterceptor                                           │
│   - Clona request con withCredentials: true                     │
│   - Registra petición en consola                                │
│   - Envía al backend                                            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
        ┌─────────────────────────────────────────┐
        │         BACKEND VALIDA CREDENCIALES      │
        └─────────────────────────────────────────┘
                ↓                        ↓
         [Válidas]                  [Inválidas]
                ↓                        ↓
    ┌──────────────────┐       ┌────────────────┐
    │ Genera JWT       │       │ Retorna 401    │
    │ Set-Cookie: jwt  │       │ Unauthorized   │
    │ Retorna 200      │       └────────────────┘
    └──────────────────┘                ↓
                ↓                        ↓
   [Cookie guardada por navegador] [Error en frontend]
                ↓                        ↓
┌─────────────────────────────────────────────────────────────────┐
│ AuthService.login() - callback success                           │
│   - authService.setUser(username)                               │
│   - localStorage.setItem('jwtUser', username)                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    ┌─────────────────┐
                    │ router.navigate │
                    │ ['admin-sistema']│
                    └─────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    USUARIO AUTENTICADO                           │
│  - Cookie HttpOnly con JWT presente en navegador                │
│  - localStorage contiene nombre de usuario                      │
│  - Todas las peticiones HTTP incluyen cookie automáticamente    │
└─────────────────────────────────────────────────────────────────┘
```

### Flujo de Petición HTTP Autenticada

```
┌─────────────────────────────────────────────────────────────────┐
│ Componente ejecuta operación                                     │
│   Ej: autorizacionesService.getPacienteByDocumento(id)          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ HttpClient crea petición GET                                     │
│   URL: http://localhost:3000/gestion-pacientes/autorizaciones/  │
│         datos/12345678                                          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ credentialsInterceptor intercepta                                │
│   - request = req.clone({ withCredentials: true })              │
│   - console.log('🔍 Petición con credenciales')                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Navegador añade Cookie Header automáticamente                   │
│   Cookie: jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
        ┌─────────────────────────────────────────┐
        │    BACKEND RECIBE Y PROCESA PETICIÓN     │
        │  1. Extrae JWT de Cookie                 │
        │  2. Verifica firma del token             │
        │  3. Valida expiración                    │
        │  4. Extrae información de usuario        │
        └─────────────────────────────────────────┘
                ↓                        ↓
         [JWT válido]              [JWT inválido]
                ↓                        ↓
    ┌──────────────────┐       ┌────────────────┐
    │ Procesa petición │       │ Retorna 401    │
    │ Consulta BD      │       │ Unauthorized   │
    │ Retorna 200 + data│      └────────────────┘
    └──────────────────┘                ↓
                ↓                        ↓
   [Respuesta exitosa]    [credentialsInterceptor.catchError]
                ↓                        ↓
┌─────────────────────────────────────────────────────────────────┐
│ Componente recibe respuesta en subscribe({next: ...})           │
│   - Procesa datos                                               │
│   - Actualiza UI                                                │
└─────────────────────────────────────────────────────────────────┘
```

### Flujo de Autorización de Ciclo

```
┌─────────────────────────────────────────────────────────────────┐
│ Usuario autenticado navega a:                                    │
│   /autorizaciones/busquedaAU/Autorizacion/:cedula               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ AutorizacionComponent.ngOnInit()                                │
│   - Obtiene cédula de la ruta                                   │
│   - Llama a cargaDatos()                                        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ autorizacionesService.getPacienteByDocumento(cedula)            │
│   GET /gestion-pacientes/autorizaciones/datos/:cedula          │
│   [Cookie JWT incluida automáticamente por interceptor]        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Backend retorna:                                                 │
│   {                                                             │
│     paciente: {...},                                            │
│     idCicloPaciente: "...",                                     │
│     nombreProtocolo: "...",                                     │
│     medicamentos: [...],                                        │
│     laboratorios: [...],                                        │
│     procedimientos: [...]                                       │
│   }                                                             │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Component procesa respuesta:                                     │
│   - this.pacienteData = resp.paciente                           │
│   - this.idCicloPaciente = resp.idCicloPaciente                 │
│   - this.idUsuario = this.AuthService.getUser() ⭐              │
│   - this.datos = resp.medicamentos                              │
│   - this.laboratoriosAut = resp.laboratorios                    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Usuario completa formulario de autorización:                    │
│   - Números de autorización de medicamentos                     │
│   - Fechas de autorización y vencimiento                        │
│   - Laboratorios autorizados                                    │
│   - Procedimientos autorizados                                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    [Usuario hace clic en "Guardar"]
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Component construye DTO:                                         │
│   {                                                             │
│     idCicloPaciente: this.idCicloPaciente,                      │
│     idUsuario: this.idUsuario,  ⭐ Usuario autenticado          │
│     medicamentos: [...],                                        │
│     laboratorios: [...],                                        │
│     procedimientos: [...]                                       │
│   }                                                             │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ autorizacionesService.createAutorizacionNueva(dto)              │
│   POST /gestion-pacientes/autorizar-ciclo                      │
│   Body: {...DTO...}                                             │
│   [Cookie JWT incluida automáticamente]                        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Backend:                                                         │
│   1. Verifica JWT (autenticación)                               │
│   2. Valida permisos del usuario (autorización)                 │
│   3. Valida datos del DTO                                       │
│   4. Registra autorización en BD                                │
│   5. Asocia con idUsuario para auditoría                        │
│   6. Retorna confirmación                                       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Frontend muestra confirmación:                                   │
│   "Autorización registrada exitosamente"                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Resumen Ejecutivo

### ¿Cómo funciona la autenticación?

1. **Login:** Usuario ingresa credenciales → Backend valida → Establece cookie HttpOnly con JWT → Guarda nombre de usuario en localStorage
2. **Sesión:** Cookie se envía automáticamente en cada petición HTTP gracias al interceptor
3. **Validación:** Backend verifica JWT en cada petición para autenticar al usuario
4. **Persistencia:** localStorage mantiene nombre de usuario entre recargas de página

### ¿Cómo funciona la autorización?

1. **Identificación:** Cada operación captura usuario con `AuthService.getUser()`
2. **Inclusión:** El `idUsuario` se incluye en todas las operaciones críticas
3. **Validación Backend:** El servidor valida permisos antes de ejecutar operaciones
4. **Auditoría:** El usuario queda registrado en cada acción para trazabilidad

### Elementos Clave

- **Cookie HttpOnly:** Seguridad real de autenticación
- **localStorage:** Conveniencia de UI y persistencia
- **Interceptor:** Consistencia en todas las peticiones HTTP
- **withCredentials: true:** Elemento crítico que permite el envío de cookies

### Estado Actual vs. Ideal

| Aspecto | Estado Actual | Recomendación |
|---------|--------------|---------------|
| Autenticación con JWT | ✅ Implementado | Mantener |
| Cookies HttpOnly | ✅ Implementado | Mantener |
| Interceptor global | ✅ Implementado | Mantener |
| Guards de ruta | ❌ No implementado | **Implementar urgente** |
| Logout completo | ⚠️ Incompleto | Mejorar |
| Manejo de 401 | ⚠️ Básico | Mejorar |
| RBAC | ❌ No implementado | Implementar |
| Refresh tokens | ❌ No implementado | Considerar |

---

## 📚 Referencias de Código

### Archivos Principales

```
src/
├── app/
│   ├── services/
│   │   ├── auth.service.ts                    # Servicio de autenticación
│   │   └── autorizaciones.service.ts          # Servicio de autorizaciones
│   ├── interceptors/
│   │   └── credentials.interceptor.ts         # Interceptor HTTP global
│   ├── pages/
│   │   └── login/
│   │       ├── login.component.ts             # Componente de login
│   │       └── login.component.html
│   ├── components/
│   │   └── menu-superior/
│   │       ├── menu-superior.component.ts     # Muestra usuario y logout
│   │       └── menu-superior.component.html
│   ├── app.config.ts                          # Configuración global
│   └── app.routes.ts                          # Definición de rutas
```

### Endpoints del Backend

```
Base URL: http://localhost:3000

Autenticación:
  POST   /auth/login         - Iniciar sesión
  POST   /auth/logout        - Cerrar sesión
  GET    /auth/check         - Verificar sesión

Gestión de Pacientes:
  GET    /gestion-pacientes/autorizaciones/datos/:id
  POST   /gestion-pacientes/autorizar-ciclo
  (... más endpoints según el módulo)
```

---

## 🔧 Troubleshooting

### Problema: Error 401 en todas las peticiones

**Causa:** Cookie no se está enviando

**Solución:**
1. Verificar que `withCredentials: true` esté configurado
2. Verificar que el interceptor esté registrado en `app.config.ts`
3. Verificar configuración CORS en backend
4. Verificar que backend acepte `credentials: true`

### Problema: Usuario null después de recargar página

**Causa:** localStorage no se está leyendo correctamente

**Solución:**
```typescript
ngOnInit() {
  const usuario = this.authService.getUser();  // Esto lee de localStorage
  if (!usuario) {
    this.router.navigate(['/']);
  }
}
```

### Problema: Sesión no persiste entre pestañas

**Causa:** Es el comportamiento esperado con cookies de sesión

**Solución:** Configurar cookie con expiración más larga en el backend

### Problema: No se puede acceder a páginas protegidas

**Causa:** No hay guards implementados

**Solución:** Implementar AuthGuard según la sección de Mejoras Recomendadas

---

## 📝 Conclusiones

El sistema SIASP implementa un modelo de autenticación **robusto y seguro** basado en cookies HttpOnly con JWT, complementado con localStorage para mejorar la experiencia de usuario. El uso del interceptor global garantiza consistencia en todas las peticiones HTTP.

Sin embargo, existen **oportunidades de mejora críticas**, especialmente la implementación de guards de ruta y un manejo más completo del logout y sesiones expiradas. La incorporación de estas mejoras elevaría significativamente la seguridad y robustez del sistema.

El flujo de autorización está bien estructurado, con trazabilidad completa de las acciones realizadas por cada usuario mediante la inclusión del `idUsuario` en todas las operaciones críticas.

---

**Documento generado el:** 14 de febrero de 2026  
**Versión del proyecto:** SIASP Frontend  
**Autor de la documentación:** GitHub Copilot  
