# Civique — Architecture

Document d'onboarding pour un·e contributeur·rice qui arrive sur le repo
et veut comprendre comment les morceaux s'imbriquent. Objectif : être
productif·ve en < 30 minutes après lecture.

---

## Vue d'ensemble

Civique est un **monorepo pnpm** orchestré par **Turborepo**. Trois apps
indépendantes consomment un seul package partagé et un seul backend.

```
┌─────────────────────────────────────────────────────────────────────┐
│                         packages/shared                              │
│        (types TS, schémas Zod, constantes : THEMES, EXAM_TYPES)      │
└─────────────────────────────────────────────────────────────────────┘
              ▲                       ▲                       ▲
              │ imports               │ imports               │ imports
              │                       │                       │
   ┌──────────┴──────────┐  ┌─────────┴────────┐   ┌──────────┴────────┐
   │   apps/mobile       │  │   apps/web       │   │   apps/server     │
   │   Expo SDK 54       │  │   Next.js 15     │   │   Fastify 5       │
   │   React Native      │  │   App Router     │   │   Drizzle ORM     │
   │   RevenueCat IAP    │  │   Stripe Checkout│   │   PostgreSQL      │
   └─────────┬───────────┘  └────────┬─────────┘   └──────────┬────────┘
             │ Bearer JWT             │ httpOnly cookies      │
             │                        │                       │
             └────────────────────────┴───────────────────────┘
                                      │
                          HTTPS / api.integrafle.fr/api
                                      │
                                      ▼
                         ┌────────────────────────┐
                         │     PostgreSQL 16      │
                         │      (Hetzner VPS)     │
                         └────────────────────────┘
```

- **apps/mobile** — Expo SDK 54, React Native 0.81, Expo Router. Auth
  Apple/Google Sign-In + email. Paiements via RevenueCat (StoreKit /
  Google Play Billing).
- **apps/web** — Next.js 15 App Router, React 19, Tailwind 3.4. Auth
  email + cookies httpOnly. Paiements via Stripe Checkout hébergé.
  Design system **Tisserand** (palette terracotta/bone/aubergine,
  fonts Newsreader + Karla, **light-only**).
- **apps/server** — Fastify 5, Drizzle ORM, Zod, JWT 15min/7j. Sert
  toute la donnée métier via `/api/*`. Postgres local sur le VPS.
- **packages/shared** — Types + schémas + constantes partagés. Importé
  via `@civique/shared`. **Ne contient pas** de code runtime spécifique
  à une plateforme.

---

## Auth — deux mondes, une seule source de vérité

Le backend délivre toujours **un access token (15 min) + un refresh
token (7 j)**. La différence est uniquement côté client : où on les
range.

```
┌─── Mobile (Bearer) ──────────────────────────────────────┐
│                                                          │
│  expo-secure-store ──► Authorization: Bearer <access>    │
│        ▲                                                 │
│        │ /auth/refresh quand 401                         │
│        ▼                                                 │
│  Fastify /api/auth/me                                    │
│                                                          │
└──────────────────────────────────────────────────────────┘

┌─── Web (httpOnly cookies + refresh middleware) ──────────┐
│                                                          │
│  Browser ──► civique_access (Secure, HttpOnly, Lax)      │
│              civique_refresh (idem)                      │
│        ▲                                                 │
│        │ posés par les Server Actions (login/register)   │
│        │ lus par lib/server/api.ts → header Authorization│
│        ▼                                                 │
│  Next.js middleware.ts                                   │
│     └─► Fastify /api/auth/refresh quand access expiré    │
│         (cookies remplacés transparentement)             │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

- Les cookies web sont posés par `apps/web/lib/server/session.ts` (server
  action), jamais accessibles au JS navigateur.
- Refresh : géré par `apps/web/middleware.ts` à chaque requête
  app-protégée. Mobile gère le retry 401→refresh manuellement.
- Apple/Google Sign-In : seuls les mobiles les exposent (compliance
  Apple 4.8). Sur web, email/password uniquement.

---

## Data flow — exemple complet : une réponse d'entraînement

L'utilisateur clique « Réponse B » dans une session de training web.

```
1. UI: <button onClick={handleChoice('b')}>
       (TrainingSession.tsx, composant client)
                  │
                  ▼
