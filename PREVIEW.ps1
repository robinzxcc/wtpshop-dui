# Local DUI preview — http://127.0.0.1:8765/preview.html
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

$port = 8765
Write-Host "WTPSHOP DUI preview: http://127.0.0.1:$port/preview.html" -ForegroundColor Green
Write-Host "Ctrl+C to stop." -ForegroundColor DarkGray

if (Get-Command node -ErrorAction SilentlyContinue) {
    npx --yes serve . -l $port
    exit $LASTEXITCODE
}

if (Get-Command py -ErrorAction SilentlyContinue) {
    py -3 -m http.server $port
    exit $LASTEXITCODE
}

$py = Get-Command python -ErrorAction SilentlyContinue
if ($py -and $py.Source -notmatch "WindowsApps") {
    & $py.Source -m http.server $port
    exit $LASTEXITCODE
}

Write-Error "Install Node.js (recommended) or Python, then run this script again."
