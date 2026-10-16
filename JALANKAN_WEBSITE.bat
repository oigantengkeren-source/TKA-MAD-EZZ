@echo off
title TKA Made Easy — Server
cd /d "%~dp0"
echo ========================================================
echo   Menjalankan TKA Made Easy di http://localhost:8000
echo ========================================================
echo.
timeout /t 2 /nobreak >nul
start http://localhost:8000
python main.py
pause
