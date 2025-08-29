@echo off
title Creating pg-backup-gui Project Structure
echo ========================================
echo PostgreSQL Backup GUI - Project Setup
echo ========================================
echo.

REM ตรวจสอบว่าอยู่ในไดเรกทอรีที่ถูกต้อง
echo Current directory: %CD%
echo.

REM สร้างโครงสร้างไดเรกทอรีหลัก
echo Creating directory structure...
mkdir .github\workflows 2>nul
mkdir src\main 2>nul
mkdir src\renderer\components 2>nul
mkdir src\renderer\pages 2>nul
mkdir src\renderer\hooks 2>nul
mkdir src\renderer\contexts 2>nul
mkdir src\renderer\utils 2>nul
mkdir src\renderer\styles 2>nul
mkdir src\shared\types 2>nul
mkdir assets\icons 2>nul
mkdir assets\images 2>nul
mkdir docs 2>nul
mkdir scripts 2>nul
mkdir tests\unit 2>nul
mkdir tests\integration 2>nul

REM สร้างไฟล์เปล่าๆ
echo Creating empty files...
type nul > .gitignore
type nul > README.md
type nul > LICENSE
type nul > package.json
type nul > package-lock.json
type nul > tsconfig.json
type nul > tailwind.config.js
type nul > postcss.config.js
type nul > electron-builder.json
type nul > src\main\main.ts
type nul > src\main\ipcHandlers.ts
type nul > src\main\menu.ts
type nul > src\renderer\index.html
type nul > src\renderer\index.tsx
type nul > src\renderer\App.tsx
type nul > src\renderer\components\Header.tsx
type nul > src\renderer\components\Sidebar.tsx
type nul > src\renderer\components\Button.tsx
type nul > src\renderer\pages\Home.tsx
type nul > src\renderer\pages\ObjectSelector.tsx
type nul > src\renderer\pages\BackupProcess.tsx
type nul > src\renderer\pages\Settings.tsx
type nul > src\renderer\styles\globals.css
type nul > src\renderer\styles\components.css
type nul > src\shared\constants.ts
type nul > assets\icons\app-icon.png
type nul > assets\icons\logo.svg
type nul > assets\icons\favicon.ico
type nul > docs\architecture.md
type nul > docs\development.md
type nul > scripts\build.ts
type nul > scripts\dev.ts
type nul > tests\unit\placeholder.txt
type nul > tests\integration\placeholder.txt

REM สร้างเนื้อหาพื้นฐานสำหรับไฟล์สำคัญ
echo Creating basic content...

(
echo # PostgreSQL Backup GUI
echo.
echo PostgreSQL Database Backup Tool with Graphical User Interface
echo.
echo ## Features
echo - Selective backup of tables, views, materialized views, and functions
echo - Cross-platform support ^(Windows, Mac, Linux^)
echo - Beautiful and intuitive interface
echo - Connection profile management
echo - Selective object backup with checkbox interface
echo.
echo ## Quick Start
echo 1. Clone the repository
echo 2. Install dependencies: `npm install`
echo 3. Run development mode: `npm run dev`
echo.
echo ## Requirements
echo - Node.js 16+
echo - PostgreSQL client tools
) > README.md

(
echo node_modules/
echo dist/
echo *.log
echo .env
echo .env.local
echo *.tmp
echo build/
) > .gitignore

(
echo {
echo   "name": "pg-backup-gui",
echo   "version": "1.0.0",
echo   "description": "PostgreSQL Database Backup Tool with GUI",
echo   "main": "dist/main/main.js",
echo   "scripts": {
echo     "dev": "concurrently \"npm run dev:main\" \"npm run dev:renderer\"",
echo     "dev:main": "nodemon --exec electron -r ts-node/register src/main/main.ts",
echo     "dev:renderer": "vite",
echo     "build": "npm run build:main && npm run build:renderer",
echo     "build:main": "tsc -p tsconfig.main.json",
echo     "build:renderer": "vite build",
echo     "package": "npm run build && electron-builder",
echo     "test": "jest"
echo   },
echo   "dependencies": {
echo     "electron": "^latest",
echo     "react": "^18.2.0",
echo     "react-dom": "^18.2.0"
echo   },
echo   "devDependencies": {
echo     "typescript": "^5.0.0",
echo     "vite": "^4.0.0",
echo     "tailwindcss": "^3.3.0",
echo     "@types/react": "^18.0.0",
echo     "@types/node": "^18.0.0",
echo     "concurrently": "^7.0.0",
echo     "nodemon": "^2.0.0"
echo   }
echo }
) > package.json

echo {
echo   "name": "pg-backup-gui",
echo   "productName": "PostgreSQL Backup GUI", 
echo   "appId": "com.pgbackup.gui",
echo   "directories": {
echo     "output": "dist-electron"
echo   },
echo   "files": [
echo     "dist/**/*",
echo     "dist-electron/**/*"
echo   ],
echo   "win": {
echo     "target": "nsis"
echo   },
echo   "mac": {
echo     "category": "public.app-category.developer-tools"
echo   },
echo   "linux": {
echo     "target": "AppImage"
echo   }
echo }
} > electron-builder.json

echo # Workflow
echo name: CI/CD Pipeline
echo on:
echo   push:
echo     branches: [ main, develop ]
echo   pull_request:
echo     branches: [ main ]
echo.
echo jobs:
echo   test:
echo     runs-on: ubuntu-latest
echo     steps:
echo       - uses: actions/checkout@v3
echo       - name: Setup Node.js
echo         uses: actions/setup-node@v3
echo         with:
echo           node-version: '18'
echo       - name: Install dependencies
echo         run: npm ci
echo       - name: Run tests
echo         run: npm test
} > .github\workflows\ci.yml

echo Project structure created successfully!
echo.
echo Created files and directories:
dir /s /b | findstr /v "setup-project.bat"
echo.
echo Next steps:
echo 1. Run: npm install
echo 2. Run: npm run dev
echo.
pause