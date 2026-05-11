#!/usr/bin/env bash
# Install and configure pm2-logrotate on the production VPS.
#
# Why: PM2's default behaviour appends to ~/.pm2/logs/*.log forever.
# With two long-running processes (civique + civique-web), these files
# can hit several GB in a few weeks and fill the disk on a small VPS.
#
# Usage (idempotent — safe to re-run):
#   bash /root/Civique/infra/setup-logrotate.sh
set -euo pipefail

echo "==> Installing pm2-logrotate module (no-op if already installed)..."
# `pm2 install` for a module is idempotent: it upgrades to latest if already
# present, and installs if missing. The redirect to /dev/null avoids noise.
pm2 install pm2-logrotate >/dev/null

echo "==> Configuring rotation policy..."
# 10 MB max per file. Most days fit comfortably; spikes (deploy storms,
# crash loops) trigger a rotation before the disk is at risk.
pm2 set pm2-logrotate:max_size 10M

# Keep 7 rotated archives. Combined with daily traffic that's roughly
# the last week of logs. Anything older we don't care about for SRE
# triage and we'd rather not pay disk for.
pm2 set pm2-logrotate:retain 7

# Gzip rotated files. Trade a few CPU cycles for ~10x disk savings.
pm2 set pm2-logrotate:compress true

# Daily date suffix so a single rotation per day stays readable in
# `ls -l ~/.pm2/logs`.
pm2 set pm2-logrotate:dateFormat YYYY-MM-DD

# Check every 30s — frequent enough to react to a sudden flood but
# not enough overhead to matter.
pm2 set pm2-logrotate:rotateInterval '*/30 * * * * *'

echo "==> Current config:"
pm2 conf pm2-logrotate || true

echo ""
echo "Done. Existing logs in ~/.pm2/logs will rotate at next 10 MB threshold."
echo "Run 'pm2 logs civique --lines 50' to verify everything still streams."
