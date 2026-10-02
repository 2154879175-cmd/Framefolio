@echo off
cd /d "%~dp0"
set "NODE_EXE=node"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js was not found. Please install Node.js 22.13 or later.
  pause
  exit /b 1
)

start "" /min powershell.exe -NoProfile -WindowStyle Hidden -Command "for ($i = 0; $i -lt 40; $i++) { Start-Sleep -Milliseconds 500; if (Get-NetTCPConnection -LocalPort 5173 -State Listen -ErrorAction SilentlyContinue) { Start-Process 'http://127.0.0.1:5173/admin'; exit } }"

echo Framefolio is starting.
echo Keep this window open while using the website.
echo Website: http://127.0.0.1:5173/admin
echo.
"%NODE_EXE%" "scripts\run-framework.mjs" dev --host 127.0.0.1 --port 5173

echo.
echo The website server has stopped.
pause
