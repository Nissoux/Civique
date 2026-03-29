#!/bin/bash
set -euo pipefail

# ── Configuration ─────────────────────────────────────
VPS_USER="${VPS_USER:-root}"
VPS_HOST="${VPS_HOST:?Set VPS_HOST (e.g. 1.2.3.4)}"
APP_DIR="/opt/civique"
DOMAIN="api.civique.app"

echo "=== Deploying Civique to $VPS_HOST ==="

# ── 1. Setup VPS (first time only) ───────────────────
ssh "$VPS_USER@$VPS_HOST" bash -s <<'SETUP'
  # Install Docker if not present
  if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker && systemctl start docker
  fi

  # Install Docker Compose plugin if not present
  if ! docker compose version &> /dev/null; then
    echo "Installing Docker Compose plugin..."
    apt-get update && apt-get install -y docker-compose-plugin
  fi

  mkdir -p /opt/civique
SETUP

# ── 2. Sync files ────────────────────────────────────
echo "Syncing files to VPS..."
rsync -avz --delete \
  --exclude node_modules \
  --exclude .git \
  --exclude .env \
  --exclude .expo \
  --exclude dist \
  --exclude .turbo \
  --exclude ios \
  --exclude android \
  ./ "$VPS_USER@$VPS_HOST:$APP_DIR/"

# ── 3. Create .env if missing ────────────────────────
ssh "$VPS_USER@$VPS_HOST" bash -s <<ENVSETUP
  if [ ! -f "$APP_DIR/.env" ]; then
    echo "Creating .env with generated secrets..."
    JWT_SECRET=\$(openssl rand -base64 32)
    POSTGRES_PASSWORD=\$(openssl rand -base64 16 | tr -d '/+=')
    cat > "$APP_DIR/.env" <<EOF
JWT_SECRET=\$JWT_SECRET
POSTGRES_PASSWORD=\$POSTGRES_PASSWORD
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
EOF
    echo ".env created. Edit $APP_DIR/.env to add Stripe keys if needed."
  fi
ENVSETUP

# ── 4. Build and start ──────────────────────────────
echo "Building and starting containers..."
ssh "$VPS_USER@$VPS_HOST" bash -s <<DEPLOY
  cd "$APP_DIR"
  docker compose -f docker-compose.prod.yml up -d --build

  echo "Waiting for services to be healthy..."
  sleep 5

  # Run migrations via drizzle push
  docker compose -f docker-compose.prod.yml exec -T server \
    node -e "
      import('drizzle-kit').then(() => console.log('drizzle-kit available'));
    " 2>/dev/null || true

  # Push schema directly
  docker compose -f docker-compose.prod.yml exec -T server \
    npx drizzle-kit push 2>/dev/null || echo "Run db:push manually if needed"

  echo "Containers status:"
  docker compose -f docker-compose.prod.yml ps
DEPLOY

# ── 5. SSL Certificate (first time) ─────────────────
echo ""
echo "=== Deployment complete! ==="
echo ""
echo "Next steps:"
echo "  1. Point DNS: $DOMAIN → $VPS_HOST (A record)"
echo "  2. Get SSL cert (after DNS propagation):"
echo "     ssh $VPS_USER@$VPS_HOST"
echo "     cd $APP_DIR"
echo "     docker compose -f docker-compose.prod.yml run --rm certbot \\"
echo "       certonly --webroot -w /var/www/certbot -d $DOMAIN --agree-tos --email your@email.com"
echo "     docker compose -f docker-compose.prod.yml restart nginx"
echo ""
echo "  3. Seed the database:"
echo "     docker compose -f docker-compose.prod.yml exec server node dist/db/seed.js"
echo ""
echo "  4. Test: curl https://$DOMAIN/health"
