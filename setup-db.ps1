# PowerShell script to set up PostgreSQL database in Docker

Write-Host "🚀 Setting up PostgreSQL database in Docker..." -ForegroundColor Cyan

# Check if Docker is running
try {
    docker ps | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}

# Start PostgreSQL container
Write-Host "`n📦 Starting PostgreSQL container..." -ForegroundColor Cyan
docker-compose up -d

# Wait for database to be ready
Write-Host "⏳ Waiting for database to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Check if container is running
$containerStatus = docker ps --filter "name=visibility-tracker-db" --format "{{.Status}}"
if ($containerStatus) {
    Write-Host "✅ Database container is running: $containerStatus" -ForegroundColor Green
} else {
    Write-Host "❌ Database container failed to start. Check logs with: docker-compose logs postgres" -ForegroundColor Red
    exit 1
}

# Check database health
Write-Host "`n🏥 Checking database health..." -ForegroundColor Cyan
$healthCheck = docker exec visibility-tracker-db pg_isready -U visibility_user -d visibility_tracker
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Database is healthy and ready!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Database might still be starting. Wait a few seconds and try again." -ForegroundColor Yellow
}

# Display connection info
Write-Host "`n📋 Database Connection Information:" -ForegroundColor Cyan
Write-Host "   Host: localhost" -ForegroundColor White
Write-Host "   Port: 5432" -ForegroundColor White
Write-Host "   Database: visibility_tracker" -ForegroundColor White
Write-Host "   Username: visibility_user" -ForegroundColor White
Write-Host "   Password: visibility_password" -ForegroundColor White
Write-Host "`n   Connection String:" -ForegroundColor White
Write-Host "   postgresql://visibility_user:visibility_password@localhost:5432/visibility_tracker?schema=public" -ForegroundColor Gray

Write-Host "`n📝 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Add DATABASE_URL to your .env file:" -ForegroundColor White
Write-Host "      DATABASE_URL=`"postgresql://visibility_user:visibility_password@localhost:5432/visibility_tracker?schema=public`"" -ForegroundColor Gray
Write-Host "   2. Run: npx prisma generate" -ForegroundColor White
Write-Host "   3. Run: npx prisma migrate dev --name init" -ForegroundColor White
Write-Host "`n✨ Setup complete!" -ForegroundColor Green

