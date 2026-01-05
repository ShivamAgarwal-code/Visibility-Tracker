#!/bin/bash

# Bash script to set up PostgreSQL database in Docker

echo "🚀 Setting up PostgreSQL database in Docker..."

# Check if Docker is running
if ! docker ps > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

echo "✅ Docker is running"

# Start PostgreSQL container
echo ""
echo "📦 Starting PostgreSQL container..."
docker-compose up -d

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 5

# Check if container is running
if docker ps --filter "name=visibility-tracker-db" --format "{{.Status}}" | grep -q "Up"; then
    echo "✅ Database container is running"
else
    echo "❌ Database container failed to start. Check logs with: docker-compose logs postgres"
    exit 1
fi

# Check database health
echo ""
echo "🏥 Checking database health..."
if docker exec visibility-tracker-db pg_isready -U visibility_user -d visibility_tracker > /dev/null 2>&1; then
    echo "✅ Database is healthy and ready!"
else
    echo "⚠️  Database might still be starting. Wait a few seconds and try again."
fi

# Display connection info
echo ""
echo "📋 Database Connection Information:"
echo "   Host: localhost"
echo "   Port: 5432"
echo "   Database: visibility_tracker"
echo "   Username: visibility_user"
echo "   Password: visibility_password"
echo ""
echo "   Connection String:"
echo "   postgresql://visibility_user:visibility_password@localhost:5432/visibility_tracker?schema=public"

echo ""
echo "📝 Next Steps:"
echo "   1. Add DATABASE_URL to your .env file:"
echo "      DATABASE_URL=\"postgresql://visibility_user:visibility_password@localhost:5432/visibility_tracker?schema=public\""
echo "   2. Run: npx prisma generate"
echo "   3. Run: npx prisma migrate dev --name init"
echo ""
echo "✨ Setup complete!"

