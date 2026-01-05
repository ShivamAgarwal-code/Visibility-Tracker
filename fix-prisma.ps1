# PowerShell script to fix Prisma permission errors

Write-Host "Fixing Prisma permission issues..." -ForegroundColor Cyan

# Stop any running Node processes that might be locking files
Write-Host "`nChecking for running Node processes..." -ForegroundColor Yellow
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue

if ($nodeProcesses) {
    Write-Host "Found $($nodeProcesses.Count) Node process(es)" -ForegroundColor Yellow
    $stop = Read-Host "Would you like to stop them? (Y/N)"
    if ($stop -eq "Y" -or $stop -eq "y") {
        $nodeProcesses | Stop-Process -Force
        Write-Host "Stopped Node processes" -ForegroundColor Green
        Start-Sleep -Seconds 2
    }
} else {
    Write-Host "No Node processes found" -ForegroundColor Green
}

# Try to remove the locked file
$prismaClientPath = "node_modules\.prisma\client"
$queryEnginePath = Join-Path $prismaClientPath "query_engine-windows.dll.node"

if (Test-Path $queryEnginePath) {
    Write-Host "`nAttempting to remove locked Prisma files..." -ForegroundColor Yellow
    try {
        Remove-Item -Path "$queryEnginePath*" -Force -ErrorAction SilentlyContinue
        Remove-Item -Path "$prismaClientPath\*.tmp*" -Force -ErrorAction SilentlyContinue
        Write-Host "Cleaned up Prisma files" -ForegroundColor Green
    } catch {
        Write-Host "Could not remove files (they may be in use)" -ForegroundColor Yellow
    }
}

# Remove .prisma folder entirely and regenerate
Write-Host "`nRemoving .prisma folder..." -ForegroundColor Yellow
if (Test-Path $prismaClientPath) {
    try {
        Remove-Item -Path $prismaClientPath -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "Removed .prisma folder" -ForegroundColor Green
    } catch {
        Write-Host "Could not remove .prisma folder completely" -ForegroundColor Yellow
    }
}

Write-Host "`nNow try running: npx prisma generate" -ForegroundColor Cyan
Write-Host "If it still fails, try:" -ForegroundColor Yellow
Write-Host "1. Close your IDE/editor (VS Code, etc.)" -ForegroundColor White
Write-Host "2. Close any running dev servers (npm run dev)" -ForegroundColor White
Write-Host "3. Run: npx prisma generate" -ForegroundColor White

