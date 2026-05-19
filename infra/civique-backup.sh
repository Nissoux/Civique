#!/usr/bin/env bash
# ------------------------------------------------------------------------------
# Civique — backup automatique de la base PostgreSQL (production)
#
# pg_dump custom-format (compressé, rapide à restaurer), rotation 14 jours.
#
# Off-site (hebdo, lundi 03h) :
#   En cas de perte VPS, on envoie une copie compressée par email via Brevo
#   (msmtp). Pas de secret dans le script — les credentials sont dans
#   /root/.msmtprc. Envoi limité au lundi par défaut pour réduire le bruit
#   et la taille cumulée.
#
# Cron : 0 3 * * * /usr/local/bin/civique-backup.sh
#
# Adapté de /usr/local/bin/gfr-backup.sh — même structure, source pg_dump
# au lieu de sqlite3.
# ------------------------------------------------------------------------------
set -Eeuo pipefail

# --- Configuration ------------------------------------------------------------
PG_DB="${CIVIQUE_BACKUP_DB:-civique}"
PG_USER="${CIVIQUE_BACKUP_USER:-postgres}"
PG_HOST="${CIVIQUE_BACKUP_HOST:-localhost}"
PG_PORT="${CIVIQUE_BACKUP_PORT:-5432}"
# Password is read from PGPASSWORD env, or from .pgpass (per-line user:pwd).
# We accept both; the cron sets PGPASSWORD inline.

BACKUP_DIR="${CIVIQUE_BACKUP_DIR:-/root/backups/civique}"
RETENTION_DAYS="${CIVIQUE_BACKUP_RETENTION_DAYS:-14}"
LOG_FILE="${CIVIQUE_BACKUP_LOG:-/var/log/civique-backup.log}"
LOCK_FILE="/var/lock/civique-backup.lock"

# Off-site email config (same convention as gfr-backup.sh)
CIVIQUE_BACKUP_EMAIL="${CIVIQUE_BACKUP_EMAIL:-bfanis667@gmail.com}"
CIVIQUE_BACKUP_EMAIL_DAY="${CIVIQUE_BACKUP_EMAIL_DAY:-1}"          # 1=Mon, empty=daily
CIVIQUE_BACKUP_EMAIL_FORCE="${CIVIQUE_BACKUP_EMAIL_FORCE:-0}"
CIVIQUE_BACKUP_EMAIL_FROM="${CIVIQUE_BACKUP_EMAIL_FROM:-support@integrafle.fr}"
CIVIQUE_BACKUP_EMAIL_FROM_NAME="${CIVIQUE_BACKUP_EMAIL_FROM_NAME:-Civique Backup}"

# --- Logging ------------------------------------------------------------------
log() {
  local ts
  ts="$(date '+%Y-%m-%d %H:%M:%S')"
  printf '[%s] %s\n' "$ts" "$*" | tee -a "$LOG_FILE"
}

if ! touch "$LOG_FILE" 2>/dev/null; then
  LOG_FILE=/dev/stderr
fi

trap 'log "ERREUR ligne $LINENO (code=$?) — backup interrompu"' ERR

# --- Lock (anti-overlap) ------------------------------------------------------
exec 9>"$LOCK_FILE"
if ! flock -n 9; then
  log "Une autre instance tourne déjà (lock=$LOCK_FILE) — sortie."
  exit 0
fi

# --- Pré-requis ---------------------------------------------------------------
if ! command -v pg_dump >/dev/null 2>&1; then
  log "FATAL: pg_dump introuvable (apt install postgresql-client-16)"
  exit 1
fi

mkdir -p "$BACKUP_DIR"
chmod 700 "$BACKUP_DIR" || true

# --- Backup -------------------------------------------------------------------
# pg_dump custom format (-Fc) = compressé, parallel-friendly, idéal pour
# pg_restore. Single file, manageable.
STAMP="$(date '+%Y%m%d_%H%M%S')"
TARGET="$BACKUP_DIR/civique_${STAMP}.dump"

log "Démarrage backup → $TARGET"
log "Source: postgres://$PG_USER@$PG_HOST:$PG_PORT/$PG_DB"

# Capture la taille DB pour le log (psql one-liner, échec non bloquant)
DB_SIZE=$(PGPASSWORD="${PGPASSWORD:-}" psql -h "$PG_HOST" -U "$PG_USER" -d "$PG_DB" -p "$PG_PORT" -tAc \
  "SELECT pg_size_pretty(pg_database_size('$PG_DB'));" 2>/dev/null || echo "?")
