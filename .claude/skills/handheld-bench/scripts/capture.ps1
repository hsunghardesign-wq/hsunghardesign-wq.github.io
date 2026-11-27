# Start a PresentMon capture for one game process and stop when the game exits.
# Usage: powershell -ExecutionPolicy Bypass -File capture.ps1 -Game "Cyberpunk2077.exe" -Out "C:\bench\cp2077_15W.csv"
param([Parameter(Mandatory=$true)][string]$Game,[Parameter(Mandatory=$true)][string]$Out)
$pm = Get-ChildItem -Path "$env:ProgramFiles\Intel\PresentMon","$env:LOCALAPPDATA\Programs\PresentMon","C:\PresentMon" -Filter "PresentMon*.exe" -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
if (-not $pm) { Write-Error "PresentMon not found. Install it from GitHub GameTechDev/PresentMon."; exit 1 }
New-Item -ItemType Directory -Force -Path (Split-Path $Out) | Out-Null
Write-Host "Capturing $Game to $Out with $($pm.FullName). Start the benchmark now; capture stops when the game closes."
& $pm.FullName -process_name $Game -output_file $Out -terminate_on_proc_exit -no_console_stats
Write-Host "Done: $Out"
