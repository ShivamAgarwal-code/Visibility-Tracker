# PowerShell script to update .env file with correct DATABASE_URL

$envFile = ".env"
$correctDbUrl = 'DATABASE_URL="postgresql://visibility_user:visibility_password@localhost:5432/visibility_tracker?schema=public"'

Write-Host "Updating .env file with correct DATABASE_URL..." -ForegroundColor Cyan

if (Test-Path $envFile) {
    # Read current .env file
    $content = Get-Content $envFile -Raw
    
    # Check if DATABASE_URL exists
    if ($content -match 'DATABASE_URL\s*=') {
        Write-Host "Found existing DATABASE_URL, updating it..." -ForegroundColor Yellow
        # Replace existing DATABASE_URL
        $content = $content -replace 'DATABASE_URL\s*=.*', $correctDbUrl
    } else {
        Write-Host "Adding DATABASE_URL..." -ForegroundColor Yellow
        # Add DATABASE_URL if it doesn't exist
        if ($content -notmatch '\n\s*$') {
            $content += "`n"
        }
        $content += "$correctDbUrl`n"
    }
    
    # Write back to file
    Set-Content -Path $envFile -Value $content -NoNewline
    Write-Host "✅ Updated .env file successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "DATABASE_URL is now set to:" -ForegroundColor Cyan
    Write-Host $correctDbUrl -ForegroundColor Gray
} else {
    Write-Host "❌ .env file not found. Creating it..." -ForegroundColor Red
    $content = @"
# Google Gemini API Key (Required)
GEMINI_API_KEY=your_google_gemini_api_key_here

# Database URL (Required for Prisma)
$correctDbUrl

# Optional: Supabase Redirect URL
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
"@
    Set-Content -Path $envFile -Value $content
    Write-Host "✅ Created .env file with correct DATABASE_URL!" -ForegroundColor Green
}

Write-Host ""
Write-Host "Now you can run: npx prisma migrate dev --name init" -ForegroundColor Cyan

