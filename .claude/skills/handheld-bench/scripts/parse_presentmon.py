#!/usr/bin/env python3
"""Parse a PresentMon CSV and print average, 1% low and 0.1% low FPS as JSON.
Usage: python parse_presentmon.py capture.csv [--skip-seconds 5]
Works with PresentMon 1.x (msBetweenPresents) and 2.x (FrameTime / MsBetweenPresents) columns."""
import csv, json, sys, statistics
path = sys.argv[1]
skip = 5.0
if '--skip-seconds' in sys.argv:
    skip = float(sys.argv[sys.argv.index('--skip-seconds') + 1])
frames = []
with open(path, newline='', encoding='utf-8', errors='ignore') as f:
    rd = csv.DictReader(f)
    cols = {c.lower(): c for c in rd.fieldnames or []}
    ft = cols.get('frametime') or cols.get('msbetweenpresents') or cols.get('msbetweenpresents ')
    t0 = cols.get('timeinseconds') or cols.get('cputime') or cols.get('cpustarttime')
    if not ft:
        sys.exit('no frame-time column found; columns: ' + ', '.join(rd.fieldnames or []))
    for row in rd:
        try:
            ms = float(row[ft]); t = float(row[t0]) if t0 else None
        except (ValueError, KeyError):
            continue
        if ms <= 0: continue
        frames.append((t, ms))
if t0 and frames and frames[0][0] is not None:
    start = frames[0][0]
    frames = [(t, ms) for t, ms in frames if t is None or t - start >= skip]
ms = sorted(m for _, m in frames)
n = len(ms)
if n < 1000:
    sys.exit(json.dumps({'error': 'capture too short', 'frames': n}))
total_s = sum(ms) / 1000.0
avg = n / total_s
def low(pct):
    # 1% low = fps of the 99th-percentile frame time (slowest 1 percent)
    k = max(0, int(round(n * (1 - pct))) - 1)
    return 1000.0 / ms[k]
print(json.dumps({'frames': n, 'seconds': round(total_s, 1), 'avg_fps': round(avg, 1),
                  'low_1pct_fps': round(low(0.01), 1), 'low_0_1pct_fps': round(low(0.001), 1),
                  'skipped_first_seconds': skip}))
