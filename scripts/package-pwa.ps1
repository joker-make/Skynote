$ErrorActionPreference = "Stop"

$root = Resolve-Path -LiteralPath (Join-Path $PSScriptRoot "..")
$dist = Join-Path $root "dist"
$release = Join-Path $root "release"
$zip = Join-Path $release "skynote-pwa.zip"

if (-not (Test-Path -LiteralPath $dist)) {
  throw "dist not found. Run npm run build first."
}

New-Item -ItemType Directory -Force -Path $release | Out-Null

if (Test-Path -LiteralPath $zip) {
  Remove-Item -LiteralPath $zip -Force
}

$items = Get-ChildItem -LiteralPath $dist -Force
Compress-Archive -LiteralPath $items.FullName -DestinationPath $zip -Force

$file = Get-Item -LiteralPath $zip
Write-Output "Created $($file.FullName)"
Write-Output "Size $($file.Length) bytes"
