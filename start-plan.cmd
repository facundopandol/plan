@echo off
REM Doble click para arrancar Plan
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-plan.ps1"
