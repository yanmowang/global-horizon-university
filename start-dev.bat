@echo off
REM 设置环境变量
set PORT=5001
set REACT_APP_API_URL=http://localhost:5001

REM 终止所有Node进程避免端口冲突
taskkill /F /IM node.exe

REM 启动应用
npm run dev 