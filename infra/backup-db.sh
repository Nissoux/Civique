#!/usr/bin/env bash
# Daily Postgres backup for the Civique production database.
#
# What it does:
#   1. Reads DATABASE_URL from /root/Civique/.env
#   2. pg_dump to /var/backups/civique/civique-YYYY-MM-DD.sql.gz
#   3. Deletes backups older than 14 days
#
# Install on the VPS:
#   sudo mkdir -p /var/backups/civique
#   sudo chown root:root /var/backups/civique
#   sudo chmod 700 /var/backups/civique
#   crontab -e
#     0 3 * * * /root/Civique/infra/backup-db.sh >> /var/log/civique-backup.log 2>&1
#
# Restore procedure (verified May 2026):
#   # 1. Pick a backup:
#   ls -lh /var/backups/civique/
#   # 2. Stop the backend so it doesn't write during restore:
#   pm2 stop civique
#   # 3. Drop and recreate the DB (CAREFUL — this wipes the current data):
#   sudo -u postgres psql -c "DROP DATABASE civique;"
#   sudo -u postgres psql -c "CREATE DATABASE civique OWNER civique;"
#   # 4. Restore:
#   gunzip -c /var/backups/civique/civique-2026-05-10.sql.gz | \
#     sudo -u postgres psql civique
#   # 5. Restart backend:
#   pm2 start civique
#   pm2 logs civique --lines 50   # verify no schema mismatches
#
# Smoke-test (no destructive ops) — restore into a temp DB:
#   sudo -u postgres createdb civique_restore_test
#   gunzip -c /var/backups/civique/civique-YYYY-MM-DD.sql.gz | \
#     sudo -u postgres psql civique_restore_test
#   sudo -u postgres psql civique_restore_test -c "SELECT count(*) FROM users;"
#   sudo -u postgres dropdb civique_restore_test
set -euo pipefail

ENV_FILE="/root/Civique/.env"
BACKUP_DIR="/var/backups/civique"
RETAIN_DAYS=14
DATE="$(date +%F)"  # YYYY-MM-DD
OUT_FILE="${BACKUP_DIR}/civique-${DATE}.sql.gz"

# ── 1. Sanity checks ────────────────────────────────────────────
if [ ! -f "$ENV_FILE" ]; then
  echo "ERROR: $ENV_FILE not found" >&2
  exit 1
fi

# Source DATABASE_URL without leaking other secrets into the env.
# grep + cut avoids running arbitrary .env content as shell.
DATABASE_URL="$(grep -E '^DATABASE_URL=' "$ENV_FILE" | head -n1 | cut -d= -f2- | tr -d '"' | tr -d "'")"

if [ -z "${DATABASE_URL:-}" ]; then
  echo "ERROR: DATABASE_URL not set in $ENV_FILE" >&2
  exit 1
fi

mkdir -p "$BACKUP_DIR"
chmod 700 "$BACKUP_DIR"

# ── 2. Dump ─────────────────────────────────────────────────────
echo "[$(date -Is)] pg_dump → $OUT_FILE"

# --no-owner / --no-privileges keeps the dump portable across
# environments (avoids GRANT statements tied to local roles).
# -Fp produces plain SQL, which is the easiest to gunzip + psql back.
pg_dump \
  --dbname="$DATABASE_URL" \
  --no-owner \
  --no-privileges \
  --format=plain \
  | gzip -9 > "${OUT_FILE}.tmp"

# Atomic rename so we never see a half-written file in the dir.
mv "${OUT_FILE}.tmp" "$OUT_FILE"

SIZE="$(du -h "$OUT_FILE" | cut -f1)"
echo "[$(date -Is)] ok — ${SIZE}"

# ── 3. Cleanup ──────────────────────────────────────────────────
# -mtime +N matches files modified more than N days ago. We're past
# the deletion threshold once a backup is older than RETAIN_DAYS.
DELETED="$(find "$BACKUP_DIR" -name 'civique-*.sql.gz' -type f -mtime "+${RETAIN_DAYS}" -print -delete | wc -l)"
echo "[$(date -Is)] retention: deleted ${DELETED} file(s) older than ${RETAIN_DAYS}d"

# ── 4. Disk usage report ────────────────────────────────────────
echo "[$(date -Is)] backup dir total:"
du -sh "$BACKUP_DIR"
