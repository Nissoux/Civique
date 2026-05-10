# Civique

Application de préparation aux examens de citoyenneté française (DELF, naturalisation, etc.). Monorepo Turborepo + pnpm.

## Structure

```
apps/
  mobile/    Expo SDK 54, React Native, TypeScript — iOS + Android
  server/    Fastify, Drizzle ORM, Postgres — déployé sur api.integrafle.fr
  web/       Next.js 15 App Router, React 19, Tailwind — à déployer sur civique.fr (Vercel)
packages/
  shared/    Types, schémas Zod, constantes partagées entre mobile/server/web
```

## Prérequis

- Node.js ≥ 20
- pnpm 9.15+ (`corepack enable && corepack prepare pnpm@9.15.0 --activate`)
- Postgres local pour le backend en dev (ou utiliser docker-compose)

## Installation

```bash
pnpm install
```

L'installation hisse les deps des trois apps en une passe et lie `@civique/shared` en workspace.

## Dev

```bash
# Web (Next.js, port 3001)
pnpm --filter web dev

# Backend Fastify (port 3000)
pnpm --filter server dev

# Mobile (Expo)
pnpm --filter mobile start
```

## Web (Next.js)

L'app web vit dans `apps/web`. Elle consomme l'API backend via `NEXT_PUBLIC_API_BASE_URL` (par défaut `https://api.integrafle.fr/api` — voir `apps/web/lib/env.ts`). Les tokens JWT sont posés en cookies httpOnly par les route handlers Next, jamais exposés au navigateur.

Pour déployer en production sur Vercel : voir [`DEPLOYMENT.md`](./DEPLOYMENT.md).

Pour le smoke test avant lancement : voir [`QA_SMOKE.md`](./QA_SMOKE.md).

## Backend

Déployé sur VPS Hetzner via PM2. Re-déploiement :

```bash
ssh root@api.integrafle.fr "cd /root/Civique && git pull origin main && pm2 restart civique"
```

Détails et variables d'env serveur : [`DEPLOYMENT.md`](./DEPLOYMENT.md).

## Mobile

Builds gérés via EAS. Voir `apps/mobile/eas.json` et `store/` pour les assets de soumission.

## Documents associés

- [`CLAUDE.md`](./CLAUDE.md) — règles d'or pour les contributions assistées
- [`DEPLOYMENT.md`](./DEPLOYMENT.md) — guide de déploiement (web, backend, Stripe, Brevo)
- [`QA_SMOKE.md`](./QA_SMOKE.md) — checklist smoke test pré-lancement
- [`PROJECT_STATUS.md`](./PROJECT_STATUS.md) — état d'avancement global
- [`LESSONS_LEARNED.md`](./LESSONS_LEARNED.md) — pièges et leçons capitalisées
