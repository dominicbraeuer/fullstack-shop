# Fullstack Shop

Minimalistischer Online-Shop mit NestJS Backend, Next.js Frontend und PostgreSQL Datenbank.

## Tech Stack

- **Backend:** NestJS
- **Frontend:** Next.js
- **Database:** PostgreSQL
- **Authentication:** JWT
- **Container:** Docker & Docker Compose

## Quick Start

```bash
# Container starten
docker compose up -d --build

# Logs anzeigen
docker compose logs -f

# Container stoppen
docker compose down
```

**Services:**

- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- Database: localhost:5432

## Project Status

### ✅ Setup

- [x] Git Repository erstellt
- [x] NestJS Backend Setup
- [x] Next.js Frontend Setup
- [x] Branch Protection auf GitHub
- [x] CI Workflow (Frontend & Backend Tests)
- [x] PostgreSQL mit Docker
- [x] CORS im Backend aktiviert
- [x] Docker Compose Setup

### ✅ Products (CRUD)

- [x] Product Entity (id, name, description, price)
- [x] REST API (GET, POST, PUT, DELETE)
- [x] PostgreSQL Integration
- [ ] Frontend: Products anzeigen
- [ ] Frontend: Product Form (Create/Update)
- [ ] Tests (Frontend & Backend)

### ❌ Orders (Optional)

- [ ] Order Entity (id, productIds, totalPrice, customerId)
- [ ] REST API (CRUD)
- [ ] PostgreSQL Integration
- [ ] Frontend: Orders anzeigen & Form
- [ ] Tests

### ❌ Customers

- [ ] Customer Entity (id, name, email, orderIds)
- [ ] REST API (CRUD)
- [ ] PostgreSQL Integration
- [ ] Frontend: Customers anzeigen & Form
- [ ] Tests

### ❌ Authentication (JWT)

- [ ] Password zu Customer Model hinzufügen
- [ ] Password Hashing (bcrypt)
- [ ] Login Endpoint
- [ ] JWT Token Generation
- [ ] Protected Routes (außer GET /products)
- [ ] User kann nur eigene Daten verwalten

### ❌ Deployment (Bonus)

- [x] Dockerfiles erstellt
- [x] docker-compose.yml
- [ ] Deployment auf Render

### ❌ Documentation (Bonus)

- [ ] Swagger API Dokumentation

## Development

```bash
# Backend Dependencies installieren (im Container)
docker compose exec backend npm install

# Frontend Dependencies installieren (im Container)
docker compose exec frontend npm install

# Backend neu bauen
docker compose up -d --build backend

# Datenbank zurücksetzen
docker compose down -v
```

## Database

**Connection Details:**

- Host: `db` (Container) / `localhost` (Host)
- Port: `5432`
- User: `postgres`
- Password: `postgres`
- Database: `shop_db`
