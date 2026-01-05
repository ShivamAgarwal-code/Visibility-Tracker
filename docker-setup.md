# Docker PostgreSQL Setup Guide

## Quick Start

### 1. Start PostgreSQL Database

```bash
# Start the database container
docker-compose up -d

# Check if it's running
docker-compose ps

# View logs
docker-compose logs -f postgres
```

### 2. Update .env File

Add this to your `.env` file:

```env
DATABASE_URL="postgresql://visibility_user:visibility_password@localhost:5432/visibility_tracker?schema=public"
```

### 3. Initialize Prisma

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations to create tables
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

## Docker Commands

### Start Database
```bash
docker-compose up -d
```

### Stop Database
```bash
docker-compose down
```

### Stop and Remove Data (⚠️ This deletes all data)
```bash
docker-compose down -v
```

### View Logs
```bash
docker-compose logs -f postgres
```

### Access PostgreSQL CLI
```bash
docker exec -it visibility-tracker-db psql -U visibility_user -d visibility_tracker
```

### Backup Database
```bash
docker exec visibility-tracker-db pg_dump -U visibility_user visibility_tracker > backup.sql
```

### Restore Database
```bash
docker exec -i visibility-tracker-db psql -U visibility_user visibility_tracker < backup.sql
```

## Database Connection Details

- **Host**: localhost
- **Port**: 5432
- **Database**: visibility_tracker
- **Username**: visibility_user
- **Password**: visibility_password
- **Connection String**: `postgresql://visibility_user:visibility_password@localhost:5432/visibility_tracker?schema=public`

## Troubleshooting

### Port Already in Use
If port 5432 is already in use, change it in `docker-compose.yml`:
```yaml
ports:
  - "5433:5432"  # Use 5433 instead
```

Then update `.env`:
```env
DATABASE_URL="postgresql://visibility_user:visibility_password@localhost:5433/visibility_tracker?schema=public"
```

### Reset Database
```bash
# Stop and remove containers and volumes
docker-compose down -v

# Start fresh
docker-compose up -d

# Re-run migrations
npx prisma migrate dev
```

