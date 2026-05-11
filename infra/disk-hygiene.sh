#!/usr/bin/env bash
# Disk hygiene — one-shot script to run when /
# starts getting full on the Hetzner VPS.
#
# Order matters: cheapest/safest cleanups first, then heavier ones.
# Each step is wrapped so a failure on one (e.g. docker not installed)
# doesn't abort the rest.
#
# Usage:
#   sudo bash /root/Civique/infra/disk-hygiene.sh
set -euo pipefail

echo "════════════════════════════════════════════════════"
echo "Civique disk-hygiene — $(date -Is)"
echo "════════════════════════════════════════════════════"

echo ""
echo "── BEFORE ─────────────────────────────────────────"
df -h /

# ── 1. pnpm content-addressable store ───────────────────────────
# pnpm keeps a global store at ~/.local/share/pnpm/store. Stale
# packages from past lockfiles accumulate after every dep upgrade.
echo ""
echo "── pnpm store prune ───────────────────────────────"
if command -v pnpm >/dev/null 2>&1; then
  pnpm store prune || echo "(pnpm store prune failed — continuing)"
else
  echo "(pnpm not installed — skipping)"
fi

# ── 2. PM2 logs ─────────────────────────────────────────────────
# pm2 flush truncates ~/.pm2/logs/*.log. Rotation handles this in
# the long run (see setup-logrotate.sh) but flush gives instant
# relief when the disk is already tight.
echo ""
echo "── pm2 flush ──────────────────────────────────────"
if command -v pm2 >/dev/null 2>&1; then
  pm2 flush || echo "(pm2 flush failed — continuing)"
else
  echo "(pm2 not installed — skipping)"
fi

# ── 3. APT cache ────────────────────────────────────────────────
# /var/cache/apt/archives accumulates .deb files after every
# `apt install`. Safe to drop, apt re-downloads on demand.
echo ""
echo "── apt clean ──────────────────────────────────────"
apt clean || echo "(apt clean failed — continuing)"

# ── 4. systemd journal ──────────────────────────────────────────
# /var/log/journal can grow to several GB. Keep last 7 days.
echo ""
echo "── journalctl --vacuum-time=7d ────────────────────"
journalctl --vacuum-time=7d || echo "(journalctl failed — continuing)"

# ── 5. Docker (if present) ──────────────────────────────────────
# Docker is currently NOT used in prod (we run PM2 + Postgres
# directly), but the host had it at one point — clean any leftovers.
echo ""
echo "── docker system prune ────────────────────────────"
if command -v docker >/dev/null 2>&1; then
  docker system prune -af --volumes || echo "(docker prune failed — continuing)"
else
  echo "(docker not installed — skipping)"
fi

# ── 6. /tmp ─────────────────────────────────────────────────────
# Find and delete files in /tmp older than 7 days. tmpfiles.d
# normally handles this but uploads + half-finished pg_dump output
# sometimes slip through.
echo ""
echo "── /tmp cleanup (files older than 7d) ─────────────"
find /tmp -mindepth 1 -mtime +7 -delete 2>/dev/null || true
echo "done"

# ── 7. Next.js build cache (Civique web) ────────────────────────
# .next/cache rebuilds on the next `pnpm --filter web build`.
# Wiping it costs ~30s of build time, gains 200-500 MB.
echo ""
echo "── /root/Civique/apps/web/.next/cache ─────────────"
if [ -d /root/Civique/apps/web/.next/cache ]; then
  rm -rf /root/Civique/apps/web/.next/cache
  echo "wiped"
else
  echo "(no cache dir — skipping)"
fi

# ── Final report ────────────────────────────────────────────────
echo ""
echo "── AFTER ──────────────────────────────────────────"
df -h /

echo ""
echo "Done. If disk is still > 80% used, check:"
echo "  du -sh /root/Civique /var/log /var/lib/postgresql"
echo "  du -sh /var/backups/civique   # backups grow ~50-500 MB / day"
