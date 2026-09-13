@echo off
REM ============================================================
REM  HealthAI Guardian - one-click launcher
REM  Double-click this file anytime to install (if needed)
REM  and start the dev server at http://localhost:8080
REM ============================================================
title HealthAI Guardian

REM Always run from the folder this .bat lives in
cd /d "%~dp0"

echo.
echo  ============================================
echo   HealthAI Guardian - starting...
echo  ============================================
echo.

REM 1) Check Node.js is installed
where node >nul 2>nul
if errorlevel 1 (
    echo  [ERROR] Node.js was not found.
    echo  Install it from https://nodejs.org/ (LTS version^), then run this file again.
    echo.
    pause
    exit /b 1
)

REM 2) Install dependencies on first run (or if folder deleted)
if not exist "node_modules" (
    echo  [1/2] Installing dependencies (first run only^)...
    call npm install
    if errorlevel 1 (
        echo.
        echo  [ERROR] npm install failed. Check your internet connection and try again.
        echo.
        pause
        exit /b 1
    )
) else (
    echo  [1/2] Dependencies already installed, skipping.
)

REM 3) Start the dev server and open it in the browser
echo  [2/2] Starting dev server at http://localhost:8080 ...
echo.
start "" "http://localhost:8080"
call npm run dev

echo.
echo  Dev server stopped.
pause
