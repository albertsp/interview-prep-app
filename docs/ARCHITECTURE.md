# Interview Prep App — Documentación Técnica

> Snapshot del proyecto al 8 de junio de 2026. Refleja el estado del código en las ramas `feature/gamificacion-sesion` y `feature/stats-page`.

## 1. Resumen

**Interview Prep App** es una plataforma para practicar entrevistas técnicas de desarrollo web. El usuario configura una sesión (rol + stack + nivel), la IA genera 5 preguntas, responde una por una, recibe feedback, puede guardar *cards* de estudio y acumula XP/nivel. Todo persiste por usuario autenticado con JWT.

Funcionalidades activas: registro/login, simulador de entrevista, generación de preguntas y feedback por IA (Groq), guardado de cards editables, sistema de XP y nivel, página de stats con vista hero de progreso.

## 2. Stack

| Capa | Tecnología | Versión |
| --- | --- | --- |
| Frontend framework | Next.js (App Router) | 15.x |
| UI runtime | React | 19.x |
| Estilos | Tailwind CSS | 4.x |
| Componentes | shadcn/ui + Radix | — |
| Animaciones | Framer Motion | 12.x |
| Editor de código | CodeMirror 6 | latest |
| Iconos | Lucide React | 1.x |
| Backend | Flask | 3.1 |
| ORM | SQLAlchemy + Flask-Migrate (Alembic) | 2.x / 4.x |
| Auth | Flask-JWT-Extended | 4.x |
| Hashing | bcrypt | 5.x |
| CORS | flask-cors | 6.x |
| Base de datos | PostgreSQL | 16 |
| IA | Groq API (`llama-3.3-70b-versatile`) | — |
| Lenguaje backend | Python | 3.11+ |

## 3. Arquitectura y comunicación FE↔BE

### Diagrama de capas

```
┌──────────────────────┐        ┌──────────────────────┐
│     FRONTEND         │        │      BACKEND         │
│  (Next.js 15)        │  HTTP  │  (Flask 3)           │
│                      │  JSON  │                      │
│  ┌────────────────┐  │   +    │  ┌────────────────┐  │
│  │ Pages (app/)   │  │  JWT   │  │ Blueprints:    │  │
│  │  (Rutas)       │  │        │  │  - auth        │  │
│  └───────┬────────┘  │        │  │  - stacks      │  │
│          │           │        │  │  - sessions    │  │
│  ┌───────▼────────┐  │        │  │  - cards       │  │
│  │ Components     │  │        │  │  - user        │  │
│  │  (Card, Editor,│  │        │  └────────┬───────┘  │
│  │   Navbar, ...) │  │        │           │          │
│  └───────┬────────┘  │        │  ┌────────▼───────┐  │
│          │           │        │  │ Services:      │  │
│  ┌───────▼────────┐  │        │  │  - ai_service  │  │
│  │ Services       │  │        │  │    (Groq)      │  │
│  │ (fetch helpers)│──┼────────┼─►                │  │
│  └───────┬────────┘  │        │  └────────────────┘  │
│          │           │        │           │          │
│  ┌───────▼────────┐  │        │  ┌────────▼───────┐  │
│  │ AuthContext    │  │        │  │ SQLAlchemy ORM │  │
│  │ + Reducers     │  │        │  └────────┬───────┘  │
│  └────────────────┘  │        │           │          │
└──────────────────────┘        │  ┌────────▼───────┐  │
                                │  │ PostgreSQL 16  │  │
                                │  │ (Docker/Render)│  │
                                │  └────────────────┘  │
                                └──────────────────────┘
                                          ▲
                                          │ HTTPS
                                ┌─────────┴────────┐
                                │   Groq API       │
                                │   (LLM externo)  │
                                └──────────────────┘
```

### Flujo de una request típica

