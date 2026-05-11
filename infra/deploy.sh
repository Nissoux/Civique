#!/usr/bin/env bash
# Civique full-stack deploy script.
# Run on the production VPS (api.integrafle.fr) after pushing to main.
#
# Usage:
#   bash /root/Civique/infra/deploy.sh           # deploy both server and web
#   bash /root/Civique/infra/deploy.sh server    # backend only (fast, no install)
#   bash /root/Civique/infra/deploy.sh web       # web only (install + build + restart)
#
# Pre-requisite: civique-web is already registered in PM2. First time only:
#   cd /root/Civique
#   pnpm install --frozen-lockfile
#   pnpm --filter web build
#   pm2 start apps/web/ecosystem.config.cjs
#   pm2 save     # so pm2 resurrect brings it back on reboot
set -euo pipefail

cd /root/Civique

TARGET="${1:-all}"

echo "▸ git pull"
git pull origin main

case "$TARGET" in
    server)
        echo "▸ pm2 restart civique (backend only)"
        pm2 restart civique
        ;;
    web)
        echo "▸ pnpm install (workspace)"
        pnpm install --frozen-lockfile
        echo "▸ pnpm --filter web build"
        pnpm --filter web build
        echo "▸ pm2 restart civique-web"
        pm2 restart civique-web
        ;;
    all|*)
        echo "▸ pnpm install (workspace)"
        pnpm install --frozen-lockfile
        echo "▸ pnpm --filter web build"
        pnpm --filter web build
        echo "▸ pm2 restart civique civique-web"
        pm2 restart civique civique-web
        ;;
esac

echo "✓ deploy done"
pm2 status
