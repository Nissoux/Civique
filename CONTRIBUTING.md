# Contribuer à Civique

Bienvenue. Ce document décrit le strict nécessaire pour cloner, lancer
et contribuer sans casser la prod. À lire **avant** de toucher au code.
Pour l'architecture détaillée, voir [`ARCHITECTURE.md`](./ARCHITECTURE.md).
Pour les règles d'or quand l'assistance IA travaille sur le repo, voir
[`CLAUDE.md`](./CLAUDE.md).

---

## 1. Setup local

### Prérequis

- **Node.js 20 LTS** (`nvm install 20 && nvm use 20`)
- **pnpm 9.15+** :
  ```bash
  corepack enable
  corepack prepare pnpm@9.15.0 --activate
  ```
- **PostgreSQL 16** local (ou Docker — un `docker-compose.yml` est fourni
  à la racine pour démarrer une instance jetable).
- **Git** avec ton compte configuré (`git config user.email` doit
  matcher ton GitHub).

### Cloner + installer

```bash
git clone git@github.com:Nissoux/Civique.git
cd Civique
pnpm install
```

L'install hisse les dépendances des trois apps en une passe et lie
`@civique/shared` en workspace. **Toujours `pnpm`, jamais `npm` ni
`yarn`** — la lockfile est en `pnpm-lock.yaml` et le hoisting diffère.

### Variables d'environnement

Chaque app a son propre `.env.local` (non commité).

#### `apps/server/.env`
```env
DATABASE_URL=postgresql://civique:civique@localhost:5432/civique
JWT_SECRET=dev-secret-change-me
JWT_REFRESH_SECRET=dev-refresh-secret-change-me
PORT=3000
HOST=0.0.0.0
WEB_BASE_URL=http://localhost:3001
ADMIN_SECRET=dev-admin
# Optionnel en dev (sinon emails skip silencieusement)
BREVO_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

#### `apps/web/.env.local`
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
NODE_ENV=development
```

#### `apps/mobile/.env`
Mobile lit la base URL depuis `app.json` (extra.apiBaseUrl). Pour pointer
sur un backend local : éditer cette valeur et redémarrer le bundler.
Sentry, RevenueCat etc. sont configurés dans `app.json` directement.

### Migrations + seed BDD

```bash
# Une fois Postgres lancé (docker-compose up -d ou local)
pnpm --filter server db:push    # applique le schéma Drizzle
pnpm --filter server db:seed    # injecte les 611 questions + traductions
```

### Lancer les apps

Trois terminaux distincts :

```bash
# Backend Fastify (port 3000)
pnpm --filter server dev

# Web Next.js (port 3001)
pnpm --filter web dev

# Mobile Expo (Metro bundler, scanne QR sur device)
pnpm --filter mobile start
```

Le mobile en dev attend un device avec Expo Go ou un build dev client
EAS. Voir `apps/mobile/eas.json` pour les profils.

---

## 2. Branches & workflow git

| Branche | Rôle |
|---|---|
| `main` | Production. Tout commit ici peut partir en prod. |
| `feature/<slug>` | Travail en cours. Un slug court, sans accent (`feature/quota-reset`, `feature/comments-thread`). |
| `fix/<slug>` | Correctif bug. Idem. |
| `chore/<slug>` | Refacto / cleanup / dépendances. |

### Cycle standard

```bash
git checkout main
git pull origin main
git checkout -b feature/ma-fonctionnalite

# … travail …

git add -p                     # toujours -p, jamais -A à l'aveugle
git commit -m "feat(web): ajoute le composant ChallengeLeaderboard"
git push -u origin feature/ma-fonctionnalite

# Ouvre la PR via gh ou GitHub UI
gh pr create --title "feat(web): leaderboard challenges" --body "..."
```

**Ne JAMAIS** push direct sur `main`. Toujours une PR + relecture avant
merge (même si tu es seul·e — la relecture à froid attrape des bugs).

---

## 3. Format des commits

On suit **Conventional Commits**, comme dans l'historique existant.

```
type(scope): sujet à l'impératif, sans point final

[corps optionnel : pourquoi, pas quoi — le diff dit le quoi]
```

### Types autorisés

- `feat` — nouvelle fonctionnalité visible utilisateur
- `fix` — correction de bug
- `chore` — refacto, dépendances, config, doc interne
- `docs` — documentation seule
- `style` — formatage / lint (pas de change de logique)
- `perf` — optimisation perf mesurée
- `test` — ajout/modif de tests (post-MVP, voir CLAUDE.md)
- `ci` — pipeline CI/CD

### Scopes courants

- `mobile`, `web`, `server`, `shared`
- `auth`, `payments`, `social`, `train`, `exam`, `nav`, `a11y`

### Exemples (extraits de l'historique)

```
feat(web): wire 3 deployed backend features into UI
feat(server): fill backend gaps that block web features
chore: deploy prep + a11y audit + UX polish
fix(mobile): Google Sign-In native SDK migration
```

### Anti-exemples

```
Update stuff                              ← pas de type, pas de scope
feat: add a new component                 ← scope manquant
WIP                                       ← pas de commit WIP sur main
fix(web): fixed the bug                   ← "fixed" au passé, vague
```

---

## 4. Checklist de PR

À cocher **avant** de marquer la PR comme prête à review :

### Code
- [ ] TypeScript clean : `pnpm --filter <app> build` passe sans erreur
- [ ] ESLint clean : `pnpm --filter <app> lint` sans nouveaux warnings
- [ ] Pas de `console.log` de debug laissés
- [ ] Pas de secret hardcodé (clés API, mots de passe, tokens)
- [ ] Imports relatifs cohérents (`@/...` côté web, `@civique/shared` pour
  les types croisés)

