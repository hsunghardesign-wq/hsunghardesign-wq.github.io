---
name: handheld-bench
description: Run a benchmark sweep on the handheld this Claude session is running on (Windows: Claw A8, Legion Go 2, Legion Go, ROG Ally, Legion Go S, Xbox Ally) and log the results to the Handheld Benchmark Lab dashboard. Use when Hamza says "benchmark <game>", "run the sweep", "log a run", "test at 15 20 30 W", "3DMark this device", or asks how the device performs in a game. Captures frame times with PresentMon, computes average, 1% and 0.1% lows, reads 3DMark results, and writes runs to the dashboard's database under Hamza's sign-in.
---

# Handheld bench (measure on the device, log to the dashboard)

Dashboard: https://claude.ai/artifact/UCui1ksau6kUxkM4z7rqDC (owner: Hamza). Runs are written with the
ArtifactData tool to the viewer's private subtree, so this works for anyone the page is shared with as
a Contributor, not only Hamza.

## Before the first run on a device
1. Confirm you are running ON the handheld (Windows), not in the cloud: `hostname` and `wmic cpu get name`
   (or `Get-CimInstance Win32_Processor | select Name`). Match the CPU to a device id in the dashboard:
   - Ryzen Z2 Extreme → `msi-claw-a8` or `xbox-ally-x` or `legion-go-2` (ask which if the hostname is ambiguous)
   - Ryzen Z2 (base) → `legion-go-2-z2`; Z1 Extreme → `rog-ally` / `legion-go` / `rog-ally-x`
   - Ryzen Z2 Go → `legion-go-s-z2go`; Ryzen Z2 A → `xbox-ally`
2. Check PresentMon is present: `where PresentMon*` or look in `%ProgramFiles%\Intel\PresentMon`. If absent,
   tell Hamza to install Intel PresentMon (free, GitHub `GameTechDev/PresentMon`) and stop. Do not download
   binaries yourself.
3. Ask for the power limit the device is set to for this run (the number in MSI Center M, Legion Space or
   Armoury Crate). Never guess it. Sweep steps: 9, 12, 15, 18, 22, 25, 30, 35 W (skip what the device cannot do).

## Game run (built-in benchmark or a fixed 2 to 3 minute section)
1. Start capture: `scripts\capture.ps1 -Game "<process name>" -Out C:\bench\<game>_<watts>W.csv`
   (PresentMon with `-process_name <exe> -output_file <csv> -terminate_on_proc_exit -no_console_stats`).
2. Hamza launches the game and starts its built-in benchmark (Cyberpunk 2077, Monster Hunter Wilds and
   Batman: Arkham Knight have one). If there is none, he plays the same section every time and tells you
   when he is done; then stop PresentMon.
3. Parse: `python scripts\parse_presentmon.py C:\bench\<game>_<watts>W.csv` → average fps, 1% low, 0.1% low,
   frame count, duration. Refuse a capture under 60 seconds or under 1,000 frames.
4. Confirm with Hamza in one line: device, game, preset, resolution, upscaler, frame gen on/off, watts.
5. Write with ArtifactData: action "set", collection `data/users/me/profile/gameruns`, doc_id
   `<game-slug>-<watts>w-<yyyymmdd-hhmm>`, data
   `{device, game, preset, settings, tdp, avg, low1, lowx, date, createdAt, source:"presentmon"}`.
   Frame-gen runs must say so in `settings` ("FG: Lossless Scaling X2").

## 3DMark run
1. Hamza runs Time Spy (Windows) or Wild Life Extreme / Steel Nomad Light (cross-platform) in 3DMark.
2. Read the newest result: `%USERPROFILE%\Documents\3DMark\*.3dmark-result` is a zip; `Result.xml` inside has
   `<result><name>TimeSpyOverallScore</name><value>`. Use the overall score, never a sub-score.
3. Write with ArtifactData: collection `data/users/me/profile/runs`, data
   `{device, dataset:"ts"|"wle"|"snl"|"sb", score, tdp, notes, date, createdAt}`.

## Rules
- CONFIRMED means a run you captured; never type a number from memory or a review as a run.
- One wattage per run; the curve and knee point come from three or more.
- Report back per the plugin's benchmark-validation format: optimal (knee) wattage, fps and 1% low there,
  frame-gen settings if used, caveats.
- Never change power limits, drivers or settings yourself; tell Hamza what to set and wait.
