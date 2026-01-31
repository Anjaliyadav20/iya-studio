@echo off
REM IYA Database Setup Script for Windows

echo.
echo ╔════════════════════════════════════════╗
echo ║  IYA Database Setup Script (Windows)   ║
echo ╚════════════════════════════════════════╝
echo.

REM Check if MySQL is installed
where mysql >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ MySQL is not installed or not in PATH
    echo Please install MySQL and add it to your system PATH
    pause
    exit /b 1
)

echo ✓ MySQL found
echo.

echo Creating database and tables...
echo.

REM Run SQL script
mysql -h localhost -u root < backend\database\schema.sql

if %errorlevel% equ 0 (
    echo.
    echo ✓ Database setup completed successfully!
    echo.
    echo Database Details:
    echo - Database Name: iya_studio
    echo - Host: localhost
    echo - User: root
    echo.
    echo Next step: Start your servers and register admin user
    echo Frontend: http://localhost:8081
    echo Backend: http://localhost:3001
    echo.
) else (
    echo.
    echo ❌ Failed to create database
    echo Make sure MySQL is running and you have the correct credentials
    echo.
)

pause
