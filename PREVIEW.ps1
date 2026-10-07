# Local DUI preview — http://127.0.0.1:8765/preview.html
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

$port = 8765
Write-Host "WTPSHOP DUI preview server on http://127.0.0.1:$port/preview.html" -ForegroundColor Green
Write-Host "Ctrl+C to stop." -ForegroundColor DarkGray

if (Get-Command python -ErrorAction SilentlyContinue) {
    python -m http.server $port
} elseif (Get-Command py -ErrorAction SilentlyContinue) {
    py -m http.server $port
} else {
    Write-Error "Install Python or open preview.html via: npx --yes serve . -p $port"
}
