# Downloads the Ascensor Barón clip (CC BY 3.0, Kimako Studio, Wikimedia Commons)
# used in the "Motion" section's program monitor. Until it exists, the monitor shows its poster frame.
# Usage (from the Code folder):  powershell -ExecutionPolicy Bypass -File scripts/fetch-video.ps1

$out = Join-Path $PSScriptRoot '..\public\media\ascensor-baron.webm'
$src = 'https://upload.wikimedia.org/wikipedia/commons/transcoded/f/f1/Ascensor_Baron_video_vc.webm/Ascensor_Baron_video_vc.webm.480p.vp9.webm'

curl.exe -L -f -A "PortfolioAssetFetcher/1.0 (static site asset download)" --retry 3 --retry-delay 60 --retry-all-errors -o $out $src
if ($LASTEXITCODE -eq 0) { "Saved $out" } else { "Download failed (Wikimedia may be rate-limiting). Try again later." }
