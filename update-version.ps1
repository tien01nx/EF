param (
    [Parameter(Mandatory = $true)]
    [string]$NewVersion,
    
    [Parameter(Mandatory = $false)]
    [string]$Notes = "Phiên bản cập nhật mới"
)

# Đường dẫn tới file package.json
$packageJsonPath = ".\package.json"

# Đường dẫn tới file version.json
$versionJsonPath = ".\src\assets\version.json"

# Đọc nội dung file package.json
$packageJson = Get-Content $packageJsonPath -Raw | ConvertFrom-Json

# Cập nhật phiên bản
$packageJson.version = $NewVersion

# Ghi lại vào file
$packageJson | ConvertTo-Json -Depth 10 | Set-Content $packageJsonPath

# Tạo đối tượng version.json
$versionJson = @{
    version   = $NewVersion
    buildDate = (Get-Date).ToString("o")
    notes     = $Notes
}

# Ghi ra file version.json
$versionJson | ConvertTo-Json | Set-Content $versionJsonPath

Write-Host "Da cap nhat phien ban thanh $NewVersion"
Write-Host "Ghi chu: $Notes"
Write-Host "Thoi gian build: $($versionJson.buildDate)"

# Đề xuất các bước tiếp theo
Write-Host "`nCac buoc tiep theo:"
Write-Host "1. kiem tra lai cac file da duoc cap nhat"
Write-Host "2. Chay lenh 'npm run deploy' de trien khai ung dung"
Write-Host "3. Kiem tra ung dung tren IIS hoac server web cua ban"
