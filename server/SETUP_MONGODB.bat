@echo off
REM MongoDB Backend Setup Script for Windows
REM Run this to set up the backend with MongoDB

echo.
echo 🚀 Smart School Hub - Backend MongoDB Setup
echo ==============================================
echo.

REM Navigate to server directory
cd /d "%~dp0" || exit /b

echo 📦 Installing dependencies...
call npm install

echo.
echo 📝 Environment setup...
if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env
    echo ✅ .env file created. Please update it with your MongoDB connection string.
    echo.
    echo Next steps:
    echo 1. Edit server\.env and add your MongoDB URI
    echo 2. Run: npm run dev (for development) or npm start (for production)
) else (
    echo ✅ .env file already exists
)

echo.
echo 🎯 Setup complete!
echo.
echo To start the backend:
echo   npm run dev       # Development mode (auto-reload)
echo   npm start         # Production mode
echo.
echo For more details, see: server/MONGODB_SETUP.md
echo.
pause
