@echo off
chcp 65001 >nul
cd /d "D:\Claudecode项目\todo list"
start http://localhost:5173
echo 🚀 正在启动 Todo List...
echo 浏览器将自动打开 http://localhost:5173
echo 关闭此窗口即可停止服务
echo.
npm run dev
