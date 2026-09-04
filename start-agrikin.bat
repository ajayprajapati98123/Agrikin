@echo off
title AgriKin - Indian Agricultural Platform
echo ========================================================
echo   Starting ȺցɾìҠìղ (AgriKin) Server on Port 3000...
echo ========================================================
cd /d "%~dp0"
set PATH=C:\Program Files\nodejs;%PATH%
call npm run start
pause