1. Componente de página llama a un servicio (ej. `sessionService.createSession(token, payload)`).
2. El servicio hace `fetch(API_URL + ruta, { method, headers: { Authorization: Bearer <jwt>, Content-Type: application/json }, body })`.
3. Flask recibe la petición. Si no es "simple" (PATCH, JSON, Authorization), el navegador envía un preflight `OPTIONS` previo que `flask-cors` resuelve con headers `Access-Control-Allow-*`.
4. Flask valida el JWT con `@jwt_required()` y extrae `user_id` del token.
5. La ruta ejecuta lógica: consulta BD, llama a `ai_service` si aplica, persiste cambios.
6. Devuelve JSON; el servicio lo parsea.
7. Componente actualiza estado (dispatch al reducer o `setState` del context).

### CORS

Configurado en `backend/app/__init__.py` con orígenes leídos de `CORS_ORIGINS` (env). En dev, fallback a `http://localhost:3000`. En producción, la app **falla al arrancar** si no está definida. Métodos permitidos: `GET, POST, PATCH, DELETE, OPTIONS`. Headers: `Content-Type, Authorization`. Cache del preflight: 1 hora.

## 4. Estructura de carpetas

```
interview-prep-app/
├── backend/
│   ├── app/
│   │   ├── __init__.py           # create_app factory
│   │   ├── config.py             # Config desde .env (DB, JWT, CORS)
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   ├── session.py
│   │   │   ├── question.py
│   │   │   └── card.py
│   │   ├── routes/
│   │   │   ├── auth.py           # /auth/register, /auth/login
│   │   │   ├── stacks.py         # /stacks/
│   │   │   ├── sessions.py       # /sessions/, .../questions/..., .../complete
│   │   │   ├── cards.py          # /cards/
│   │   │   └── user.py           # /me/stats
│   │   ├── services/
│   │   │   └── ai_service.py     # Groq client + prompts + safe parsers
│   │   └── constants/
│   │       └── stacks.py         # ROLES, VALID_STACKS, VALID_LEVELS
│   ├── migrations/               # Alembic (7 versiones aplicadas)
│   ├── venv/
│   ├── requirements.txt
│   ├── run.py                    # dev entrypoint
│   └── .env / .env.example
│
├── frontend/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.js             # Root: AuthProvider, metadata
│   │   ├── (app)/
│   │   │   ├── layout.jsx        # Navbar + Footer
│   │   │   ├── page.jsx          # Landing (/)
│   │   │   ├── login/page.jsx
│   │   │   ├── register/page.jsx
│   │   │   └── (protected)/
│   │   │       ├── layout.jsx    # JWT guard
│   │   │       ├── dashboard/page.jsx
│   │   │       ├── session/page.jsx
│   │   │       └── stats/page.jsx
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/               # shadcn primitives (Button, Card, Input, ...)
│   │   │   ├── home/             # Hero, Features, CTA, HowItWorks, Techs
│   │   │   ├── session/          # SessionSetup, QuestionPhase, FeedbackPhase,
│   │   │   │                     # CardEditor, FeedbackLoading, ProgressIndicator,
│   │   │   │                     # SessionComplete
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── StackSelector.jsx
│   │   │   ├── MarkdownContent.jsx
│   │   │   └── CodeEditor.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── reducers/
│   │   │   └── sessionReducer.js
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   ├── sessionService.js
│   │   │   └── stacksService.js
│   │   ├── lib/utils.js          # cn() y helpers
│   │   └── index.css
│   ├── next.config.mjs
│   ├── jsconfig.json             # alias @/* -> src/*
│   ├── components.json           # shadcn config
│   ├── package.json
│   └── .env / .env.example
│
├── docker-compose.yml            # PostgreSQL local
└── README.md
```

## 5. Variables de entorno

### Backend (`backend/.env`)

| Variable | Obligatorio | Default | Descripción |
| --- | --- | --- | --- |
| `DATABASE_URL` | Sí | — | URL PostgreSQL completa |
| `JWT_SECRET_KEY` | Sí | — | Secreto para firmar tokens |
| `GROQ_API_KEY` | Sí | — | API key de Groq |
| `CORS_ORIGINS` | Sí (prod) | — en dev: `http://localhost:3000` | Lista separada por comas |
| `FRONTEND_URL` | Recomendado | — | URL pública del frontend |
| `FLASK_ENV` | Opcional | `production` | `development` activa debug y fallback CORS |

### Frontend (`frontend/.env`)

