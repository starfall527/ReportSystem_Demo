@echo off
:start
choice /t 5 /d y /n >nul     ###定时5s
tasklist|find /i "node.exe"    ###寻找有无server1.exe进程
if %errorlevel%==0 (    ###如果存在该进程
echo "yes"
) else (    ###如果不存在,则自行启动server1.exe
echo "No"
start server1.exe
)
goto start