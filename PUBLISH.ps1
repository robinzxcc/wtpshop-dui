# One-time publish to https://robinzxcc.github.io/wtpshop-dui/
# Run in PowerShell:  cd $env:USERPROFILE\Downloads\wtpshop-dui; .\PUBLISH.ps1

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Host "Installing GitHub CLI..." -ForegroundColor Yellow
    winget install --id GitHub.cli -e --accept-source-agreements --accept-package-agreements
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
}

$auth = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "`nLog in to GitHub as robinzxcc (browser will open):" -ForegroundColor Cyan
    gh auth login -h github.com -p https -w
}

Write-Host "`nCreating repo robinzxcc/wtpshop-dui and pushing..." -ForegroundColor Cyan
gh repo create wtpshop-dui --public --source=. --remote=origin --push --description "WTPSHOP DUI for GitHub Pages"

Write-Host "`nEnabling GitHub Pages (main / root)..." -ForegroundColor Cyan
gh api repos/robinzxcc/wtpshop-dui/pages -X POST -f build_type=legacy -f source[branch]=main -f source[path]=/ 2>$null
if ($LASTEXITCODE -ne 0) {
    gh api repos/robinzxcc/wtpshop-dui/pages -X PUT -f build_type=legacy -f source[branch]=main -f source[path]=/ 2>$null
}

Write-Host "`nDone. Site (wait 1-3 min):" -ForegroundColor Green
Write-Host "  https://robinzxcc.github.io/wtpshop-dui/"
Write-Host "Lua URL is already: https://robinzxcc.github.io/wtpshop-dui/"
