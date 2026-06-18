# InterviewKit

> Simula entrevistas técnicas con IA. Elige tu stack, responde preguntas y repasa con cards personalizadas.

[![Python](https://img.shields.io/badge/Python-3.12+-3776AB?style=flat&logo=python&logoColor=white)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-3-000000?style=flat&logo=flask&logoColor=white)](https://flask.palletsprojects.com)
[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=white)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat&logo=postgresql&logoColor=white)](https://postgresql.org)

---

## Descripción

**InterviewKit** es una plataforma para que desarrolladores practiquen entrevistas técnicas. Seleccionas tu rol (Frontend/Backend), la tecnología y el nivel, y la IA genera 5 preguntas personalizadas. Recibes feedback instantáneo y cada pregunta se guarda como una card Q&A para repasar.

---

## Funcionalidades

- **Login con Google y GitHub** — OAuth 2.0 con vinculación automática por email
- **Registro con email/password** — bcrypt + JWT en httpOnly cookies
- **Entrevistas con IA** — Generación de preguntas vía Groq API adaptadas a rol, stack y nivel
- **Feedback instantáneo** — Evaluación de cada respuesta con explicación detallada
- **Cards Q&A** — Cada pregunta se guarda con respuesta explicada para repaso
- **Dashboard** — Busca, filtra y edita tus cards guardadas
- **Sistema de XP y niveles** — Gana XP con cada sesión, sube de nivel, trackea tu progreso
- **Estadísticas** — Gráficos de resultados, sesiones recientes, tags más practicados
- **Landing page dark theme** — Diseño oscuro/tecnológico con animaciones

---

## Stack

| Capa | Tecnología |
| --- | --- |
| Frontend | Next.js 15 + React 19 |
| Routing | Next.js App Router |
| Estilos | Tailwind CSS v4 + Shadcn/ui |
| Animaciones | Framer Motion |
| Backend | Flask 3 (Python) |
| ORM | SQLAlchemy + Flask-Migrate (Alembic) |
| Auth | JWT + bcrypt + OAuth 2.0 (Google, GitHub) |
| OAuth | Authlib |
| Estado global | React Context (AuthContext) |
| IA | Groq API |
| Base de datos | PostgreSQL 16 |
| Deploy frontend | Vercel |
| Deploy backend | Fly.io |

---

## Auth y OAuth

La autenticación soporta dos flujos:

1. **Email/password** — Registro e inicio de sesión clásico con bcrypt + JWT en httpOnly cookies.
2. **OAuth (Google, GitHub)** — Login social con `Authlib`. Si el email ya existe, se vincula automáticamente a la cuenta existente.

Flujo OAuth:

```
Frontend (botón) → GET /auth/google → Redirect a Google
→ Usuario autoriza → Callback en Backend
→ Buscar/crear usuario → Set JWT cookie → Redirect al Frontend /auth/callback
→ Frontend: GET /me/profile → populate AuthContext
```

Modelo de datos:

- `User` — `user_id`, `name`, `email`, `password` (nullable para OAuth-only), `total_xp`, `level`
- `OAuthAccount` — `id`, `user_id` (FK), `provider` (google/github), `provider_user_id`

---

## Rutas Protegidas

El grupo `(protected)` envuelve las páginas que requieren autenticación (`dashboard`, `session`, `stats`, `profile`). Las rutas públicas (`/`, `/login`, `/register`, `/auth/callback`) permanecen abiertas.

`AuthContext` verifica la sesión al montar la app (`GET /me/stats`) y redirige a `/` si no hay usuario.

---

## Prerrequisitos

- [Node.js](https://nodejs.org/) v18+
- [Python](https://www.python.org/) 3.12+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Git

---

## Setup inicial

### 1. Clonar el repositorio

```bash
git clone https://github.com/albertsp/interview-prep-app.git
cd interview-prep-app
```

### 2. Backend

```bash
cd backend

# Crear y activar entorno virtual
python -m venv venv

# Mac/Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
# Edita .env con tus valores (GROQ_API_KEY, JWT_SECRET_KEY, etc.)
```

### 3. Base de datos (Docker)

```bash
docker compose up -d
```

### 4. Migraciones

```bash
# Desde /backend con el venv activado
flask db upgrade
```

### 5. Frontend

```bash
cd ../frontend
npm install

# Configurar variables de entorno
cp .env.example .env
# Edita .env con NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## Desarrollo local

### Arrancar la base de datos

```bash
docker compose up -d
```

### Arrancar el backend

```bash
cd backend
# Mac/Linux: source venv/bin/activate
# Windows: venv\Scripts\activate
flask run
```

> Disponible en `http://localhost:5000`

### Arrancar el frontend

```bash
cd frontend
npm run dev
```

> Disponible en `http://localhost:3000`

### Parar la base de datos

```bash
docker compose down
```

---

## Estructura del proyecto

```
interview-prep-app/
├── backend/
│   ├── app/
│   │   ├── models/          # User, Session, Question, Card, OAuthAccount
│   │   ├── routes/          # auth, oauth, sessions, cards, user, stacks, debug
│   │   ├── services/        # Lógica de negocio e integración con Groq
│   │   ├── constants/       # Configuración de gamificación
│   │   ├── __init__.py      # Fábrica de la app Flask + OAuth init
│   │   └── config.py        # Configuración desde variables de entorno
│   ├── migrations/          # Migraciones Alembic
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── fly.toml
│   └── run.py
├── frontend/
│   ├── app/
│   │   ├── (app)/
│   │   │   ├── page.jsx          # Landing page
│   │   │   ├── login/            # Login con OAuth + email
│   │   │   ├── register/         # Registro con OAuth + email
│   │   │   ├── auth/callback/    # OAuth callback handler
│   │   │   └── (protected)/
│   │   │       ├── dashboard/    # Cards del usuario
│   │   │       ├── session/      # Simulador de entrevista
│   │   │       ├── stats/        # Estadísticas y gráficos
│   │   │       └── profile/     # Perfil y XP
│   │   └── layout.js
│   ├── src/
│   │   ├── components/       # Navbar, Footer, OAuthButtons, StackSelector
│   │   ├── components/home/  # Hero, Features, HowItWorks, Techs, FAQ, CTA
│   │   ├── components/ui/   # Shadcn/ui (Button, Card, Input, Dialog, etc.)
│   │   ├── context/          # AuthContext — gestión global de sesión
│   │   ├── data/             # Datos estáticos
│   │   ├── lib/              # Utilidades (cn)
│   │   └── services/         # Llamadas a la API
│   ├── public/
│   └── package.json
├── docker-compose.yml
└── README.md
```

---

## Variables de entorno

### Backend (`backend/.env`)

```
GROQ_API_KEY=
JWT_SECRET_KEY=
DATABASE_URL=postgresql://admin:admin@localhost:5432/interview_prep
FLASK_ENV=development

# OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

CORS_ORIGINS=http://localhost:3000
FRONTEND_URL=http://localhost:3000
```

### Frontend (`frontend/.env`)

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## Scripts útiles

| Comando | Descripción |
| --- | --- |
| `docker compose up -d` | Iniciar PostgreSQL |
| `docker compose down` | Detener PostgreSQL |
| `cd backend && flask run` | Iniciar backend (puerto 5000) |
| `cd frontend && npm run dev` | Iniciar frontend (puerto 3000) |
| `cd frontend && npm run build` | Build de producción |
| `cd frontend && npm run lint` | Lint con ESLint |
| `cd backend && flask db migrate` | Crear migración Alembic |
| `cd backend && flask db upgrade` | Aplicar migraciones |

---

## Deploy

### Backend (Fly.io)

```bash
cd backend
fly deploy
```

Las migraciones se ejecutan automáticamente (`release_command` en `fly.toml`).

Las variables de entorno sensibles (OAuth secrets, JWT key, etc.) se configuran con:

```bash
fly secrets set GOOGLE_CLIENT_ID=... GOOGLE_CLIENT_SECRET=...
```

### Frontend (Vercel)

Push a `main` despliega automáticamente. Las variables de entorno se configuran en el dashboard de Vercel.

---

## Workflow Git

### Ramas

```
main        → producción, siempre deployable
dev         → integración, aquí se mergean las features
feature/xxx → trabajo individual
fix/xxx     → corrección de bugs
```

### Convención de commits

```
feat:     nueva funcionalidad
fix:      corrección de bug
chore:    tareas de mantenimiento o configuración
refactor: cambio sin nueva funcionalidad
docs:     documentación
```