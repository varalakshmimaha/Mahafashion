# PowerShell Script to Update PHP Configuration for Large File Uploads
# This script will backup and update your php.ini file

$phpIniPath = "C:\Users\varalakshmi\Downloads\php-8.3.30\php.ini"

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "  PHP Configuration Update Script" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

# Check if php.ini exists
if (-not (Test-Path $phpIniPath)) {
    Write-Host "ERROR: php.ini file not found at: $phpIniPath" -ForegroundColor Red
    exit 1
}

# Create backup
$backupPath = "$phpIniPath.backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
Write-Host "Creating backup: $backupPath" -ForegroundColor Yellow
Copy-Item $phpIniPath $backupPath
Write-Host "Backup created successfully!" -ForegroundColor Green
Write-Host ""

# Read the current php.ini content
$content = Get-Content $phpIniPath -Raw

# Update settings
Write-Host "Updating PHP settings..." -ForegroundColor Yellow

# Update upload_max_filesize
if ($content -match '(?m)^upload_max_filesize\s*=\s*\d+[KMG]') {
    $content = $content -replace '(?m)^upload_max_filesize\s*=\s*\d+[KMG]', 'upload_max_filesize = 64M'
    Write-Host "  ✓ Updated upload_max_filesize to 64M" -ForegroundColor Green
} elseif ($content -match '(?m)^;\s*upload_max_filesize\s*=\s*\d+[KMG]') {
    $content = $content -replace '(?m)^;\s*upload_max_filesize\s*=\s*\d+[KMG]', 'upload_max_filesize = 64M'
    Write-Host "  ✓ Uncommented and updated upload_max_filesize to 64M" -ForegroundColor Green
} else {
    Write-Host "  ! Could not find upload_max_filesize, adding it" -ForegroundColor Yellow
    $content += "`r`nupload_max_filesize = 64M"
}

# Update post_max_size
if ($content -match '(?m)^post_max_size\s*=\s*\d+[KMG]') {
    $content = $content -replace '(?m)^post_max_size\s*=\s*\d+[KMG]', 'post_max_size = 64M'
    Write-Host "  ✓ Updated post_max_size to 64M" -ForegroundColor Green
} elseif ($content -match '(?m)^;\s*post_max_size\s*=\s*\d+[KMG]') {
    $content = $content -replace '(?m)^;\s*post_max_size\s*=\s*\d+[KMG]', 'post_max_size = 64M'
    Write-Host "  ✓ Uncommented and updated post_max_size to 64M" -ForegroundColor Green
} else {
    Write-Host "  ! Could not find post_max_size, adding it" -ForegroundColor Yellow
    $content += "`r`npost_max_size = 64M"
}

# Update max_execution_time
if ($content -match '(?m)^max_execution_time\s*=\s*\d+') {
    $content = $content -replace '(?m)^max_execution_time\s*=\s*\d+', 'max_execution_time = 300'
    Write-Host "  ✓ Updated max_execution_time to 300" -ForegroundColor Green
} elseif ($content -match '(?m)^;\s*max_execution_time\s*=\s*\d+') {
    $content = $content -replace '(?m)^;\s*max_execution_time\s*=\s*\d+', 'max_execution_time = 300'
    Write-Host "  ✓ Uncommented and updated max_execution_time to 300" -ForegroundColor Green
}

# Update memory_limit
if ($content -match '(?m)^memory_limit\s*=\s*\d+[KMG]') {
    $currentMemory = [regex]::Match($content, '(?m)^memory_limit\s*=\s*(\d+)').Groups[1].Value
    if ([int]$currentMemory -lt 256) {
        $content = $content -replace '(?m)^memory_limit\s*=\s*\d+[KMG]', 'memory_limit = 256M'
        Write-Host "  ✓ Updated memory_limit to 256M" -ForegroundColor Green
    } else {
        Write-Host "  ✓ memory_limit is already sufficient" -ForegroundColor Green
    }
}

# Write updated content back to php.ini
$content | Set-Content $phpIniPath -NoNewline

Write-Host ""
Write-Host "PHP configuration updated successfully!" -ForegroundColor Green
Write-Host ""

# Verify changes
Write-Host "Verifying changes..." -ForegroundColor Yellow
$verification = php -r "echo 'upload_max_filesize: ' . ini_get('upload_max_filesize') . PHP_EOL; echo 'post_max_size: ' . ini_get('post_max_size') . PHP_EOL; echo 'max_execution_time: ' . ini_get('max_execution_time') . PHP_EOL; echo 'memory_limit: ' . ini_get('memory_limit') . PHP_EOL;"
Write-Host $verification -ForegroundColor Cyan

Write-Host ""
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "  IMPORTANT: Restart your development server!" -ForegroundColor Yellow
Write-Host "  Press Ctrl+C in your server terminal," -ForegroundColor Yellow
Write-Host "  then run: php artisan serve" -ForegroundColor Yellow
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backup saved at: $backupPath" -ForegroundColor Gray
