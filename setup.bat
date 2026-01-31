@echo off
REM IYA Studio - Quick Setup Script for Windows
REM This script helps initialize the MySQL database and start the development environment

echo.
echo ========================================
echo IYA Studio - MySQL Setup
echo ========================================
echo.

REM Check if MySQL is available
echo Checking MySQL availability...
where mysql >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: MySQL is not installed or not in PATH
    echo Please install MySQL and ensure it's available in system PATH
    echo.
    pause
    exit /b 1
)

echo MySQL found!
echo.

REM Database setup
echo Step 1: Setting up MySQL database...
echo Please enter MySQL root password when prompted:
mysql -u root -p < backend\database\schema.sql

if %errorlevel% neq 0 (
    echo ERROR: Failed to initialize database
    echo Make sure MySQL is running and credentials are correct
    pause
    exit /b 1
)

echo Database setup completed!
echo.

REM Backend setup
echo Step 2: Setting up backend...
if not exist backend\.env (
    echo Creating .env file from template...
    copy backend\.env.example backend\.env
    echo.
    echo Created backend\.env - Please edit it with your MySQL password!
    echo File: backend\.env
    echo.
    pause
) else (
    echo backend\.env already exists - skipping
)

echo.
echo Step 3: Installing dependencies...
echo Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies
    cd ..
    pause
    exit /b 1
)
cd ..

echo Installing frontend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo.
echo 1. Edit backend\.env and update MYSQL_PASSWORD with your MySQL root password
echo.
echo 2. Start the backend (Terminal 1):
echo    cd backend
echo    npm run dev
echo.
echo 3. Start the frontend (Terminal 2):
echo    npm run dev
echo.
echo 4. Open http://localhost:5173 in your browser
echo.
echo 5. Create an admin account and make the first user admin:
echo    UPDATE users SET is_admin = 1 WHERE email = 'your@email.com';
echo.
echo For detailed setup instructions, see: SETUP_GUIDE.md
echo.
pause
