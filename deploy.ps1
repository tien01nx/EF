param (
    [Parameter(Mandatory = $true)]
    [string]$Version,
    
    [Parameter(Mandatory = $false)]
    [string]$Notes = "Phien ban cap nhat moi",

    [Parameter(Mandatory = $false)]
    [string]$DeployPath = "C:\IIS\Test\browser"
)

# Cau hinh de script dung lai neu co loi
$ErrorActionPreference = "Stop"

Write-Host "Bat dau trien khai phien ban $Version" -ForegroundColor Cyan
Write-Host "Ghi chu: $Notes" -ForegroundColor Cyan
Write-Host "Thu muc trien khai: $DeployPath" -ForegroundColor Cyan
Write-Host "---------------------------------------------------"

# Buoc 1: Cap nhat version.json bang script update-version.ps1
Write-Host "Buoc 1: Cap nhat thong tin phien ban..." -ForegroundColor Green
try {
    & .\update-version.ps1 -NewVersion $Version -Notes $Notes
    
    # Kiem tra xem file version.json da duoc tao/chinh sua chua
    if (-not (Test-Path -Path ".\src\assets\version.json")) {
        throw "Khong tim thay file version.json. Cap nhat that bai."
    }
}
catch {
    Write-Host "Loi khi cap nhat version: $_" -ForegroundColor Red
    exit 1
}

# Buoc 2: Build ung dung bang npm
Write-Host "Buoc 2: Build ung dung production..." -ForegroundColor Green
try {
    npm run build -- --configuration=production

    # Kiem tra thu muc build da ton tai chua
    if (-not (Test-Path -Path ".\dist\antd\browser")) {
        throw "Khong tim thay thu muc .\dist\antd\browser"
    }
}
catch {
    Write-Host "Loi khi build ung dung: $_" -ForegroundColor Red
    exit 1
}

# Buoc 3: Copy file web.config vao thu muc build
Write-Host "Buoc 3: Copy web.config vao dist folder..." -ForegroundColor Green
try {
    Copy-Item -Path .\web.config -Destination .\dist\antd\browser\web.config -Force
}
catch {
    Write-Host "Loi khi copy web.config: $_" -ForegroundColor Red
    exit 1
}

# Buoc 4: Tao ban sao du phong (backup) neu thu muc trien khai da ton tai
if (Test-Path -Path $DeployPath) {
    $backupPath = "$DeployPath-backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    Write-Host "Buoc 4: Tao backup tai $backupPath..." -ForegroundColor Green
    try {
        Copy-Item -Path $DeployPath -Destination $backupPath -Recurse -Force
    }
    catch {
        Write-Host "Canh bao: Khong tao duoc backup: $_" -ForegroundColor Yellow
        Write-Host "Tiep tuc trien khai..." -ForegroundColor Yellow
    }
}
else {
    Write-Host "Buoc 4: Thu muc trien khai chua ton tai, khong can backup." -ForegroundColor Yellow
    # Tao moi thu muc trien khai neu chua ton tai
    New-Item -ItemType Directory -Path $DeployPath -Force | Out-Null
}

# Buoc 5: Xoa noi dung cu va copy build moi vao thu muc trien khai
Write-Host "Buoc 5: Copy file vao thu muc trien khai $DeployPath..." -ForegroundColor Green
try {
    if (Test-Path -Path $DeployPath) {
        Get-ChildItem -Path $DeployPath -Recurse | Remove-Item -Force -Recurse
    }

    Copy-Item -Path ".\dist\antd\browser\*" -Destination $DeployPath -Recurse -Force
}
catch {
    Write-Host "Loi khi copy file vao thu muc IIS: $_" -ForegroundColor Red
    exit 1
}

# Buoc 6: Tao file ZIP chua build de luu tru
$iisFolder = Split-Path -Parent $DeployPath
$zipPath = "$iisFolder\SPARE_PART_v$Version.zip"
Write-Host "Buoc 6: Tao file ZIP tai $zipPath..." -ForegroundColor Green
try {
    Compress-Archive -Path ".\dist\antd\browser\*" -DestinationPath $zipPath -Force
}
catch {
    Write-Host "Loi khi tao file zip: $_" -ForegroundColor Red
    # Khong dung viec trien khai vi viec tao zip khong quan trong
}

# Ket thuc
Write-Host "---------------------------------------------------"
Write-Host "Trien khai thanh cong!" -ForegroundColor Green
Write-Host "Duong dan package: $zipPath" -ForegroundColor Cyan
Write-Host "Da trien khai den: $DeployPath" -ForegroundColor Cyan
Write-Host ""
Write-Host "Cac buoc can kiem tra tren IIS:" -ForegroundColor Yellow
Write-Host "1. Cau hinh MIME types cho dung" -ForegroundColor Yellow
Write-Host "2. Application pool dung .NET CLR la 'No Managed Code'" -ForegroundColor Yellow
Write-Host "3. Cai dat URL Rewrite tren IIS de routing dung" -ForegroundColor Yellow
Write-Host "---------------------------------------------------"
exit 0
