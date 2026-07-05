# Plan API (Backend)

Backend FastAPI para la aplicación Plan de planificación financiera mensual.

## Stack

- **FastAPI** — API REST y documentación Swagger
- **PostgreSQL** — base de datos
- **SQLAlchemy 2** — ORM
- **Alembic** — migraciones
- **Pydantic v2** — validación y schemas

## Estructura

```
backend/
├── app/
│   ├── main.py              # Punto de entrada FastAPI
│   ├── core/                # Config, DB, seguridad JWT, dependencias
│   ├── api/v1/              # Router principal v1
│   └── modules/             # Módulos por entidad
│       ├── users/
│       ├── categories/
│       ├── months/
│       ├── incomes/
│       ├── obligations/
│       ├── investments/
│       ├── goals/
│       └── auth/            # JWT preparado (no implementado)
├── alembic/                 # Migraciones
├── docker-compose.yml       # PostgreSQL local
└── requirements.txt
```

Cada módulo contiene: `models.py`, `schemas.py`, `repository.py`, `service.py`, `router.py`.

## Requisitos

- Python 3.11+
- Docker (opcional, para PostgreSQL)

## Configuración

```bash
cd backend
cp .env.example .env
python -m venv .venv
.venv\Scripts\activate        # Windows
pip install -r requirements.txt
```

## Base de datos

```bash
docker compose up -d
alembic upgrade head
```

## Ejecutar

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Documentación API

| URL | Descripción |
|-----|-------------|
| http://localhost:8000/docs | Swagger UI |
| http://localhost:8000/redoc | ReDoc |
| http://localhost:8000/openapi.json | OpenAPI schema |
| http://localhost:8000/health | Health check |

## Endpoints (prefijo `/api/v1`)

| Recurso | Rutas |
|---------|-------|
| Auth | `GET /auth/status`, `POST /auth/token` (501), `POST /auth/register` (501) |
| Users | CRUD `/users` |
| Categories | CRUD `/categories` |
| Months | CRUD `/months` |
| Incomes | CRUD `/incomes` |
| Obligations | CRUD `/obligations` |
| Investments | CRUD `/investments` |
| Goals | CRUD `/goals` |

## Autenticación JWT

La infraestructura está preparada en `app/core/security.py` y `app/modules/auth/`:

- Generación y decodificación de tokens (`create_access_token`, `decode_access_token`)
- Hash de contraseñas (`hash_password`, `verify_password`)
- Dependencia `get_current_user` con fallback al usuario de desarrollo

**Estado actual:** los endpoints usan el usuario por defecto (`dev@plan.local`) hasta que se implemente login JWT.

## CORS

Configurado para el frontend React en `http://localhost:5173`. Editar `CORS_ORIGINS` en `.env`.

## Entidades

| Entidad | Descripción |
|---------|-------------|
| **User** | Usuario y preferencias (moneda, tema, metas mensuales) |
| **Category** | Categorías por tipo (income, obligation, investment) |
| **Month** | Mes de planificación (`YYYY-MM`) con objetivo de inversión |
| **Income** | Ingresos globales o ítems del plan mensual |
| **Obligation** | Obligaciones fijas o del mes |
| **Investment** | Movimientos de inversión |
| **Goal** | Objetivos de ahorro |

## Conectar con React

El frontend puede reemplazar `planApi.ts` apuntando a `http://localhost:8000/api/v1`.
