# Nodejs MYSQL REST API

### Installation

```
git clone https://github.com/fazt/nodejs-mysql-restapi
cd nodejs-mysql-restapi
npm install
Copy-Item .env.example .env
npm run dev
```

### Database setup (MySQL)

This project expects a database named `bitclick` (see `db/database.sql`).

- **Option A (Docker)**: run MySQL via `docker-compose.yml` (requires Docker Desktop).
- **Option B (Local MySQL)**: create the database and tables by running `db/database.sql` in your MySQL server
  (Workbench / phpMyAdmin / `mysql` CLI).

### Endpoints (Bitclick)

- `POST /api/usuarios` (inserta en tabla `usuarios`)
- `POST /api/sesiones` (inserta en tabla `sesiones`)

Ejemplos:

```bash
curl -X POST http://localhost:3000/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{"nombre_completo":"Juan Perez","tipo_documento_codigo":"CC","numero_documento":"123","email":"juan.perez@example.com","telefono":"3001234567","password":"Secreta123"}'

curl -X POST http://localhost:3000/api/sesiones \
  -H "Content-Type: application/json" \
  -d '{"email":"juan.perez@example.com","password":"Secreta123"}'
```

### TODO

- [ ] upload images
- [ ] create authentication and authorization
- [ ] add validation
- [ ] improve error handling
- [ ] complete the tests
- [ ] docker for production