2. Server Action: recordPracticeAnswerAction({ questionId, choice })
       (apps/web/lib/actions/practice.ts, "use server")
                  │
                  ▼
3. lib/server/stats.recordPractice()
       └─► fastifyFetch('/stats/practice', POST, auth:true)
            (cookies civique_access lus, Authorization: Bearer posé)
                  │
                  ▼
4. Fastify: POST /api/stats/practice
       └─► authGuard middleware (JWT verify)
       └─► route handler dans apps/server/src/routes/stats/
            ├─ INSERT INTO practice_logs (...)
            ├─ UPDATE users SET xp = xp + delta
            └─ check quota free → 429 si dépassé
                  │
                  ▼
5. Réponse JSON { ok: true, isCorrect, xpGained }
                  │
                  ▼
6. Server Action retourne PracticeAnswerResult
                  │
                  ▼
7. UI: feedback vert/rouge + barre de progression
       (state local, pas de revalidate — purely client-side after the action)
```

- **Quota free user** : à chaque `recordPractice`, le serveur vérifie
  `practice_logs` count des dernières 24 h. Si > seuil et `isPremium ===
  false`, retourne 429 → le client affiche le paywall.
- **`shuffleChoices`** est déterministe (seed = `questionId`). Le serveur
  ne renvoie pas l'ordre mélangé : le client mélange localement et
  envoie la lettre choisie après remap inverse. Garantit que les
  traductions positionnelles restent alignées.

---

## Data flow — Stripe checkout (web)

```
1. User clique "S'abonner — Mensuel" sur /app/settings/subscription
                  │
                  ▼
2. <form action={startCheckoutAction}> ──► Server Action
       (apps/web/lib/actions/payments.ts)
                  │
                  ▼
3. createCheckoutSession('monthly')
       └─► fastifyFetch('/payments/create-checkout', auth:true)
                  │
                  ▼
4. Fastify POST /api/payments/create-checkout
       └─► fetch https://api.stripe.com/v1/checkout/sessions
            (success_url = ${WEB_BASE_URL}/app/settings/subscription?success=1
             cancel_url  = ${WEB_BASE_URL}/...?canceled=1
             client_reference_id = userId)
       └─► retourne checkoutUrl
                  │
                  ▼
5. Server Action: redirect(checkoutUrl) ──► 303
       Browser ouvre Stripe Checkout (page hébergée Stripe)
                  │
                  ▼
6. User paye sur checkout.stripe.com → Stripe redirect /app/...?success=1
                  │
                  ▼
7. Stripe POST /api/payments/webhook/stripe (asynchrone, signed)
       └─► Verify HMAC-SHA256(rawBody, timestamp) avec STRIPE_WEBHOOK_SECRET
       └─► event.type === 'checkout.session.completed'
            └─► UPDATE users SET isPremium = true,
                                  premiumExpires = now + 7/30/180 days,
                                  stripeCustomerId = session.customer
```

- Le rawBody Stripe est capté via un parser JSON custom dans
  `apps/server/src/index.ts` (sinon la signature HMAC échoue).
- Le webhook est **idempotent par construction** : `UPDATE` sans
  `INSERT`. Stripe peut le rejouer sans risque de double facturation.
- Mobile **n'utilise pas** Stripe — RevenueCat gère les achats StoreKit /
  Play Billing, et émet ses propres webhooks vers `/payments/webhook/revenuecat`.

---

## Déploiement — où tourne quoi

```
┌─────────────────── VPS Hetzner (Allemagne) ─────────────────────┐
│                                                                  │
│  Nginx 1.24 (443 / 80)                                           │
│    ├─► civique.fr           → PM2 civique-web (Next :3001)       │
│    └─► api.integrafle.fr    → PM2 civique     (Fastify :3000)    │
│                                                                  │
│  PostgreSQL 16 (:5432, localhost only)                           │
│  Let's Encrypt (renew via certbot.timer)                         │
│  PM2 startup (resurrect on reboot)                               │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

