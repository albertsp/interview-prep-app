# Auditoría profesional — Interview Prep App
**Fecha:** 2026-06-20 · **Rama:** dev · **Alcance:** monorepo (frontend Next.js 15 + backend Flask)

> Este informe está basado en lectura real del código (no genérico). Tamaño real del proyecto: ~56 archivos frontend, ~21 archivos backend, 4 archivos de tests backend, 1 archivo de tests frontend, 0 pipelines CI/CD, 1 `docker-compose.yml` (solo DB).

---

## FASE 1 — Auditoría global de arquitectura

| Apartado | Nota /10 | Comentario |
|---|---|---|
| Estructura de carpetas | 7 | Clara separación `frontend/` `backend/`, App Router con `(app)`/`(protected)` groups, blueprints por dominio. |
| Separación de responsabilidades | 5 | Backend: rutas hacen DB + lógica de negocio (no hay capa de servicio/repositorio salvo `ai_service.py`). Frontend: `services/` separa fetch, pero componentes grandes mezclan UI+lógica. |
| Acoplamiento | 6 | Servicios frontend desacoplados vía `httpClient`. Backend acoplado: rutas dependen directamente de modelos SQLAlchemy. |
| Cohesión | 7 | Buena cohesión por dominio (cards, sessions, stacks, user, auth). |
| Escalabilidad | 5 | Sin índices en FKs, sin rate limiting, sin caché, 1 worker Gunicorn — no escala horizontalmente sin trabajo adicional. |
| Modularidad | 6 | Componentes UI (`components/ui`) bien aislados (shadcn-style). Componentes de dominio (`session/`, `dashboard/`) más monolíticos. |
| Convenciones de nombres | 6 | Inconsistencia: mezcla español/inglés en algunos archivos (`botonesFiltro.jsx`, `barrabusqueda.jsx`, `confirmEdit.jsx` vs resto en inglés). |
| Duplicación de código | 6 | Lógica de fetch/error-handling repetida entre `cardService`, `sessionService`, `profileService` en vez de centralizada en `httpClient`. |
| Deuda técnica | 5 | Sin capa de servicios backend, sin tests de integración, sin CI, JWT en localStorage. |

**Promedio Fase 1: 5.9/10**

---

## FASE 2 — Frontend (React + Next.js)

### Críticos
**SEVERIDAD:** Crítico
**PROBLEMA:** El JWT de acceso se guarda y lee de `localStorage` (`AuthContext.jsx`, `authService.js`).
**IMPACTO:** Cualquier XSS (por mínimo que sea, p. ej. vía markdown sin sanitizar) permite robar el token y secuestrar la sesión completa.
**SOLUCIÓN PROPUESTA:** Mover el token a cookie `HttpOnly + Secure + SameSite=Strict` puesta por el backend; el frontend deja de tocar el token directamente y solo usa `credentials: "include"`.
**ESFUERZO:** Medio
**PRIORIDAD:** P0

**SEVERIDAD:** Crítico
**PROBLEMA:** No hay protección CSRF para mutaciones (POST/PATCH/DELETE) si en algún momento se usan cookies (`config.py` ya habilita `JWT_TOKEN_LOCATION=["cookies","headers"]` con `JWT_COOKIE_CSRF_PROTECT=False`).
**IMPACTO:** Un sitio malicioso podría ejecutar acciones autenticadas (borrar tarjetas, crear sesiones) en nombre del usuario.
**SOLUCIÓN PROPUESTA:** Si se migra a cookies, activar `JWT_COOKIE_CSRF_PROTECT=True` + header `X-CSRF-Token`; si no, mantener solo `Authorization: Bearer` (más simple) y quitar `"cookies"` de `JWT_TOKEN_LOCATION`.
**ESFUERZO:** Bajo
**PRIORIDAD:** P0

### Altos
- **Manejo de errores silencioso:** `AuthContext.jsx` traga errores en `refreshStats()` (catch vacío) → estadísticas nunca se actualizan sin feedback. **Solución:** loggear + toast. ESFUERZO: Bajo. PRIORIDAD: P1.
- **Falta de estado de carga/disabled en envío de respuestas** (`QuestionPhase.jsx`) → riesgo de doble envío. ESFUERZO: Bajo. PRIORIDAD: P1.
- **Cobertura de tests real ≈ 2%** (`src/__tests__/` solo tiene `AuthContext.test.jsx` para 56 archivos). PRIORIDAD: P1.

