# Fullstack Shop - Docker Setup

## Entwicklungsumgebung starten

```bash
# Alle Container starten
docker-compose up -d

# Logs anzeigen
docker-compose logs -f

# Container stoppen
docker-compose down

# Container stoppen und Volumes löschen (Datenbank zurücksetzen)
docker-compose down -v
```

## Services

- **Frontend**: http://localhost:3000 (Next.js)
- **Backend**: http://localhost:3001 (NestJS)
- **Database**: localhost:5432 (PostgreSQL)

## Datenbank Verbindung

- Host: `localhost` (von außen) oder `db` (zwischen Containern)
- Port: `5432`
- User: `postgres`
- Password: `postgres`
- Database: `shop_db`

## Hot-Reload

Alle Änderungen in `./backend` und `./frontend` werden automatisch übernommen.
