@echo off
REM ===================================================
REM SPARE PART Application Deployment Tool
REM Script tu dong trien khai ung dung
REM ===================================================

setlocal

REM In ra tieu de de de theo doi
echo ===================================================
echo SPARE PART Application Deployment Tool
echo ===================================================

REM Kiem tra tham so thu nhat (version) co ton tai khong
if "%~1"=="" (
    echo Error: Version parameter is required.
    echo Usage: deploy.bat [version] [notes] [deployPath]
    echo Example: deploy.bat 2.1.0 "New features added" "C:\IIS\Test\browser"
    exit /b 1
)

REM Gan tham so dong lenh vao bien
set VERSION=%~1
set NOTES=%~2
set DEPLOY_PATH=%~3

REM Neu khong nhap notes, dung gia tri mac dinh
if "%NOTES%"=="" (
    set NOTES=Phien ban cap nhat moi
)

REM Neu khong nhap duong dan trien khai, dung mac dinh
if "%DEPLOY_PATH%"=="" (
    set DEPLOY_PATH=C:\IIS\Test\browser
)

REM Hien thi thong tin truoc khi thuc hien trien khai
echo Starting deployment for version %VERSION%
echo Notes: %NOTES%
echo Deployment Path: %DEPLOY_PATH%
echo ===================================================

REM Goi script PowerShell de thuc hien viec trien khai
powershell -ExecutionPolicy Bypass -File .\deploy.ps1 -Version "%VERSION%" -Notes "%NOTES%" -DeployPath "%DEPLOY_PATH%"

REM Kiem tra neu script tra loi loi (ma loi khac 0) thi dung lai
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Deployment failed with error code %ERRORLEVEL%
    exit /b %ERRORLEVEL%
)

REM Neu thanh cong thi in thong bao hoan tat
echo.
echo Deployment completed successfully!
echo Package created: SPARE_PART_v%VERSION%.zip
echo Deployed to: %DEPLOY_PATH%
echo ===================================================

endlocal