log "Taille DB live: $DB_SIZE"

# pg_dump
# -Z 6 = niveau de compression gzip raisonnable (3-6 = bon compromis CPU/taille)
# --no-owner / --no-privileges = portable across PG instances
# --clean / --if-exists = restaurable sans drop manuel
PGPASSWORD="${PGPASSWORD:-}" pg_dump \
  -h "$PG_HOST" -U "$PG_USER" -p "$PG_PORT" \
  -d "$PG_DB" \
  -Fc -Z 6 \
  --no-owner --no-privileges \
  --clean --if-exists \
  -f "$TARGET"

if [[ ! -s "$TARGET" ]]; then
  log "FATAL: backup vide ou inexistant ($TARGET)"
  exit 1
fi

BACKUP_SIZE=$(du -h "$TARGET" | cut -f1)
log "OK — backup $BACKUP_SIZE"

# --- Rotation -----------------------------------------------------------------
# Supprime les .dump plus vieux que RETENTION_DAYS
PURGED=$(find "$BACKUP_DIR" -maxdepth 1 -type f -name 'civique_*.dump' -mtime "+$RETENTION_DAYS" -print -delete | wc -l)
if [[ "$PURGED" -gt 0 ]]; then
  log "Rotation: $PURGED ancien(s) backup(s) supprimé(s) (> $RETENTION_DAYS j)"
fi

# --- Email off-site (optionnel, hebdo) ----------------------------------------
TODAY_DOW=$(date '+%u')   # 1=Mon … 7=Sun
SHOULD_EMAIL=0
if [[ "$CIVIQUE_BACKUP_EMAIL_FORCE" == "1" ]]; then
  SHOULD_EMAIL=1
elif [[ -z "$CIVIQUE_BACKUP_EMAIL_DAY" ]]; then
  SHOULD_EMAIL=1
elif [[ "$TODAY_DOW" == "$CIVIQUE_BACKUP_EMAIL_DAY" ]]; then
  SHOULD_EMAIL=1
fi

if [[ "$SHOULD_EMAIL" == "1" ]] && command -v msmtp >/dev/null 2>&1; then
  if [[ -n "$CIVIQUE_BACKUP_EMAIL" ]]; then
    log "Envoi email off-site → $CIVIQUE_BACKUP_EMAIL"
    # Encode pièce jointe en base64
    BASENAME=$(basename "$TARGET")
    BOUNDARY="civique-backup-$(date +%s)-$$"
    {
      printf 'From: %s <%s>\n' "$CIVIQUE_BACKUP_EMAIL_FROM_NAME" "$CIVIQUE_BACKUP_EMAIL_FROM"
      printf 'To: %s\n' "$CIVIQUE_BACKUP_EMAIL"
      printf 'Subject: [Civique] Backup DB %s — %s\n' "$STAMP" "$BACKUP_SIZE"
      printf 'MIME-Version: 1.0\n'
      printf 'Content-Type: multipart/mixed; boundary="%s"\n\n' "$BOUNDARY"
      printf -- '--%s\n' "$BOUNDARY"
      printf 'Content-Type: text/plain; charset=utf-8\n\n'
      printf 'Backup PostgreSQL automatique.\n'
      printf 'Base : %s\n' "$PG_DB"
      printf 'Taille DB live : %s\n' "$DB_SIZE"
      printf 'Taille backup compressé : %s\n' "$BACKUP_SIZE"
      printf 'Timestamp : %s\n' "$STAMP"
      printf 'Hôte : %s\n\n' "$(hostname -f 2>/dev/null || hostname)"
      printf 'Restauration :\n'
      printf '  pg_restore -h <host> -U postgres -d civique --clean --if-exists %s\n' "$BASENAME"
      printf -- '--%s\n' "$BOUNDARY"
      printf 'Content-Type: application/octet-stream; name="%s"\n' "$BASENAME"
      printf 'Content-Transfer-Encoding: base64\n'
      printf 'Content-Disposition: attachment; filename="%s"\n\n' "$BASENAME"
      base64 < "$TARGET"
      printf -- '\n--%s--\n' "$BOUNDARY"
    } | msmtp --read-recipients --from="$CIVIQUE_BACKUP_EMAIL_FROM" || log "WARN: envoi email échoué (non bloquant)"
  fi
fi

log "Terminé."
