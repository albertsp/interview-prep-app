# Interview Prep App

> Aplicación interactiva para reforzar el estudio de entrevistas técnicas de desarrollo web.

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat&logo=python&logoColor=white)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-3-000000?style=flat&logo=flask&logoColor=white)](https://flask.palletsprojects.com)
[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=white)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat&logo=postgresql&logoColor=white)](https://postgresql.org)

---

## Descripción

**Interview Prep App** es una plataforma interactiva para que desarrolladores web practiquen entrevistas técnicas. Permite seleccionar tu rol (*Frontend* / *Backend*), tecnologías y nivel de dificultad, y genera preguntas personalizadas vía IA para simular entrevistas reales.

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
| Auth | JWT + bcrypt |
| Estado global | React Context (AuthContext) |
| IA | Groq API |
| Base de datos (dev) | PostgreSQL 16 (Docker) |
| Base de datos (prod) | PostgreSQL (Fly.io) |
| Deploy | Vercel |

---

## Funcionalidades y Arquitectura

### Sistema de Autenticación

La autenticación se implementa mediante **JWT** con `Flask-JWT-Extended` en el backend. El frontend gestiona el estado de sesión globalmente a través de `AuthContext` (`frontend/src/context/AuthContext.jsx`), permitiendo registro, inicio de sesión y protección de rutas de forma centralizada.

### Rutas Protegidas

El grupo de rutas `(protected)` dentro del **App Router** de Next.js envuelve las páginas de `dashboard` y `session`, asegurando que solo usuarios autenticados puedan acceder a ellas. Las rutas públicas (`login`, `register`, `home`) permanecen en el grupo `(app)`.

### Simulador de Entrevistas

La página `/session` permite al usuario configurar una entrevista técnica seleccionando rol, stack tecnológico y nivel de dificultad. Las preguntas se generan en tiempo real mediante la **Groq API**, ofreciendo una experiencia personalizada y realista.

### UI System

El sistema de interfaz está construido sobre **Shadcn/ui** con **Radix UI** como base de accesibilidad, estilizado con **Tailwind CSS v4** e iconos de **Lucide React**. Las animaciones y transiciones se manejan con **Framer Motion** para micro-interacciones fluidas.

---

## Capturas

> ![App screenshot](docs/screenshot.png)
> *Próximamente — captura de la aplicación en funcionamiento.*

---

## Prerrequisitos

Instalar antes de empezar. Solo se hace una vez.

- [Node.js](https://nodejs.org/) v18+
- [Python](https://www.python.org/) 3.11+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Git

---

## Setup inicial

Pasos para tener el proyecto corriendo por primera vez.

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
# Edita .env con tus valores
```

### 3. Base de datos (Docker)

```bash
docker compose up -d
```

### 4. Migraciones

```bash
# Desde /backend con el venv activado
flask db migrate
flask db upgrade
```

### 5. Frontend

```bash
cd ../frontend
npm install

# Configurar variables de entorno
cp .env.example .env
# Edita .env con tus valores
```

---

## Desarrollo local

Comandos del día a día una vez tienes el setup hecho.

### Arrancar la base de datos

```bash
docker compose up -d
```

### Arrancar el backend

```bash
cd backend

# Mac/Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate

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
│   │   ├── models/       # Modelos SQLAlchemy (User)
│   │   ├── routes/       # Endpoints API (auth, main)
│   │   ├── services/     # Lógica de negocio e integración con Groq IA
│   │   ├── __init__.py   # Fábrica de la app Flask
│   │   └── config.py     # Configuración desde variables de entorno
│   ├── migrations/       # Migraciones Alembic
│   ├── requirements.txt
│   └── run.py            # Punto de entrada
├── frontend/
│   ├── app/              # Next.js App Router
│   │   ├── (app)/        # Grupo de rutas públicas
│   │   │   ├── login/    # Página de inicio de sesión
│   │   │   ├── register/ # Página de registro de usuario
│   │   │   └── page.jsx  # Landing / Home
│   │   ├── (protected)/  # Grupo de rutas protegidas (requieren auth)
│   │   │   ├── dashboard/# Panel de control del usuario
│   │   │   └── session/  # Simulador de entrevista técnica
│   │   └── layout.js     # Layout raíz de la aplicación
│   ├── src/
│   │   ├── components/   # Componentes reutilizables (Navbar, Footer, StackSelector)
│   │   ├── components/ui/# Componentes Shadcn/ui (Button, Card, Input, etc.)
│   │   ├── context/      # AuthContext — gestión global de sesión
│   │   ├── data/         # Datos estáticos (stacks de tecnología)
│   │   ├── lib/          # Utilidades (cn, helpers)
│   │   └── services/     # Llamadas a la API backend
│   ├── public/
│   ├── package.json
│   └── next.config.mjs
├── docker-compose.yml    # PostgreSQL local
└── README.md
```

---

## Scripts útiles

| Comando | Descripción |
| --- | --- |
| `docker compose up -d` | Iniciar PostgreSQL |
| `docker compose down` | Detener PostgreSQL |
| `cd backend && flask run` | Iniciar backend (puerto 5000) |
| `cd frontend && npm run dev` | Iniciar frontend Next.js (puerto 3000) |
| `cd frontend && npm run build` | Build de producción (Next.js) |
| `cd frontend && npm run lint` | Lint del código (Next.js ESLint) |
| `cd backend && flask db migrate` | Crear nueva migración Alembic |
| `cd backend && flask db upgrade` | Aplicar migraciones pendientes |

---

## Variables de entorno

### Backend (`backend/.env`)

```
GROQ_API_KEY=
JWT_SECRET_KEY=
DATABASE_URL=postgresql://admin:admin@localhost:5432/interview_prep
FLASK_ENV=
```

### Frontend (`frontend/.env`)

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## Workflow Git

### Ramas

```
main        → producción, siempre deployable
dev         → integración, aquí se mergean las features
feature/xxx → trabajo individual
fix/xxx     → corrección de bugs
```

### Flujo de trabajo

```bash
# Antes de empezar cualquier tarea
git checkout dev
git pull origin dev
git checkout -b feature/nombre-descriptivo

# Cuando terminas
# Abre un PR hacia dev en GitHub
# Mínimo 1 review de otro miembro antes de mergear
# Nunca se pushea directamente a main
```

### Convención de commits

```
feat:     nueva funcionalidad
fix:      corrección de bug
chore:    tareas de mantenimiento o configuración
refactor: cambio sin nueva funcionalidad
docs:     documentación
```
