@echo off
echo Finding process on port 3001...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001 ^| findstr LISTENING') do (
  echo Killing PID %%a
  taskkill /PID %%a /F
  goto :done
)
echo No process found on port 3001
:done
pause
