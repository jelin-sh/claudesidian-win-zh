@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo 🚀 Claudesidian 安装脚本
echo ==========================
echo.

REM 检查必需工具
echo 检查必需工具...
echo.

where git >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Git 未安装
    set GIT_OK=0
) else (
    echo ✅ Git 已安装
    set GIT_OK=1
)

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js 未安装
    set NODE_OK=0
) else (
    echo ✅ Node.js 已安装
    set NODE_OK=1
)

where pnpm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ pnpm 未安装
    set PNPM_OK=0
) else (
    echo ✅ pnpm 已安装
    set PNPM_OK=1
)

REM 检查可选工具
echo.
echo 检查可选工具...
where yt-dlp >nul 2>nul
if %errorlevel% neq 0 (
    echo    → 安装方法: winget install yt-dlp ^(用于 YouTube 转录^)
) else (
    echo ✅ yt-dlp 已安装
)

where jq >nul 2>nul
if %errorlevel% neq 0 (
    echo    → 安装方法: winget install jq ^(用于 JSON 处理^)
) else (
    echo ✅ jq 已安装
)

where rg >nul 2>nul
if %errorlevel% neq 0 (
    echo    → 安装方法: winget install ripgrep ^(用于更好的搜索^)
) else (
    echo ✅ ripgrep 已安装
)

echo.

REM 如果需要,安装 pnpm
if %PNPM_OK%==0 (
    echo 📦 正在安装 pnpm...
    call npm install -g pnpm
    echo ✅ pnpm 已安装
)

REM 安装依赖
echo 📦 正在安装依赖...
call pnpm install

REM 创建必要的目录
echo.
echo 📁 正在创建文件夹结构...
if not exist "00_Inbox" mkdir "00_Inbox"
if not exist "01_Projects" mkdir "01_Projects"
if not exist "02_Areas" mkdir "02_Areas"
if not exist "03_Resources" mkdir "03_Resources"
if not exist "04_Archive" mkdir "04_Archive"
if not exist "05_Attachments\Organized" mkdir "05_Attachments\Organized"
if not exist "06_Metadata\Reference" mkdir "06_Metadata\Reference"
if not exist "06_Metadata\Templates" mkdir "06_Metadata\Templates"
echo ✅ 文件夹已创建

REM Git 设置
if %GIT_OK%==1 (
    if not exist ".git" (
        echo.
        echo 🔧 正在初始化 Git 仓库...
        git init
        git add .
        git commit -m "初始化仓库设置"
        echo ✅ Git 仓库已初始化
    )
)

REM Gemini API 设置
echo.
echo 🔮 Gemini Vision 设置^(可选^)
echo ===============================
echo.
echo 要启用图片和文档分析功能:
echo 1. 从以下地址获取免费 API 密钥: https://aistudio.google.com/apikey
echo 2. 在 Windows 中设置环境变量:
echo.
echo    setx GEMINI_API_KEY "your-key-here"
echo.
echo 3. 重启终端或 Claude Code
echo 4. 测试配置: pnpm test-gemini
echo.

REM Obsidian 检查
echo 📝 Obsidian 设置
echo ================
if exist "C:\Users\%USERNAME%\AppData\Local\Obsidian\Obsidian.exe" (
    echo ✅ 检测到 Obsidian
    echo    在 Obsidian 中将此文件夹打开为一个仓库
) else (
    echo 📥 从以下地址下载 Obsidian: https://obsidian.md
    echo    然后在 Obsidian 中将此文件夹打开为一个仓库
)

echo.
echo 🎉 安装完成!
echo ============
echo.
echo 下一步:
echo 1. 在此目录中启动 Claude Code: claude
echo 2. 阅读 00_Inbox/ 中的欢迎笔记
echo 3. 试用: /thinking-partner ^(在 Claude Code 中^)
echo.
echo 祝你使用愉快! 🧠✨

pause