| Variable | Obligatorio | Descripción |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Sí | URL del backend (ej. `http://localhost:5000`) |

## 6. Modelo de datos

### User (`backend/app/models/user.py`)

| Campo | Tipo | Notas |
| --- | --- | --- |
| `user_id` | Integer PK | autoincrement |
| `name` | VARCHAR(80) NOT NULL | |
| `email` | VARCHAR(250) UNIQUE | |
| `password` | VARCHAR(250) NOT NULL | bcrypt hash |
| `total_xp` | Integer NOT NULL DEFAULT 0 | gamificación |
| `level` | Integer NOT NULL DEFAULT 1 | gamificación |

### Session (`backend/app/models/session.py`)

| Campo | Tipo | Notas |
| --- | --- | --- |
| `session_id` | Integer PK | |
| `stack` | VARCHAR(80) NOT NULL | ej. "JavaScript", "Python" |
| `level` | VARCHAR(20) NOT NULL | "Básico", "Intermedio", "Avanzado" |
| `created_at` | DateTime | `datetime.utcnow` |
| `user_id` | Integer FK → user | |
| `feedback` | VARCHAR(250) NULL | sin uso actual (placeholder) |

### Question (`backend/app/models/question.py`)

| Campo | Tipo | Notas |
| --- | --- | --- |
| `question_id` | Integer PK | |
| `question` | Text NOT NULL | enunciado |
| `answer` | Text NULL | respuesta del usuario |
| `session_id` | Integer FK → session | |
| `feedback` | Text NULL | generado por la IA |
| `result` | VARCHAR(20) NULL | "CORRECT", "PARTIALLY_CORRECT", "INCORRECT" |

### Card (`backend/app/models/card.py`)

| Campo | Tipo | Notas |
| --- | --- | --- |
| `card_id` | Integer PK | |
| `question_id` | Integer FK | |
| `session_id` | Integer FK | |
| `user_id` | Integer FK | |
| `concept` | VARCHAR(120) NOT NULL | título corto (≤6 palabras en el prompt) |
| `definition` | Text NULL | definición en 1 frase |
| `explanation` | Text NOT NULL | aclaración profunda |
| `use_case` | Text NOT NULL | cuándo SÍ usarlo |
| `avoid_when` | Text NULL | cuándo NO usarlo |
| `mnemonic` | VARCHAR(200) NULL | truco mnemotécnico |
| `tags` | JSON NULL | array de strings |
| `code` | Text NULL | snippet de código |
| `code_language` | VARCHAR(50) NULL DEFAULT "javascript" | |
| `difficulty` | Integer NULL | 1=Basico, 2=Intermedio, 3=Avanzado |
| `created_at` | DateTime | `datetime.utcnow` |

**Nota:** no hay `db.relationship()` definidos, solo ForeignKeys. Las queries usan joins explícitos.

## 7. Autenticación y sesión JWT

### Flujo de login

1. `POST /auth/login` con `{ email, password }`.
2. Backend busca user por email, compara con `bcrypt.checkpw`.
3. Si OK, genera token con `create_access_token(identity=str(user.user_id))`.
4. Devuelve `{ access_token, user_id, name }`.
5. Frontend guarda `token` y `user` en `localStorage` y actualiza `AuthContext`.
6. Redirige a `/session`.

### Estructura del token

- Librería: `flask-jwt-extended`.
- `identity` = `user_id` (string).
- Expiración por defecto (15 min en esta versión, no se configura explícitamente — gap conocido).

### Almacenamiento