Mobile builds: EAS Cloud → Apple App Store + Google Play
Emails: Brevo HTTP API (sender support@integrafle.fr)
Paiements: Stripe (web) + RevenueCat (mobile)
Erreurs: Sentry (mobile uniquement aujourd'hui — voir POST_LAUNCH_ROADMAP)
```

Détails Nginx, PM2, Certbot : voir [`DEPLOYMENT.md`](./DEPLOYMENT.md).

---

## Décisions techniques (log)

Ordre chronologique. Les arbitrages déjà tranchés ne sont pas à
ré-ouvrir sans bonne raison.

1. **Hetzner plutôt que Vercel** pour le web — souveraineté (hébergement
   Allemagne, RGPD), coût fixe prévisible, mutualisation avec le backend
   existant. Trade-off : on opère soi-même Nginx / PM2 / Postgres.
   `apps/web/vercel.json` reste prêt si revirement.
2. **Tisserand light-only** côté web — palette terracotta/bone validée
   par le PO, dark mode skippé (charge dev disproportionnée vs valeur
   pour un public francophone qui consulte plutôt en journée). Mobile
   garde son dark mode existant (claymorphism).
3. **Pas de test automatisé pour le MVP** — `QA_SMOKE.md` (53 items)
   sert de référence manuelle. Trade-off assumé : on rattrapera par
   `vitest` + `@axe-core/playwright` post-launch quand le rythme de
   shipping ralentira.
4. **Codes de reset MDP à 8 caractères** plutôt que tokens URL longs —
   l'utilisateur tape le code reçu par email dans un champ (1 hour TTL).
   Plus simple côté UX (pas de copie de lien), trade-off entropy
   (8 char hex = 4 milliards de combinaisons, suffisant pour 1h TTL +
   rate limit 100 req/min).
5. **Shuffle déterministe** — `shuffleChoices(choices, questionId)`
   utilise un seed pseudo-aléatoire dérivé de `questionId`. Garantit que
   FR et traductions sont mélangées dans le même ordre (sinon le label
   "B" en arabe ne correspondrait pas au "B" en français). Voir
   `apps/web/lib/shuffleChoices.ts`.

---

## Liens utiles pour creuser

| Fichier | Quand le lire |
|---|---|
| [`PROJECT_STATUS.md`](./PROJECT_STATUS.md) | Découvrir les comptes, clés, IDs OAuth, état stores |
| [`DEPLOYMENT.md`](./DEPLOYMENT.md) | Configurer un nouveau VPS / déployer |
| [`OPERATIONS_RUNBOOK.md`](./OPERATIONS_RUNBOOK.md) | Quand quelque chose tourne mal en prod |
| [`QA_SMOKE.md`](./QA_SMOKE.md) | Avant chaque release |
| [`A11Y.md`](./A11Y.md) | Modifier un composant UI |
| [`SECURITY_AUDIT.md`](./SECURITY_AUDIT.md) | Vue d'ensemble des contrôles de sécurité |
| [`LESSONS_LEARNED.md`](./LESSONS_LEARNED.md) | Toucher à OAuth / IAP / EAS |
| [`KNOWN_ISSUES.md`](./KNOWN_ISSUES.md) | Avant d'ouvrir un bug, vérifier qu'il n'est pas déjà connu |
| [`POST_LAUNCH_ROADMAP.md`](./POST_LAUNCH_ROADMAP.md) | Décider sur quoi bosser cette semaine |
| [`CONTRIBUTING.md`](./CONTRIBUTING.md) | Premier commit |
| [`CLAUDE.md`](./CLAUDE.md) | Travailler avec assistance IA |

---

*Si une partie de ce document devient fausse, mettez-le à jour dans le
même PR que la modif de code. Une doc périmée est plus dangereuse qu'une
doc absente.*
