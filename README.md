# Civique

> Préparer l'examen civique français — pour la carte de séjour
> pluriannuelle, la carte de résident ou la nationalité — depuis le
> mobile ou le web, en 6 langues, avec 611 questions issues du
> référentiel officiel.

**Statut** : MVP en cours de déploiement (web + iOS + Android), backend
en production sur Hetzner. Voir [`PROJECT_STATUS.md`](./PROJECT_STATUS.md)
pour le détail.

---

## Stack technique

| Couche | Tech | Emplacement |
|---|---|---|
| Mobile | Expo SDK 54, React Native 0.81, TypeScript | `apps/mobile/` |
| Web | Next.js 15 App Router, React 19, Tailwind 3.4 (Tisserand) | `apps/web/` |
| Backend | Fastify 5, Drizzle ORM, PostgreSQL 16 | `apps/server/` |
| Partagé | Types, schémas Zod, constantes (THEMES, EXAM_TYPES) | `packages/shared/` |
| Infra | VPS Hetzner (DE), PM2, Nginx, Let's Encrypt | `infra/` |
| Paiements | Stripe Checkout (web) + RevenueCat (mobile) | — |
| Emails | Brevo HTTP API | — |
| Erreurs | Sentry (mobile uniquement aujourd'hui) | — |

Monorepo **pnpm workspaces** orchestré par **Turborepo**. API en
production sur `https://api.integrafle.fr`, web sur
`https://civique.fr`.

---

## Prérequis

- Node.js ≥ 20
- pnpm 9.15+ (`corepack enable && corepack prepare pnpm@9.15.0 --activate`)
- PostgreSQL 16 local (ou docker-compose à la racine)

---

## Installation

```bash
git clone git@github.com:Nissoux/Civique.git
cd Civique
pnpm install
```

L'install hisse les dépendances des trois apps en une passe et lie
`@civique/shared` en workspace.

---

## Quickstart

Trois terminaux distincts. Détails dans
[`CONTRIBUTING.md`](./CONTRIBUTING.md#1-setup-local).

### Backend Fastify (port 3000)

```bash
# Une fois Postgres lancé
pnpm --filter server db:push   # schéma Drizzle
pnpm --filter server db:seed   # 611 questions + traductions
pnpm --filter server dev
```

L'API écoute sur `http://localhost:3000`. Health check :
`http://localhost:3000/health`.

### Web Next.js (port 3001)

```bash
pnpm --filter web dev
```

Le web consomme l'API via `NEXT_PUBLIC_API_BASE_URL` (par défaut
`https://api.integrafle.fr/api` — voir `apps/web/lib/env.ts`). Pour le
dev local, pointer sur `http://localhost:3000/api` dans
`apps/web/.env.local`. Les tokens JWT sont posés en cookies httpOnly,
jamais exposés au navigateur.

### Mobile Expo

```bash
pnpm --filter mobile start
```

Scanne le QR avec Expo Go (dev) ou utilise un dev client EAS. Builds
production gérés via EAS — voir `apps/mobile/eas.json` et `store/`
pour les assets de soumission.

---

## Documents associés

| Doc | À lire quand |
|---|---|
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | Premier jour sur le repo, comprendre les flux |
| [`CONTRIBUTING.md`](./CONTRIBUTING.md) | Avant le premier commit (setup, branches, PR) |
| [`DEPLOYMENT.md`](./DEPLOYMENT.md) | Déployer (web, backend, Stripe, Brevo) |
| [`OPERATIONS_RUNBOOK.md`](./OPERATIONS_RUNBOOK.md) | Quand quelque chose tourne mal en prod (rollback, debug, restore) |
| [`POST_LAUNCH_ROADMAP.md`](./POST_LAUNCH_ROADMAP.md) | Décider sur quoi bosser cette semaine (D+30/60/90) |
| [`KNOWN_ISSUES.md`](./KNOWN_ISSUES.md) | Avant de signaler un bug, vérifier qu'il n'est pas déjà connu |
| [`QA_SMOKE.md`](./QA_SMOKE.md) | Checklist smoke test pré-lancement (53 items) |
| [`A11Y.md`](./A11Y.md) | Modifier un composant UI |
| [`SECURITY_AUDIT.md`](./SECURITY_AUDIT.md) | Vue d'ensemble des contrôles de sécurité en place |
| [`PROJECT_STATUS.md`](./PROJECT_STATUS.md) | État d'avancement global, comptes, clés OAuth |
| [`LESSONS_LEARNED.md`](./LESSONS_LEARNED.md) | Avant de toucher à OAuth / IAP / EAS |
| [`CLAUDE.md`](./CLAUDE.md) | Travailler avec assistance IA (règles d'or, décisions tranchées) |

---

## Licence

Tous droits réservés — IntégraFLE. License détaillée à compléter.

Pour toute question : `support@integrafle.fr`.