- `localStorage` (claves: `token`, `user`).
- **Gap de seguridad:** vulnerable a XSS. La migración a cookies `httpOnly` está pendiente (P0 #3).

### Rutas protegidas

- Agrupadas en `(protected)`. `protected/layout.jsx` espera a que `AuthContext.initialized === true`, luego verifica `token`. Si no hay token, redirige a `/`. Si hay, renderiza hijos.

### Peticiones autenticadas

Todos los servicios (excepto `stacksService.getStacks` y los de auth) añaden `Authorization: Bearer <token>` desde `useAuth().token`.

## 8. Endpoints del backend

Prefijo: ninguno (rutas absolutas). Todas devuelven JSON. Errores devuelven `{ "error": "..." }` o `{ "msg": "..." }` con status code HTTP.

### `POST /auth/register`

- **Auth:** no
- **Body:** `{ name, email, password }`
- **201 Created:** `{ "succes": "Usuario creado correctamente" }`  *(typo conocido, "succes" → "success")*
- **400:** `{ "error": "Los campos no pueden estar vacios" }`
- **409:** `{ "error": "Este email ya esta registrado" }`
- **Notas:** hashea con `bcrypt.gensalt(12)`. No valida formato de email ni fortaleza de password.

### `POST /auth/login`

- **Auth:** no
- **Body:** `{ email, password }`
- **200 OK:** `{ access_token, user_id, name }`
- **400:** `{ "error": "Credenciales incorrectas" }` (mismo mensaje para user inexistente y password incorrecto)

### `GET /stacks/`

- **Auth:** no
- **200 OK:** `{ "rol": { "Frontend": ["HTML/CSS", "JavaScript", "React"], "Backend": ["Python", "SQL"] }, "level": ["Básico", "Intermedio", "Avanzado"] }`
- **Notas:** datos estáticos desde `app/constants/stacks.py`.

### `POST /sessions/`

- **Auth:** sí (JWT)
- **Body:** `{ stack, level }`
- **201 Created:** `{ session_id, stack, level, questions: [{ question_id, question }, ...5] }`
- **400:** `{ "Error": "El stack seleccionado o el nivel no estan permitidos" }`
- **Notas:** valida contra `VALID_STACKS` y `VALID_LEVELS`. Genera preguntas con `Groq` (`generate_questions`). Persiste 5 `Question` rows. Si Groq falla, devuelve 500 (no hay fallback robusto).

### `PATCH /sessions/<int:session_id>/questions/<int:question_id>`

- **Auth:** sí
- **Body:** `{ answer }`
- **200 OK:** `{ session_id, question_id, result, feedback, card: { concept, definition, explanation, use_case, avoid_when, mnemonic, code, code_language, tags } }`
- **404:** `{ "msg": "La sesión no existe" }` o `{ "msg": "La pregunta no existe" }`
- **Notas:** valida que la sesión pertenece al usuario. Llama a `generate_feedback(stack, question, answer)`. Persiste `answer`, `feedback`, `result` en Question. El card NO se persiste aquí, solo se devuelve para edición en frontend.

### `POST /sessions/<int:session_id>/complete`

- **Auth:** sí
- **Body:** ninguno
- **200 OK:** `{ session_id, xp_earned, bonus_applied, total_xp, level, xp_to_next_level, breakdown: [{ question_id, result, xp }, ...] }`
- **404:** `{ "msg": "La sesion no existe" }`
- **Notas:** calcula XP por pregunta respondida, suma bonus si están todas respondidas, actualiza `User.total_xp` y `User.level`, commit, devuelve stats. Idempotente: llamarlo dos veces duplica XP (gap conocido).

### `POST /cards/`

- **Auth:** sí
- **Body:** `{ question_id, session_id, concept, definition, explanation, use_case, avoid_when, mnemonic, tags, code, code_language }`
- **201 Created:** `{ card_id, concept }`
- **400:** `{ "msg": "Los campos concept, explanation y use_case son obligatorios" }` o `{ "msg": "La sesion no existe" }` / `La pregunta no existe`
- **Notas:** valida ownership de session. Trunca `concept` a 120 chars, `mnemonic` a 200. `difficulty` se deriva del `level` de la sesión.

### `GET /me/stats`

- **Auth:** sí
- **200 OK:** `{ total_xp, level, xp_to_next_level, progress_in_level, xp_per_level }`
- **404:** `{ "msg": "Usuario no encontrado" }`
- **Notas:** lee de `User.total_xp` y `User.level`. Calcula el resto en tiempo de respuesta.

## 9. Servicios del frontend

Todos viven en `frontend/src/services/`. Comparten un helper `handleResponse` que parsea JSON o lanza `Error` con mensaje del backend.

### `authService.js`

```js
loginUser(email, password)         // POST /auth/login
registerUser(name, email, password) // POST /auth/register
```

### `sessionService.js`

```js
createSession(token, { stack, level })                  // POST /sessions/
submitAnswer(token, sessionId, questionId, answer)      // PATCH /sessions/:id/questions/:qid
saveCard(token, { question_id, session_id, ... })       // POST /cards/
completeSession(token, sessionId)                       // POST /sessions/:id/complete
getMyStats(token)                                        // GET /me/stats
```

### `stacksService.js`

```js
getStacks()                                              // GET /stacks/ (sin auth)
```

Todos añaden `Authorization: Bearer <token>` excepto `stacksService` y los de auth.

## 10. Estado global

### `AuthContext` (`src/context/AuthContext.jsx`)

| Campo / Método | Tipo | Descripción |
| --- | --- | --- |
| `token` | string | JWT, leído de localStorage |
| `user` | string | Nombre del usuario |
| `stats` | object | `{ total_xp, level, xp_to_next_level, progress_in_level, xp_per_level }` |
| `initialized` | bool | true tras la primera lectura de localStorage |
| `login(name, token)` | fn | Persiste en localStorage y refresca stats |
| `logout()` | fn | Limpia localStorage y resetea stats |
| `refreshStats()` | fn | Vuelve a llamar a `getMyStats` y actualiza |

Al montar, si hay token en localStorage, llama automáticamente a `getMyStats` para hidratar `stats`.

### `sessionReducer` (`src/reducers/sessionReducer.js`)

Estado del flujo de entrevista:

```js
{
  session_id, stack, level,           // datos de la sesion
  questions: [...],                   // con answer y feedback internos
  currentQuestionIndex,
  currentAnswer,
  currentPhase,                       // "answering" | "loading_feedback" | "waiting_action" | "complete"
  result,                             // CORRECT | PARTIALLY_CORRECT | INCORRECT
  feedback,
  card,                               // editable
  originalCard,                       // snapshot para detectar ediciones
  sessionXpEarned, sessionTotalXp, sessionLevel, sessionXpToNextLevel, sessionBonusApplied,
  sessionCompleteLoaded,
  error,
}
```

Acciones: `INIT_SESSION`, `ANSWER_CHANGED`, `ANSWER_SUBMITTED`, `FEEDBACK_RECEIVED`, `UPDATE_CARD`, `CARD_SAVED`, `CARD_DISCARDED`, `SESSION_COMPLETED`, `SET_ERROR`, `RESET_SESSION`, `SESSION_ENDED`.

## 11. Páginas y rutas

### Públicas (grupo `(app)`)

| Ruta | Componente | Descripción |
| --- | --- | --- |
| `/` | `app/(app)/page.jsx` | Landing: Hero + Techs + HowItWorks + Features + CTA |
| `/login` | `app/(app)/login/page.jsx` | Formulario email + password |
| `/register` | `app/(app)/register/page.jsx` | Formulario name + email + password |

### Protegidas (grupo `(protected)`, requieren JWT)

| Ruta | Componente | Descripción |
| --- | --- | --- |
| `/dashboard` | `app/(app)/(protected)/dashboard/page.jsx` | **Placeholder** (solo `<h1>Dashboard</h1>`) |
| `/session` | `app/(app)/(protected)/session/page.jsx` | Flujo completo: setup → preguntas → feedback → cards → complete |
| `/stats` | `app/(app)/(protected)/stats/page.jsx` | Hero de nivel + 3 stat cards + teaser "Próximamente" (Fase 0) |

### Componentes principales de `/session`

- `SessionSetup` — selector de stack/level (3 pasos con StackSelector)
- `ProgressIndicator` — barra de progreso de preguntas
- `QuestionPhase` — enunciado + textarea/CodeMirror
- `FeedbackLoading` — spinner mientras la IA responde
- `FeedbackPhase` — badge de resultado + feedback markdown + CardEditor + botones
- `SessionComplete` — celebracion + bloque de XP ganado + nivel

## 12. Sistema de gamificación

### XP por resultado

| Resultado | XP por pregunta |
| --- | --- |
| `CORRECT` | +100 |
| `PARTIALLY_CORRECT` | +50 |
| `INCORRECT` | +10 |
| **Bonus** por completar todas las preguntas de la sesión | +50 |

### Fórmula de nivel

```python
level = (total_xp // 500) + 1
```

- 0–499 XP → Nv 1
- 500–999 XP → Nv 2
- 1000–1499 XP → Nv 3
- etc.

### Dónde se calcula

- **Backend:** `POST /sessions/<id>/complete` (en `routes/sessions.py`, `XP_PER_RESULT`, `XP_COMPLETION_BONUS`, `compute_level`).
- **Frontend:**
  - `Navbar` muestra badge persistente: Nv + XP total + mini barra de progreso.
  - `FeedbackPhase` muestra badge de resultado con XP ganado en esa pregunta.
  - `SessionComplete` muestra bloque con XP ganado, bonus, nivel y barra al siguiente.
  - `AuthContext.refreshStats()` actualiza el navbar tras `/complete`.

## 13. Integración con Groq

`backend/app/services/ai_service.py` envuelve el cliente oficial de Groq. Modelo: `llama-3.3-70b-versatile`.

### Funciones

```python
generate_questions(stack, level) -> list[str]
    # Devuelve 5 preguntas como array JSON de strings

generate_feedback(stack, question, answer) -> dict
    # Devuelve { result, feedback, card: {...} }
    # NUNCA lanza excepcion: si falla, devuelve EMPTY_FEEDBACK
```

### Prompts

- `SYSTEM_PROMPT_QUESTIONS`: pide 5 preguntas 100% código, formato JSON array, en español con tech en inglés.
- `SYSTEM_PROMPT_FEEDBACK`: stack-aware (recibe el stack en el user message), pide feedback + card con campos `concept`, `definition`, `explanation`, `use_case`, `avoid_when`, `mnemonic`, `code`, `code_language`, `tags`. Límites de palabras explícitos.

### Parsers seguros

- `_parse_ai_json`: limpia bloques markdown ```json ...``` y parsea con `strict=False`.
- `_safe_feedback`: normaliza `result` a uno de los 3 valores válidos, rellena strings vacíos.
- `_safe_card`: garantiza que la card tiene todos los campos esperados; si `tags` no es lista, lo convierte a `[]`.

Si Groq devuelve algo no parseable, `generate_feedback` retorna `EMPTY_FEEDBACK` con mensaje neutro ("La IA no devolvio una respuesta valida..."). Esto evita 500 al usuario.

## 14. CORS

Configurado en `backend/app/__init__.py:create_app()`:

```python
if Config.FLASK_ENV == "development" and not Config.parse_cors_origins():
    allowed_origins = ["http://localhost:3000"]
else:
    allowed_origins = Config.parse_cors_origins()

if not allowed_origins:
    raise RuntimeError("CORS_ORIGINS es obligatorio en producción...")

CORS(app, resources={r"/*": {"origins": allowed_origins}},
     methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
     allow_headers=["Content-Type", "Authorization"],
     max_age=3600)
```

### Por qué aparecen OPTIONS en el traceback

Las requests del frontend son no-simples (PATCH + JSON + Authorization), así que el navegador envía un preflight `OPTIONS` antes. `flask-cors` lo responde con headers `Access-Control-Allow-*` sin tocar la lógica. Ver sección 3 para más detalle.

## 15. Migraciones

Aplicadas (de más antigua a más reciente):

| Revision | Descripción |
| --- | --- |
| `2911f3654427` | create user table |
| `233e6cf7eab5` | add session table |
| `913e0ad60d04` | add question table |
| `768878a8b974` | add card model (con cambios en question) |
| `e1297814b3c4` | add code and code_language to card |
| `a1b2c3d4e5f6` | enrich card (definition, avoid_when, mnemonic, tags, difficulty) |
| `b2c3d4e5f6a7` | add gamification (user.total_xp, user.level, question.result) |

Comandos: `flask db migrate -m "..."` y `flask db upgrade`.

## 16. Flujo end-to-end: una sesión completa

1. **Login.** Usuario entra email + password → backend valida, devuelve JWT → frontend guarda en `localStorage` y en `AuthContext`. Redirige a `/session`.
2. **Setup.** `SessionSetup` carga stacks con `GET /stacks/`. Usuario elige Frontend → JavaScript → Intermedio. Pulsa "Empezar".
3. **Crear sesión.** Frontend llama a `POST /sessions/` con `{ stack, level }`. Backend valida, crea Session + 5 Questions, devuelve `session_id` y `questions`.
4. **Pregunta 1.** `QuestionPhase` muestra el enunciado. Usuario responde. Pulsa "Enviar respuesta".
5. **Submit answer.** Frontend llama a `PATCH /sessions/<sid>/questions/<qid>` con `{ answer }`. Backend guarda `answer`, llama a `generate_feedback`, guarda `result` y `feedback` en Question, devuelve `{ result, feedback, card }`. Frontend dispatch `FEEDBACK_RECEIVED`.
6. **Feedback phase.** `FeedbackPhase` muestra badge de resultado (verde/ámbar/rojo) con el XP ganado, el feedback en markdown, y el `CardEditor` con la card (modo VIEW por defecto). Usuario puede pulsar "Editar" para modificar campos.
7. **Guardar card.** Pulsa "Guardar card" → `POST /cards/` con todos los campos → backend persiste con `difficulty` derivado del nivel de la sesión. Frontend dispatch `CARD_SAVED`.
8. **Siguiente pregunta.** Repeat 4-7 hasta la pregunta 5.
9. **Complete.** Tras la última respuesta, frontend dispatch phase = `complete`. Se llama automáticamente a `POST /sessions/<sid>/complete`. Backend calcula XP total, actualiza `User.total_xp` y `User.level`, devuelve stats. Frontend dispatch `SESSION_COMPLETED` y `refreshStats`.
10. **Session complete.** `SessionComplete` muestra bloque con XP ganado, bonus, nivel actualizado y barra al siguiente. Usuario puede ir a `/dashboard` o empezar nueva sesión.
11. **Navbar actualizado.** El badge XP del navbar refleja el nuevo nivel y XP total.

## 17. Gaps conocidos

Funcionalidades mencionadas o planeadas pero **no implementadas**:

- **P0 #3:** JWT en `localStorage` (vulnerable a XSS) — debería migrarse a cookies `httpOnly`.
- **P0 #4:** Validación de variables de entorno al arranque.
- **P0 #5:** Expiración JWT explícita y refresh tokens.
- **P0 #8:** `datetime.utcnow()` deprecado (usar `datetime.now(timezone.utc)`).
- **P0 #9:** Typo `"succes"` en respuesta de `register`.
- **P1 #11:** Dashboard es un placeholder — falta lista de cards guardadas, historial de sesiones, métricas.
- **P1 #12:** Sin endpoints `GET /sessions/`, `GET /sessions/<id>`, `GET /cards/`, `DELETE /cards/<id>`, `PATCH /cards/<id>`.
- **P1 #13:** Sin validación robusta de inputs (email regex, password mínimo, pydantic/marshmallow).
- **P1 #15:** Sin rate limiting (brute-force login, abuso de Groq).
- **P1 #16:** Sin `db.relationship` definido.
- **P1 #20:** Sin blacklist de tokens para logout real.
- **P1 #23:** Sin paginación en listados.
- **P1 #24:** Sin tests (ni pytest ni vitest).
- **P1 #25:** Sin streaming en `create_session` (usuario espera en blanco).
- **P1 #28:** Sin endpoint `/complete` idempotente (llamarlo 2 veces duplica XP).
- **P2 #35:** Sin `prefers-reduced-motion` en animaciones.
- **P2 #37:** Variants de Framer Motion no reutilizables (algunos inline).
- **Fase 1 de Stats:** sin endpoint `/me/stats/overview` con sessions_count, cards_count, etc.
- **Fase 2-3 de Stats:** sin desglose por stack ni tendencia temporal.
- **Cards study mode:** Leitner/FSRS, exportación a Anki, repaso.
- **Internationalization:** todo hardcodeado en español.
