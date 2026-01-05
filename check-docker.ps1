# PowerShell script to check Docker status and provide helpful instructions

Write-Host "Checking Docker status..." -ForegroundColor Cyan

# Check if Docker is installed
try {
    $dockerVersion = docker --version 2>&1
    Write-Host "Docker is installed: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "Docker is not installed. Please install Docker Desktop from:" -ForegroundColor Red
    Write-Host "https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    exit 1
}

# Check if Docker daemon is running
try {
    $null = docker info 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Docker daemon is running" -ForegroundColor Green
        Write-Host ""
        Write-Host "You can now run: docker-compose up -d" -ForegroundColor Cyan
    } else {
        throw "Docker daemon not running"
    }
} catch {
    Write-Host "Docker daemon is not running" -ForegroundColor Red
    Write-Host ""
    Write-Host "To fix this:" -ForegroundColor Yellow
    Write-Host "1. Open Docker Desktop application" -ForegroundColor White
    Write-Host "2. Wait for it to fully start (whale icon in system tray)" -ForegroundColor White
    Write-Host "3. Run this script again or run: docker-compose up -d" -ForegroundColor White
    Write-Host ""
    Write-Host "Tip: You can start Docker Desktop from Start Menu" -ForegroundColor Cyan
    
    # Try to find Docker Desktop executable
    $dockerPaths = @(
        "${env:ProgramFiles}\Docker\Docker\Docker Desktop.exe",
        "${env:ProgramFiles(x86)}\Docker\Docker\Docker Desktop.exe",
        "$env:LOCALAPPDATA\Docker\Docker Desktop.exe"
    )
    
    foreach ($path in $dockerPaths) {
        if (Test-Path $path) {
            Write-Host ""
            Write-Host "Found Docker Desktop at: $path" -ForegroundColor Green
            $start = Read-Host "Would you like to start Docker Desktop now? (Y/N)"
            if ($start -eq "Y" -or $start -eq "y") {
                Start-Process $path
                Write-Host "Starting Docker Desktop... Please wait for it to fully start, then run docker-compose up -d" -ForegroundColor Yellow
            }
            break
        }
    }
    
    exit 1
}
