# Interview Prep App

> Aplicación para reforzar el estudio de entrevistas técnicas de desarrollo web.

---

## Descripción

<!-- TODO: Explicar qué hace la app, qué problema resuelve y para quién -->

## Stack

| Capa                 | Tecnología                 |
| -------------------- | -------------------------- |
| Frontend             | React + Vite               |
| Routing              | React Router               |
| Estilos              | Tailwind CSS + Shadcn/ui   |
| Backend              | Flask (Python)             |
| ORM                  | SQLAlchemy + Flask-Migrate |
| Auth                 | JWT + bcrypt               |
| IA                   | Groq API                   |
| Base de datos (dev)  | PostgreSQL (Docker)        |
| Base de datos (prod) | PostgreSQL (Render)        |
| Deploy               | Render                     |

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
git clone https://github.com/TU_USUARIO/interview-prep-app.git
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
docker run --name interview-prep-db \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=admin \
  -e POSTGRES_DB=interview_prep \
  -p 5432:5432 \
  -d postgres:16
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
docker start interview-prep-db
```

### Arrancar el backend

```bash
cd backend
source venv/bin/activate  # Mac/Linux
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
docker stop interview-prep-db
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