### Sécurité / RGPD
- [ ] Si nouveau formulaire : validation Zod côté serveur **obligatoire**
- [ ] Si nouvelle route protégée : `authGuard` ou équivalent posé
- [ ] Si stockage de donnée perso : justification dans la PR

### QA
- [ ] Smoke test manuel sur les flows touchés (voir `QA_SMOKE.md`)
- [ ] Si UI : test visuel sur **2 viewports** minimum (mobile 375 + desktop 1280)
- [ ] Si traductions : tester avec **arabe** ou **persan** (RTL) pour
  attraper les régressions de layout
- [ ] Si shuffle/tri/réordonnancement : vérifier que **toutes les
  données liées** (traductions, labels, IDs) suivent le même ordre
  (règle d'or CLAUDE.md n°4)

### Accessibilité (UI)
- [ ] Tout élément interactif est atteignable au clavier (Tab + Enter)
- [ ] Focus ring visible sur tous les boutons / liens / inputs
- [ ] Champs de formulaire avec `<label>` ou `aria-label`
- [ ] Erreurs annoncées via `aria-live` ou `aria-describedby`
- [ ] Pour les détails, voir [`A11Y.md`](./A11Y.md)

### Documentation
- [ ] Si nouvelle décision d'archi : mise à jour `ARCHITECTURE.md`
- [ ] Si nouveau bug connu : ajouté dans `KNOWN_ISSUES.md`
- [ ] Si changement breaking : noté dans le corps de la PR

---

## 5. Code style

Pas de Prettier en commit hook pour le MVP — on s'appuie sur l'éditeur.

### TypeScript
- **Strict mode** partout (`strict: true` dans chaque tsconfig).
- Pas de `any`. Préfère `unknown` + narrow, ou `never` pour les
  branches inatteignables.
- Types co-localisés par défaut. Promus dans `@civique/shared` quand
  partagés entre 2+ apps.
- Préfère `interface` pour les objets publics, `type` pour les unions
  et helpers.

### React (web + mobile)
- Composants en **PascalCase**, fichiers idem (`TrainingSession.tsx`).
- Hooks en **camelCase** préfixés `use*`.
- Server components par défaut sur web ; `'use client'` uniquement
  quand on touche au DOM ou aux hooks d'état.
- Pas de `useEffect` qui set du state synchrone — extraire en
  `useMemo` ou en computation pendant le render.

### Tailwind (web)
- Utiliser les tokens Tisserand définis dans `tailwind.config.ts`
  (`text-aubergine`, `bg-bone`, `text-terracotta`, etc.). Jamais de hex
  hardcodé dans le JSX.
- Class lists longues : extraire en `clsx` ou en composant.

### Fastify (server)
- Toujours `z.parse(request.body/query/params)` à l'entrée des routes.
- Toujours `authGuard` sur les routes qui touchent à `users.*`.
- Toujours catcher les erreurs Stripe / Brevo et renvoyer un 502 / 503
  parlant — jamais un 500 brut.

---

## 6. Parité mobile / web

L'app web et l'app mobile partagent **le même backend** et la **même base
de questions**. Conséquences :

### Ce qui DOIT rester aligné
- Modèle de progression (XP, couronnes, streaks)
- Quota free (limite quotidienne questions, identique sur les deux)
- Liste des thèmes (`THEMES` dans `@civique/shared`)
- Types d'examen (`EXAM_TYPES` dans `@civique/shared`)
- Comportement de `recordPractice` (mêmes deltas XP)

### Ce qui PEUT diverger (et c'est OK)
- Design system : Tisserand light-only sur web, claymorphism dark sur mobile
- Paiements : Stripe Checkout sur web, RevenueCat sur mobile
- OAuth : email seul sur web, Apple+Google+email sur mobile
- Navigation : sidebar+drawer sur web, tab bar sur mobile

### Quand tu modifies un comportement métier
1. Mets à jour le serveur **d'abord** (source de vérité).
2. Aligne les deux clients dans la **même PR** quand c'est possible.
3. Si tu ne peux aligner qu'un seul (ex: feature web-only pour le MVP),
   note-le explicitement dans `KNOWN_ISSUES.md` et `POST_LAUNCH_ROADMAP.md`
   sous "parité mobile-web".

---

## 7. Quand demander de l'aide

- Bug bloquant en prod → ping immédiat (Slack / Telegram /
  `support@integrafle.fr`).
- Question d'archi avec impact > 1 jour de travail → ouvrir une issue
  GitHub avec le label `discussion`, attendre 24h avant de coder.
- Doute sur une dépendance externe (OAuth, Stripe, Apple) → lire la doc
  officielle avant de demander (voir `LESSONS_LEARNED.md` n°1).

---

## 8. Ce qui n'existe pas (encore) et ne doit pas exister sans accord

- ❌ Tests automatisés (post-MVP, voir `POST_LAUNCH_ROADMAP.md` D+60)
- ❌ Dark mode web (skippé par décision PO)
- ❌ i18n de l'UI web (questions traduites, UI en français — D+90)
- ❌ Push notifications mobile (D+90)
- ❌ Admin panel (D+90)

Si tu penses qu'un de ces points devrait exister **maintenant**, ouvre
une discussion avant de coder.

---

*Merci de contribuer. Un commit bien fait vaut dix commits à refaire.*
