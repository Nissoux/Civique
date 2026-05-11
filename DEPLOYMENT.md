# Déploiement Civique

Le stack tourne **entièrement sur Hetzner** (Allemagne) : backend Fastify
et frontend Next.js sur le même VPS, fronted par Nginx, supervisés par PM2.

```
┌───────────────────────────────────────────────────────────────┐
│  VPS Hetzner (Allemagne)                                       │
│                                                                │
│  ┌──────────────┐    ┌──────────────────┐    ┌──────────────┐  │
│  │  Nginx       │ →  │ PM2 civique-web  │    │ Postgres     │  │
│  │  443 / 80    │    │   :3001 (Next)   │    │   :5432      │  │
│  │              │    └──────────────────┘    └──────────────┘  │
│  │  civique.fr  │    ┌──────────────────┐                      │
│  │  api.…       │ →  │ PM2 civique      │    ┌──────────────┐  │
│  │              │    │   :3000 (Fastify)│ ←→ │ Brevo / Stripe│ │
│  │  Let's Enc.  │    └──────────────────┘    └──────────────┘  │
│  └──────────────┘                                              │
│                                                                │
└───────────────────────────────────────────────────────────────┘
```

---

## 1. Première mise en ligne — checklist

À faire **une seule fois**. Tu es root sur le VPS (`ssh root@api.integrafle.fr`).

### 1.1 — Installer les dépendances système (déjà fait pour le backend)

Si tu pars d'un VPS vierge :

```bash
apt update && apt install -y nginx certbot python3-certbot-nginx postgresql curl
# Node 20 + pnpm
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
corepack enable
corepack prepare pnpm@latest --activate
npm install -g pm2
```

Vérifie que le backend tourne déjà (`pm2 status` doit lister `civique` en `online`). Si oui, saute à 1.2.

### 1.2 — Pointer DNS civique.fr vers le VPS

Chez ton registrar (OVH, Gandi, Cloudflare…) :

| Type   | Nom (Host)  | Valeur                       | TTL  |
|--------|-------------|------------------------------|------|
| `A`    | `@`         | **IP du VPS** (`dig api.integrafle.fr +short`) | 300  |
| `A`    | `www`       | même IP                      | 300  |

Propagation : 5 min à 1 h selon le registrar. Vérifie avec :
`dig civique.fr +short` doit retourner ton IP VPS.

### 1.3 — Récupérer le code + builder le web

```bash
cd /root/Civique
git pull origin main
pnpm install --frozen-lockfile
pnpm --filter web build
```

Le build prend ~2-3 min. Mémoire pic ~1-1.5 GB. Si le VPS a < 4 GB de RAM
total, ajoute du swap avant :

```bash
fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

### 1.4 — Démarrer le web via PM2

```bash
cd /root/Civique
pm2 start apps/web/ecosystem.config.cjs
pm2 save   # persiste à travers les reboots (avec pm2 startup une fois)
```

Vérifie : `pm2 status` doit lister `civique-web` en `online`.
Test local : `curl -I http://127.0.0.1:3001` retourne `200 OK`.

### 1.5 — Configurer Nginx pour civique.fr

```bash
cp /root/Civique/infra/nginx/civique.fr.conf /etc/nginx/sites-available/civique.fr
ln -s /etc/nginx/sites-available/civique.fr /etc/nginx/sites-enabled/civique.fr
nginx -t   # vérifier la syntaxe
systemctl reload nginx
```

Test : `curl -I http://civique.fr` doit retourner `200 OK` (en HTTP, pas
encore HTTPS).

### 1.6 — Obtenir le certificat HTTPS via Let's Encrypt

```bash
certbot --nginx -d civique.fr -d www.civique.fr
```

Réponds aux prompts :
- Email pour les notifications de renouvellement
- Accepter les CGU Let's Encrypt
- Choisir l'option **redirect** (HTTP → HTTPS auto)

Certbot modifie automatiquement `/etc/nginx/sites-enabled/civique.fr` pour
ajouter `listen 443 ssl;` + la redirection 301. Le cert se renouvelle
automatiquement via le timer `certbot.timer` (vérifier avec
`systemctl status certbot.timer`).

Test final : `https://civique.fr` répond, badge HTTPS vert.

### 1.7 — Variables d'environnement (côté VPS)

Le fichier `/root/Civique/.env` doit contenir (en plus de ce qui y est déjà) :

