# Déploiement Civique

Ce document décrit la mise en production de toutes les briques de Civique :

- **Web** (Next.js 15) → Vercel
- **Backend** (Fastify + Postgres) → VPS Hetzner via PM2
- **Stripe** (paiements) → Dashboard Stripe + variables `.env` serveur
- **Brevo** (emails transactionnels) → Dashboard Brevo + variable `.env` serveur

---

## 1. Première mise en ligne du web sur Vercel

> Pré-requis : avoir un compte Vercel relié au compte GitHub qui détient le repo `Nissoux/Civique`.

### 1.1 Création du projet Vercel

1. Se connecter à <https://vercel.com> avec le compte qui sera propriétaire du projet (Anis).
2. Cliquer sur **Add New… → Project**.
3. Choisir **Import Git Repository** puis sélectionner `Nissoux/Civique`. Si le repo n'apparaît pas, cliquer sur *Configure GitHub App* et autoriser l'accès au repo.
4. Sur l'écran **Configure Project** :
   - **Project Name** : `civique` (le sous-domaine `civique.vercel.app` sera réservé).
   - **Framework Preset** : `Next.js` (auto-détecté).
   - **Root Directory** : cliquer sur **Edit** et choisir `apps/web` — c'est la racine du sous-projet Vercel. Toutes les commandes seront exécutées relativement à ce dossier.
   - **Build & Output Settings** : ne **rien modifier** — `apps/web/vercel.json` couvre déjà :
     - `installCommand` = `cd ../.. && pnpm install --frozen-lockfile`
     - `buildCommand` = `cd ../.. && pnpm --filter web build`
     - `outputDirectory` = `.next`
     - `regions` = `["cdg1"]` (Paris, faible latence pour la France).
5. **Environment Variables** : ajouter (Production + Preview + Development) :

   | Nom                          | Valeur                                |
   | ---------------------------- | ------------------------------------- |
   | `NEXT_PUBLIC_API_BASE_URL`   | `https://api.integrafle.fr/api`       |

6. Cliquer **Deploy**. Vercel installe pnpm, exécute le workspace install puis `next build`. Compter 3–5 minutes.

### 1.2 Branchement du domaine `civique.fr`

1. Une fois le déploiement vert sur `civique.vercel.app`, ouvrir **Project Settings → Domains**.
2. Cliquer **Add Domain** et entrer `civique.fr`. Vercel propose une configuration *Apex domain*.
3. Refaire l'opération avec `www.civique.fr` ; Vercel propose une redirection 308 vers l'apex (à laisser activée).
4. Vercel affiche les enregistrements DNS à poser chez le registrar du domaine :
   - Apex `civique.fr` → enregistrement **A** vers `76.76.21.21`
   - Sous-domaine `www` → enregistrement **CNAME** vers `cname.vercel-dns.com.`
5. Configurer ces enregistrements chez le registrar (OVH, Gandi, Cloudflare, etc.). Propagation : 5 min – 24 h.
6. Vercel délivre automatiquement le certificat SSL Let's Encrypt dès que les DNS résolvent.

### 1.3 Vérification après mise en ligne

- Ouvrir <https://civique.fr> → la landing doit s'afficher.
- DevTools → Network → `/api/auth/me` doit appeler `api.integrafle.fr/api/...` (CORS OK).
- Tester un cycle complet : voir `QA_SMOKE.md`.

---

## 2. Déploiement backend (rappel)

Le backend Fastify est déjà en production sur le VPS Hetzner. À chaque push sur `main` :

```bash
ssh root@api.integrafle.fr "cd /root/Civique && git pull origin main && pm2 restart civique"
```

Logs : `ssh root@api.integrafle.fr "pm2 logs civique --lines 100"`.

---

## 3. Variables d'environnement (récapitulatif)

### 3.1 Web — Vercel (Project Settings → Environment Variables)

| Nom                          | Production                          | Notes                                  |
| ---------------------------- | ----------------------------------- | -------------------------------------- |
| `NEXT_PUBLIC_API_BASE_URL`   | `https://api.integrafle.fr/api`     | Inline au build. Aucun secret.         |

