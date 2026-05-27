# Interview Prep App

> Aplicación para reforzar el estudio de entrevistas técnicas de desarrollo web.

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat&logo=python&logoColor=white)](https://python.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=white)](https://react.dev)
[![Flask](https://img.shields.io/badge/Flask-3-000000?style=flat&logo=flask&logoColor=white)](https://flask.palletsprojects.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat&logo=postgresql&logoColor=white)](https://postgresql.org)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat)](LICENSE)

---

## Descripción

Interview Prep App es una plataforma interactiva para que desarrolladores web practiquen entrevistas técnicas. Permite seleccionar tu rol (Frontend/Backend), tecnologías y nivel de dificultad, y genera preguntas personalizadas vía IA para simular entrevistas reales.

## Stack

| Capa                 | Tecnología                 |
| -------------------- | -------------------------- |
| Frontend             | React + Vite               |
| Routing              | React Router               |
| Estilos              | Tailwind CSS + Shadcn/ui (planificado) |
| Backend              | Flask (Python)             |
| ORM                  | SQLAlchemy + Flask-Migrate |
| Auth                 | JWT + bcrypt               |
| IA                   | Groq API                   |
| Base de datos (dev)  | PostgreSQL (Docker)        |
| Base de datos (prod) | PostgreSQL (Render)        |
| Deploy               | Render                     |

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

Si el contenedor no existe lo crea

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

> Disponible en `http://localhost:5173`

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
│   │   ├── models/       # Modelos de base de datos (User)
│   │   ├── routes/       # Endpoints de la API (auth, main)
│   │   ├── services/     # Lógica de negocio (IA, etc.)
│   │   ├── __init__.py   # Fábrica de la app Flask
│   │   └── config.py     # Configuración desde .env
│   ├── migrations/       # Migraciones de SQLAlchemy
│   ├── requirements.txt
│   └── run.py            # Punto de entrada
├── frontend/
│   ├── src/
│   │   ├── components/   # Componentes reutilizables
│   │   ├── context/      # Contextos de React (AuthContext)
│   │   ├── data/         # Datos estáticos (stacks)
│   │   ├── pages/        # Páginas (Home, Session, Dashboard)
│   │   ├── services/     # Llamadas a la API
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── docker-compose.yml    # PostgreSQL local
└── README.md
```

---

## Scripts útiles

| Comando | Descripción |
|---------|-------------|
| `docker compose up -d` | Iniciar PostgreSQL |
| `docker compose down` | Detener PostgreSQL |
| `cd backend && flask run` | Iniciar backend |
| `cd frontend && npm run dev` | Iniciar frontend |
| `cd frontend && npm run build` | Build producción frontend |
| `cd frontend && npm run lint` | Lint frontend |
| `cd backend && flask db migrate` | Crear migración |
| `cd backend && flask db upgrade` | Aplicar migraciones |

---

## Licencia

Distribuido bajo licencia MIT. Ver [LICENSE](LICENSE) para más información.

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

---

## Variables de entorno

### Backend (`backend/.env`)

```
GROQ_API_KEY=
JWT_SECRET_KEY=
DATABASE_URL=postgresql://admin:admin@localhost:5432/interview_prep
FLASK_ENV=development
```

### Frontend (`frontend/.env`)

```
VITE_API_URL=http://localhost:5000
```