### Medios / Bajos
- `httpClient.js` no valida que `NEXT_PUBLIC_API_URL` exista → en producción mal configurada genera URLs rotas silenciosamente.
- Sin retry/backoff en llamadas de red.
- Accesibilidad: faltan `aria-label` descriptivos en botones icon-only (Navbar mobile menu, tags en `CardEditor`).
- SEO: no hay `robots.txt` ni `sitemap.xml` en `frontend/public/`.
- Nomenclatura mixta ES/EN en componentes de `dashboard/`.

### Arquitectura Next.js
- Uso correcto de App Router con route groups `(app)`. No se observó uso explícito de Server Components para data-fetching (todo parece Client Components con `useEffect`); para una app de este tipo (mucho dato por usuario autenticado) es aceptable, pero se pierde el beneficio de RSC para reducir JS enviado al cliente en páginas como landing/FAQ que son estáticas.
- No hay `loading.js` / `error.js` por ruta (Next.js boundaries nativos) — se gestiona todo manualmente en componentes.

**Nota Fase 2: 5.5/10**

---

## FASE 3 — Backend (Flask)

### Críticos
**SEVERIDAD:** Crítico
**PROBLEMA:** N+1 queries en `GET /me/stats` (`routes/user.py`): por cada una de las 5 sesiones recientes se ejecuta una query adicional a `Question`.
**IMPACTO:** Degradación de latencia y de la base de datos a medida que crecen usuarios/sesiones; endpoint muy visitado (dashboard).
**SOLUCIÓN PROPUESTA:** Usar `joinedload`/`contains_eager` para cargar `Question` en la misma query que `Session`.
**ESFUERZO:** Bajo
**PRIORIDAD:** P0

**SEVERIDAD:** Crítico
**PROBLEMA:** Ningún rate limiting en endpoints que llaman a Groq (`POST /sessions/`, `PATCH /sessions/<id>/questions/<id>`).
**IMPACTO:** Un usuario autenticado puede generar coste ilimitado de API de IA (abuso económico, posible agotamiento de cuota que afecta a todos los usuarios).
**SOLUCIÓN PROPUESTA:** Añadir `Flask-Limiter` con límites por usuario (p. ej. 5 generaciones de preguntas/hora, 20 feedbacks/hora) y backoff/cuota diaria.
**ESFUERZO:** Bajo
**PRIORIDAD:** P0

### Altos
- **Sin índices en FKs** (`Session.user_id`, `Card.user_id/session_id/question_id`, `Question.session_id`) → full table scans a medida que crece la tabla. PRIORIDAD: P1.
- **JWT de 1h sin refresh token ni blacklist de logout** → ventana de exposición larga si se filtra un token, sin forma de revocarlo. PRIORIDAD: P1.
- **Mitigación de prompt injection solo por delimitadores** (`ai_service.py`): defensa razonable pero no robusta ante payloads que imiten los delimitadores; falta límite de longitud de respuesta del usuario y validación estricta del JSON de salida del modelo antes de confiar en el grado/XP. PRIORIDAD: P1.

