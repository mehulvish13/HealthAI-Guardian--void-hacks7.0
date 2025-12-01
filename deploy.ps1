# Quick Deploy Script for HealthAI Guardian (PowerShell)

Write-Host "🚀 HealthAI Guardian - Quick Deploy" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Check if environment variable is set
if (-not $env:VITE_GEMINI_API_KEY) {
    Write-Host "⚠️  WARNING: VITE_GEMINI_API_KEY not set!" -ForegroundColor Yellow
    Write-Host "Please set it before deploying:" -ForegroundColor Yellow
    Write-Host '  $env:VITE_GEMINI_API_KEY="your-key"' -ForegroundColor Yellow
    Write-Host ""
    $continue = Read-Host "Continue anyway? (y/N)"
    if ($continue -ne "y" -and $continue -ne "Y") {
        exit 1
    }
}

# Build the project
Write-Host "📦 Building production bundle..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed! Fix errors and try again." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build successful!" -ForegroundColor Green
Write-Host ""

# Ask user which platform to deploy to
Write-Host "Choose deployment platform:" -ForegroundColor Cyan
Write-Host "1) Vercel (Recommended - Fastest)"
Write-Host "2) Netlify"
Write-Host "3) Preview locally (npm run preview)"
Write-Host "4) Exit"
Write-Host ""
$choice = Read-Host "Enter choice (1-4)"

switch ($choice) {
    1 {
        Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Yellow
        if (Get-Command vercel -ErrorAction SilentlyContinue) {
            vercel --prod
        } else {
            Write-Host "Installing Vercel CLI..." -ForegroundColor Yellow
            npm i -g vercel
            vercel --prod
        }
    }
    2 {
        Write-Host "🚀 Deploying to Netlify..." -ForegroundColor Yellow
        if (Get-Command netlify -ErrorAction SilentlyContinue) {
            netlify deploy --prod
        } else {
            Write-Host "Installing Netlify CLI..." -ForegroundColor Yellow
            npm i -g netlify-cli
            netlify deploy --prod
        }
    }
    3 {
        Write-Host "🔍 Starting preview server..." -ForegroundColor Yellow
        npm run preview
    }
    4 {
        Write-Host "Exiting..." -ForegroundColor Gray
        exit 0
    }
    default {
        Write-Host "❌ Invalid choice" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "🎉 Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Remember to:" -ForegroundColor Yellow
Write-Host "  - Set VITE_GEMINI_API_KEY in platform dashboard"
Write-Host "  - Test all features on live site"
Write-Host "  - Monitor API usage at https://ai.dev/usage"
Write-Host ""
