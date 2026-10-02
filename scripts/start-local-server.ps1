$ErrorActionPreference = "Stop"

$projectDirectory = Split-Path -Parent $PSScriptRoot
$nodeExecutable = (Get-Command node -ErrorAction Stop).Source
$runtimeDirectory = Join-Path $projectDirectory ".sites-runtime"
$logFile = Join-Path $runtimeDirectory "automatic-server.log"

if (Get-NetTCPConnection -LocalPort 5173 -State Listen -ErrorAction SilentlyContinue) {
  exit 0
}

if (-not (Test-Path -LiteralPath $nodeExecutable)) {
  throw "Node.js runtime was not found at $nodeExecutable"
}

New-Item -ItemType Directory -Force -Path $runtimeDirectory | Out-Null
Set-Location -LiteralPath $projectDirectory

& $nodeExecutable "scripts/run-framework.mjs" "dev" "--host" "127.0.0.1" "--port" "5173" *>> $logFile