### Medios
- `debug.py` se desactiva por *blocklist* (`FLASK_ENV != "production"`) en vez de *allowlist* — más seguro sería registrar el blueprint solo si `FLASK_ENV == "development"` explícito.
- `JWT_COOKIE_CSRF_PROTECT=False` con `cookies` habilitado como ubicación de token (ver hallazgo frontend #2).
- Sin logging estructurado / audit trail de respuestas de IA y acciones de usuario.
- Mensajes de excepción crudos (`str(e)`) expuestos en algún handler — riesgo de leak de detalles internos en producción.

### Positivo (a mantener)
- ORM en todas las queries → sin inyección SQL.
- Contraseñas con bcrypt.
- CORS configurado explícitamente (no wildcard).
- Flujo OAuth maneja condiciones de carrera de forma razonable.
- Gunicorn configurado con 1 worker + threads para evitar OOM (decisión documentada en commit, correcta para el tamaño de la app).

**Nota Fase 3: 6/10**

---

## FASE 4 — Performance

**Frontend:** sin medición real disponible (no se ejecutó Lighthouse). Riesgos detectados: imágenes no confirmadas vía `next/image` en todos los casos, sin `dynamic()` para `CodeEditor` (CodeMirror es pesado y solo se usa en sesión — candidato a code-splitting), animaciones con `framer-motion` en home (revisar coste de bundle en página estática).

**SEVERIDAD:** Medio
**PROBLEMA:** `CodeEditor.jsx` (CodeMirror + lenguajes) se importa probablemente de forma estática en el layout de sesión.
**IMPACTO:** Aumenta el JS inicial de una ruta que no siempre necesita el editor cargado de inmediato.
**SOLUCIÓN PROPUESTA:** `const CodeEditor = dynamic(() => import('...'), { ssr: false })`.
**ESFUERZO:** Bajo
**PRIORIDAD:** P2

**Backend:** cuello de botella principal es el N+1 ya descrito + falta de índices. Sin caché (Redis) para `stacks` (datos estáticos que no cambian por usuario) — candidato obvio a cachear.

**Benchmark propuesto:** medir `GET /me/stats` con `pytest-benchmark` o `locust` simulando 50 usuarios concurrentes antes/después de corregir N+1 e índices; objetivo p95 < 200ms.

**Nota Fase 4: 5/10** (no medible con precisión sin Lighthouse/profiling real — recomendado como acción inmediata)

---

## FASE 5 — Bugs y fallos críticos (priorizados)

| # | Problema | Severidad |
|---|---|---|
| 1 | JWT en localStorage (XSS → secuestro de sesión) | Crítico |
| 2 | Sin rate limit en endpoints de IA (abuso de coste) | Crítico |
| 3 | N+1 en `/me/stats` | Crítico |
| 4 | Catch vacío en `refreshStats()` → stats nunca se refrescan tras error transitorio | Alto |
| 5 | Doble envío posible en `QuestionPhase` por falta de disabled state | Alto |
| 6 | `debug` blueprint con blocklist en vez de allowlist (riesgo de fuga si `FLASK_ENV` mal seteado) | Medio |
| 7 | Sin índices en FKs → degradación progresiva, no inmediata pero silenciosa | Medio |

---

## FASE 6 — Calidad de código

**Frontend:** componentes de dominio (`SessionSetup`, `CardEditor`, `QuestionPhase`) concentran fetch + estado + render — candidatos a separar en hooks personalizados (`useSessionSetup`, etc.) para cumplir SRP y facilitar testing. Servicios duplican boilerplate de manejo de errores — extraer a `httpClient` un wrapper único.

**Backend:** rutas hacen acceso a datos + serialización + lógica de negocio en la misma función. Para este tamaño de proyecto es aceptable como MVP, pero antes de escalar el equipo conviene extraer una capa `services/` (ya existe el patrón en `ai_service.py`, falta replicarlo para `cards`, `sessions`).

**Nota Fase 6: 6/10**

---

## FASE 7 — Testing (estado actual)

- **Backend:** 4 archivos de test (`test_auth.py`, `test_models.py`, `test_oauth.py`, `conftest.py`) cubren auth/oauth/modelos. **Sin tests** para `cards.py`, `sessions.py`, `stacks.py`, `user.py`, `ai_service.py` (la pieza más crítica de negocio, sin tests). Cobertura real estimada: bajo 30%.
- **Frontend:** 1 archivo de test (`AuthContext.test.jsx`). Sin Playwright, sin tests de componentes de sesión/dashboard. Cobertura real estimada: <5%.
- **Objetivo 90%** declarado en el prompt es alto para el estado actual — recomiendo fijar un objetivo intermedio realista (60% en 3-4 semanas) priorizando rutas de negocio críticas (`sessions`, `cards`, `ai_service`) antes de UI secundaria.

**Plan de tests prioritario (orden):**
1. Backend: `test_cards.py`, `test_sessions.py` (CRUD + autorización cruzada entre usuarios), `test_ai_service.py` (mock de Groq, timeout, JSON inválido, prompt injection).
2. Frontend: `sessionReducer.test.js` (puro, fácil de cubrir al 100%), `httpClient.test.js` (manejo de 401/timeout), tests de render de `CardEditor`/`QuestionPhase` con RTL.
3. E2E (Playwright): flujo login → crear sesión → responder pregunta → ver feedback → guardar tarjeta.

**Nota Fase 7: 3/10**

---

## FASE 8 — Observabilidad

Actualmente: **ninguna**. Sin Sentry, sin logging estructurado, sin métricas. Propuesta mínima viable:
- Backend: `structlog` + Sentry SDK (captura excepciones no manejadas, especialmente en `ai_service.py` donde fallos de Groq son silenciosos hoy).
- Frontend: Sentry para errores de cliente + Web Vitals reporting.
- Alertas mínimas: latencia p95 de `/sessions`, tasa de error 5xx, fallos de Groq.

**Nota Fase 8: 1/10**

---

## FASE 9 — DevOps

- **Docker:** `backend/Dockerfile` correcto para el tamaño actual (no crítico añadir multi-stage todavía). `docker-compose.yml` solo levanta la DB — falta orquestar backend/frontend para desarrollo local end-to-end con un solo comando.
- **CI/CD:** **no existe ningún workflow** (`.github/workflows` ausente). Esto es la brecha más grande de DevOps.
- **Secretos:** `.env.example` presente en ambos lados, sin secretos hardcodeados detectados.

**SEVERIDAD:** Alto
**PROBLEMA:** Ausencia total de CI/CD.
**IMPACTO:** No hay garantía de que `main` esté siempre en estado desplegable; regresiones solo se detectan manualmente.
**SOLUCIÓN PROPUESTA:** Pipeline GitHub Actions mínimo:
```yaml
name: CI
on: [pull_request, push]
jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: '3.12' }
      - run: pip install -r backend/requirements.txt
      - run: cd backend && pytest --cov=app
  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: cd frontend && npm ci
      - run: cd frontend && npm run lint
      - run: cd frontend && npm test -- --run
      - run: cd frontend && npm run build
```
**ESFUERZO:** Bajo
**PRIORIDAD:** P0

**Nota Fase 9: 2/10**

---

## FASE 10 — Documentación

Existe `README.md` (316 líneas) — razonable para el estado actual. Faltan: `ARCHITECTURE.md`, `API.md`, `SECURITY.md`, `CONTRIBUTING.md`, `CHANGELOG.md`, `DECISIONS.md`. Recomiendo generarlos en una fase posterior dedicada (no en este informe) para no inflar el repo con documentación desactualizable antes de estabilizar la arquitectura (orden lógico: primero fijar API/arquitectura, después documentarla).

**Nota Fase 10: 4/10**

---

## FASE 11 — Mejoras priorizadas

**Quick Wins (<2h):**
- Activar índices en FKs (migración Alembic). Beneficio: alto. Complejidad: baja.
- Corregir N+1 en `/me/stats`. Beneficio: alto. Complejidad: baja.
- Disabled+spinner en envío de `QuestionPhase`. Beneficio: medio. Complejidad: baja.
- `robots.txt` + `sitemap.xml`. Beneficio: bajo-medio (SEO). Complejidad: baja.

**Short Term (1-3 días):**
- Flask-Limiter en endpoints de IA.
- Pipeline CI básico (lint+test+build ambos lados).
- Sentry en frontend y backend.
- Tests de `cards.py`/`sessions.py`.

**Medium Term (1 semana):**
- Migrar JWT a cookie HttpOnly + CSRF.
- Extraer capa `services/` en backend para `cards`/`sessions`.
- Suite de tests backend hasta ~60%.

**Long Term (2-4 semanas):**
- Refresh tokens + blacklist de logout (Redis).
- E2E con Playwright.
- Observabilidad completa (logs estructurados + métricas + alertas).
- Documentación completa (`ARCHITECTURE.md`, `API.md`, etc.).

---

## FASE 12 — Nuevas features (propuestas, no implementadas)

| Feature | Categoría | Problema que resuelve | Esfuerzo |
|---|---|---|---|
| Refresh tokens | Must Have | Sesión expira sin aviso/renovación | Medio |
| Rate limiting visible al usuario ("te quedan N generaciones hoy") | Should Have | Transparencia sobre límites de coste de IA | Bajo |
| Exportar progreso/estadísticas (PDF/CSV) | Could Have | Valor para entrevistas reales (mostrar progreso) | Medio |
| Modo "entrevista simulada" cronometrada | Nice to Have | Mayor realismo de práctica | Alto |

---

## FASE 13 — Roadmap hacia v1.0 (resumen ejecutivo)

| ID | Descripción | Prioridad | Tiempo est. | Riesgo |
|---|---|---|---|---|
| F0-1 | Corregir N+1 `/me/stats` + índices FK | P0 | 0.5 día | Bajo |
| F0-2 | Rate limiting endpoints IA | P0 | 0.5 día | Bajo |
| F1-1 | JWT → cookie HttpOnly + CSRF | P0 | 2 días | Medio (requiere coordinar front+back) |
| F1-2 | Capa de servicios backend (cards/sessions) | P1 | 3 días | Bajo |
| F2-1 | CI/CD GitHub Actions | P0 | 0.5 día | Bajo |
| F2-2 | Sentry front+back | P1 | 1 día | Bajo |
| F3-1 | Tests backend rutas críticas | P1 | 3 días | Bajo |
| F3-2 | Tests frontend componentes críticos + Playwright E2E | P1 | 4 días | Medio |
| F4-1 | Documentación (ARCHITECTURE/API/SECURITY) | P2 | 2 días | Bajo |
| F5-1 | Accesibilidad WCAG AA pass | P2 | 1 día | Bajo |

---

## FASE 14 — Informe final

| Área | Nota /10 |
|---|---|
| Arquitectura | 6 |
| Frontend | 5.5 |
| Backend | 6 |
| Seguridad | 4 |
| Performance | 5 |
| Escalabilidad | 5 |
| Testing | 3 |
| Documentación | 4 |
| Mantenibilidad | 6 |
| Experiencia de usuario | 6.5 |
| Preparación para producción | 4 |

**Nota final estimada: 55/100 → clasificación: Alpha** (proyecto funcional con base sólida, pero con vulnerabilidades de seguridad activas, cero CI/CD y cobertura de tests insuficiente para llamarse "production ready"). Con los ítems P0 resueltos (≈1 semana de trabajo enfocado) pasaría razonablemente a rango **Beta (60-74)**.

---

## Checklist accionable

### Críticas (bloqueantes para producción real)
- [ ] Migrar JWT de localStorage a cookie HttpOnly+Secure+SameSite, con CSRF si aplica
- [ ] Corregir N+1 queries en `/me/stats`
- [ ] Añadir rate limiting (Flask-Limiter) a endpoints que llaman a Groq
- [ ] Añadir índices a columnas FK (`user_id`, `session_id`, `question_id`)
- [ ] Configurar CI básico (lint + test + build) en GitHub Actions

### Importantes
- [ ] Refresh tokens + revocación en logout
- [ ] Sentry en frontend y backend
- [ ] Tests para `cards.py`, `sessions.py`, `ai_service.py`
- [ ] Cambiar blueprint `debug` a allowlist explícito
- [ ] Validar `str(e)` no se expone en producción

### Recomendadas
- [ ] Extraer capa de servicios en backend (cards/sessions)
- [ ] Code-splitting de `CodeEditor` con `dynamic()`
- [ ] Caché de `stacks` (datos estáticos)
- [ ] Tests E2E con Playwright para el flujo principal
- [ ] `robots.txt` + `sitemap.xml`

### Opcionales
- [ ] Unificar nomenclatura ES/EN en componentes
- [ ] `ARCHITECTURE.md`, `API.md`, `SECURITY.md`, `CONTRIBUTING.md`
- [ ] Exportar progreso del usuario (PDF/CSV)
- [ ] Modo entrevista cronometrada