### 3.2 Backend — `/root/Civique/.env` (Hetzner)

| Nom                        | Description                                                        |
| -------------------------- | ------------------------------------------------------------------ |
| `DATABASE_URL`             | `postgres://civique:…@localhost:5432/civique`                      |
| `JWT_SECRET`               | Secret long et aléatoire (≥ 64 caractères). Ne **jamais** changer en prod sans plan de migration de session. |
| `STRIPE_SECRET_KEY`        | `sk_live_…` (clé secrète Stripe en mode live)                      |
| `STRIPE_WEBHOOK_SECRET`    | `whsec_…` fourni par Stripe lors de la création du webhook endpoint |
| `STRIPE_PRICE_WEEKLY`      | `price_…` pour l'abonnement hebdo                                  |
| `STRIPE_PRICE_MONTHLY`     | `price_…` pour l'abonnement mensuel                                |
| `STRIPE_PRICE_SEMIANNUAL`  | `price_…` pour l'abonnement semestriel                             |
| `BREVO_API_KEY`            | `xkeysib-…` (API key Brevo HTTP)                                   |
| `WEB_BASE_URL`             | `https://civique.fr` (utilisé pour les liens dans les emails et les redirects Stripe Checkout) |

Après modification, redémarrer PM2 : `pm2 restart civique`.

---

## 4. Stripe — passage en mode live

> Tant que les clés sont en `sk_test_…`, aucun paiement réel n'est traité.

### 4.1 Créer les produits & prix dans le Dashboard Stripe

Dans <https://dashboard.stripe.com> (mode **Live**) → *Catalogue → Produits* :

1. **Civique Hebdo** — 1 prix récurrent (par exemple 2,99 € / semaine) → noter le `price_xxx`.
2. **Civique Mensuel** — 1 prix récurrent (par exemple 7,99 € / mois) → noter le `price_xxx`.
3. **Civique Semestriel** — 1 prix récurrent (par exemple 29,99 € / 6 mois) → noter le `price_xxx`.

Reporter chaque `price_xxx` dans `/root/Civique/.env` sous les clés `STRIPE_PRICE_WEEKLY`, `STRIPE_PRICE_MONTHLY`, `STRIPE_PRICE_SEMIANNUAL`.

> Sur iOS, les 7 prix sandbox StoreKit (incluant `civique_six_month`) existent côté Apple — voir `DEBUG_SIX_MONTH_SUBSCRIPTION.md`. Stripe ne concerne que le web et Android.

### 4.2 Configurer le webhook

1. *Developers → Webhooks → Add endpoint*.
2. URL : `https://api.integrafle.fr/api/payments/webhook/stripe`.
3. Évènements à écouter :
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
4. Stripe affiche le **Signing secret** (`whsec_…`) → reporter dans `STRIPE_WEBHOOK_SECRET`.
5. `pm2 restart civique`.
6. Tester avec *Send test event → checkout.session.completed* → vérifier l'arrivée dans `pm2 logs civique`.

---

## 5. Brevo — emails transactionnels

1. Dashboard Brevo → *Senders, Domains & dedicated IPs → Domains*.
2. Vérifier que `integrafle.fr` est marqué *Authenticated* (SPF + DKIM verts).
3. Si ce n'est pas le cas, suivre les instructions Brevo pour ajouter les enregistrements DNS chez le registrar et cliquer sur *Authenticate this domain*.
4. Le sender utilisé par le serveur est `support@integrafle.fr` — il doit apparaître comme adresse vérifiée.
5. Tester en déclenchant un email transactionnel (par exemple `/api/auth/forgot-password`) et vérifier l'arrivée + la non-mise en spam.

---

## 6. En cas de rollback web

Sur Vercel, *Deployments → choisir un déploiement précédent → Promote to Production*. Le rollback est instantané ; les variables d'environnement ne changent pas.

Pour un rollback backend : `ssh root@api.integrafle.fr "cd /root/Civique && git reset --hard <SHA> && pm2 restart civique"`.

---

## 7. Checklist post-déploiement

Après chaque mise en prod majeure, dérouler `QA_SMOKE.md` avant de communiquer.
