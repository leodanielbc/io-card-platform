# IO Card Platform

Sistema de emisión de tarjetas para IO Neobanco, implementado con arquitectura basada en eventos.

## Arquitectura

```
POST /api/cards/issue
        │
        ▼
  card-issuer          → valida, persiste, publica evento
        │
        │  io.card.requested.v1 (Kafka)
        ▼
  card-processor       → procesa, emite tarjeta, persiste
        │
        ├─ éxito  → io.cards.issued.v1
        └─ fallo  → io.card.requested.v1.dlq (tras 3 reintentos)
```

Cada servicio sigue **Clean Architecture** (domain → application → infrastructure → presentation) con principios **SOLID**.

```
apps/
├── card-issuer/     REST API — recibe solicitudes, publica evento PENDING
└── card-processor/  Consumer — procesa emisión, reintenta con backoff exponencial

packages/
└── shared/          Tipos compartidos, CloudEvents, topics Kafka
```

## Tecnologías

| Capa | Tecnología |
|---|---|
| Runtime | Node.js 20 + TypeScript |
| API | Express 5 |
| Mensajería | Apache Kafka (KRaft) via KafkaJS |
| Base de datos | PostgreSQL 16 via Prisma 7 |
| Validación | Zod 4 |
| Contenedores | Docker + Docker Compose |

## Requisitos

- Docker y Docker Compose
- Node.js >= 20 (solo para desarrollo local)

## Ejecución

### Todo con Docker

```bash
docker compose up --build
```

Levanta Kafka, PostgreSQL, crea topics y bases de datos, corre migraciones y arranca ambos servicios.

### Desarrollo local

**1. Infraestructura**
```bash
docker compose up kafka postgres kafka-init
```

**2. Variables de entorno**

`apps/card-issuer/.env`
```
PORT=3001
SERVICE_NAME=card-issuer
KAFKA_BROKERS=localhost:9092
DATABASE_URL=postgresql://io_user:io_password@localhost:5432/card_issuer?schema=public
KAFKAJS_NO_PARTITIONER_WARNING=1
```

`apps/card-processor/.env`
```
SERVICE_NAME=card-processor
KAFKA_BROKERS=localhost:9092
DATABASE_URL=postgresql://io_user:io_password@localhost:5432/card_processor?schema=public
KAFKAJS_NO_PARTITIONER_WARNING=1
```

> Las variables de entorno en `.env` son solo para desarrollo local. En Docker, las env vars son inyectadas por `docker-compose.yml` y los archivos `.env` son ignorados por `.dockerignore`.

**3. Migraciones**
```bash
cd apps/card-issuer && npx prisma migrate deploy
cd apps/card-processor && npx prisma migrate deploy
```

**4. Servicios**
```bash
npm run dev --workspace=apps/card-issuer
npm run dev --workspace=apps/card-processor
```

## API

### POST /api/cards/issue

```json
{
  "customer": {
    "documentType": "DNI",
    "documentNumber": "11654321",
    "email": "jose@example.com",
    "age": 25
  },
  "product": {
    "type": "VISA",
    "currency": "PEN"
  },
  "forceError": false
}
```

**Respuesta exitosa (202)**
```json
{
  "requestId": "uuid",
  "status": "PENDING"
}
```

**Errores de dominio**
| Código | HTTP | Descripción |
|---|---|---|
| `DUPLICATE_CARD_REQUEST` | 409 | El cliente ya tiene una tarjeta solicitada |
| `UNDERAGE_APPLICANT` | 422 | El solicitante es menor de 18 años |
| `INVALID_EMAIL` | 422 | Formato de email inválido |

## Flujo de reintentos

Si el procesamiento falla, `card-processor` reintenta con backoff exponencial:

```
intento 1 → falla → espera 1s
intento 2 → falla → espera 2s
intento 3 → falla → espera 4s
intento 4 → falla → publica en DLQ
```

Usar `"forceError": true` en el request para forzar este comportamiento.

## Base de datos

```
card_issuer
├── customers         (id, document_number UQ, email UQ, age)
└── card_requests     (id, customer_id FK, status, card_type, currency)

card_processor
└── cards             (id, request_id UQ, customer_id UQ, card_number, expiry_date)
```

## Verificación de base de datos

```bash
# Conectarse a card_issuer
docker exec -it io-postgres psql -U io_user -d card_issuer

# Conectarse a card_processor
docker exec -it io-postgres psql -U io_user -d card_processor
```

Consultas útiles una vez dentro de `psql`:

```sql
-- Ver clientes registrados
SELECT * FROM customers;

-- Ver solicitudes de tarjeta
SELECT * FROM card_requests;

-- Ver tarjetas emitidas (en card_processor)
SELECT id, request_id, customer_id, card_number, card_type, currency, status, issued_at FROM cards;

-- Salir
\q
```

## Monitoreo de eventos Kafka

```bash
# Tarjetas emitidas
docker exec -it io-kafka kafka-console-consumer \
  --bootstrap-server localhost:9092 \
  --topic io.cards.issued.v1 --from-beginning

# Solicitudes en DLQ
docker exec -it io-kafka kafka-console-consumer \
  --bootstrap-server localhost:9092 \
  --topic io.card.requested.v1.dlq --from-beginning
```