```env
# Backend (existant)
DATABASE_URL=postgresql://civique:...@localhost:5432/civique
JWT_SECRET=...
BREVO_API_KEY=xkeysib-...

# Stripe (à compléter pour la prod payante)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_WEEKLY=price_...
STRIPE_PRICE_MONTHLY=price_...
STRIPE_PRICE_SEMIANNUAL=price_...

# Nouveau : URL du web pour les redirects Stripe checkout
WEB_BASE_URL=https://civique.fr

# CORS — déjà whitelisté côté code mais peut être surchargé ici
# ALLOWED_ORIGINS=https://civique.fr,https://www.civique.fr
```

Après modif : `pm2 restart civique`.

---

## 2. Redéployer après chaque push

Sur ta machine locale, push vers `main`. Puis :

```bash
ssh root@api.integrafle.fr "bash /root/Civique/infra/deploy.sh"
```

Le script :
1. `git pull origin main`
2. `pnpm install --frozen-lockfile` (workspace)
3. `pnpm --filter web build`
4. `pm2 restart civique civique-web`

Options :
- `bash deploy.sh server` → backend uniquement (rapide, pas de install)
- `bash deploy.sh web` → web uniquement

---

## 3. Configuration Stripe (avant ouverture publique)

Dans le [Stripe Dashboard](https://dashboard.stripe.com) :

1. **Bascule en mode Live** (toggle en haut à droite)
2. **Products → Add product** pour chacun :
   - Civique Hebdomadaire — 3,99 € — Recurring weekly
   - Civique Mensuel — 10,99 € — Recurring monthly
   - Civique 6 mois — 39,99 € — One-time (mode payment)
3. Copie les 3 `price_xxx` IDs → dans `/root/Civique/.env`
4. **Developers → Webhooks → Add endpoint**
   - URL : `https://api.integrafle.fr/api/payments/webhook/stripe`
   - Events : `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copie le `whsec_xxx` → `STRIPE_WEBHOOK_SECRET`
5. `pm2 restart civique`

Test : crée un Checkout en mode Test depuis `civique.fr/app/settings/subscription`, vérifie que le user passe `isPremium=true` après le webhook.

---

## 4. Brevo (emails transactionnels)

Le backend utilise déjà Brevo via `BREVO_API_KEY`. Vérifier :

1. [Brevo Dashboard](https://app.brevo.com) → Senders & IP → Domains
2. `integrafle.fr` doit être en statut **Authenticated** (DKIM + SPF verts)
3. Sinon : suivre les instructions Brevo pour ajouter les enregistrements DNS

Le sender utilisé dans le code : `support@integrafle.fr` (voir `apps/server/src/services/email.ts`).

---

## 5. Pré-launch QA

Avant d'annoncer publiquement :
- Run [QA_SMOKE.md](QA_SMOKE.md) sur `https://civique.fr` (53 items)
- Vérifie les 4 emails transactionnels : verification, password reset, password changed, welcome
- Test 1 cycle Stripe complet en mode live avec une vraie carte (rembourse-toi après)
- Lighthouse audit (devrait être > 90 sur la landing)

---

## 6. Alternative — Vercel (si tu changes d'avis)

Si tu veux migrer vers Vercel plus tard (zero ops, edge CDN) :

1. Vercel.com → Add Project → import `Nissoux/Civique`
2. Root Directory = `apps/web` (critique pour monorepo)
3. Env var `NEXT_PUBLIC_API_BASE_URL=https://api.integrafle.fr/api` (Production + Preview + Development)
4. Deploy
5. Settings → Domains → ajouter `civique.fr` + `www.civique.fr`
6. Sur le VPS : `pm2 stop civique-web && pm2 delete civique-web` (libère la RAM)
7. Sur Nginx : retirer le vhost `civique.fr` ou le rediriger vers Vercel

Le `vercel.json` à `apps/web/vercel.json` est déjà prêt si tu fais ce switch.

---

## 7. Monitoring (post-launch)

À installer une fois en prod et qu'on a libéré du disque :
- **Sentry web** : `pnpm --filter web add @sentry/nextjs` puis `npx @sentry/wizard@latest -i nextjs`
- **Plausible** ou **Umami** auto-hébergé sur le VPS pour les analytics RGPD-compliant
- **Uptime Robot** (gratuit) → ping `https://civique.fr` toutes les 5 min, alerte mail/SMS si down

---

## Récap des fichiers d'infra

| Fichier | Rôle |
|---|---|
| `apps/web/ecosystem.config.cjs` | Config PM2 pour `civique-web` |
| `infra/nginx/civique.fr.conf` | Vhost Nginx + caching + security headers |
| `infra/deploy.sh` | Script de déploiement (full / server / web) |
| `apps/web/.env.production.example` | Template d'env (PORT, NEXT_PUBLIC_API_BASE_URL) |
| `QA_SMOKE.md` | Checklist QA manuelle pré-launch |
