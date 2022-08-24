@echo off
:start
choice /t 5 /d y /n >nul
tasklist|find /i "node.exe"
if %errorlevel%==0 (
echo "yes"
) else (
echo "No"
start node.exe
)
goto start