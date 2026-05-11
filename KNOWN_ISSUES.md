# Civique — Bugs connus et dette technique

Liste vivante des limitations connues, classées par sévérité. Mise à
jour à chaque nouvelle découverte. Tout ce qui est ici est **assumé**
(documenté, traçable) — par opposition aux bugs inconnus qu'on
découvrira en prod.

> Pour le plan de remédiation et les fenêtres temporelles, voir
> [`POST_LAUNCH_ROADMAP.md`](./POST_LAUNCH_ROADMAP.md). Pour les
> bonnes pratiques avant de toucher au code, voir
> [`CONTRIBUTING.md`](./CONTRIBUTING.md).

---

## Légende sévérité

- 🔴 **Bloquant** — empêche un parcours utilisateur critique. À régler
  avant la prochaine release.
- 🟠 **Majeur** — dégrade l'expérience, mais contournement existe. À
  régler dans les 30 jours.
- 🟡 **Mineur** — visible mais sans impact fonctionnel. Backlog
  hygiène / dette.
- ⚪ **Cosmétique / dette** — uniquement gênant pour le contributeur,
  pas pour l'utilisateur final.

---

## 🟠 Majeur

### M1 — Mentions légales : placeholders visibles
- **Fichier** : `apps/web/app/mentions-legales/page.tsx` (lignes ~110-140)
- **Symptôme** : la page `/mentions-legales` affiche un bloc d'alerte
  jaune `role="note"` et plusieurs `<PlaceholderText>À compléter…</...>`
  pour la raison sociale, le statut juridique, le siège social, le
  capital, le RCS/SIRET, la TVA et le directeur de publication.
- **Bloquant pour** : conformité légale française dès la première
  transaction commerciale (Stripe), audit prélancement.
- **Fix** : remplacer chaque `<PlaceholderText>` par la valeur réelle
  une fois la société immatriculée. Retirer le bloc `role="note"` une
  fois tous les champs renseignés (voir aussi `A11Y.md` "Restent à
  traiter").

### M2 — Challenge play : payload backend incomplet
- **Fichier** : `apps/web/components/social/ChallengePlay.tsx` (commentaire
  ligne 47), `apps/server/src/routes/social/index.ts`
- **Symptôme** : la réponse `/challenges/:id` ne renvoie pas
  `correctChoice`, `explanationFr` ni `translatedChoices`.
  Conséquence : en mode défi, on n'affiche pas quelle était la bonne
  réponse ni l'explication — feedback dégradé vs mode entraînement
  standard.
- **Bloquant pour** : parité fonctionnelle défis/entraînement.
- **Fix** : étendre le SELECT côté serveur pour inclure
  `questions.correctChoice`, `questions.explanationFr` et le LEFT JOIN
  des traductions. Mettre à jour `ChallengeQuestionRow` dans
  `apps/web/lib/server/social.ts`.

### M3 — `passwordResetTokens` en mémoire
- **Fichier** : `apps/server/src/routes/auth/index.ts` (ligne ~460)
- **Symptôme** : la map des tokens de reset est in-memory. Un
  `pm2 restart civique` invalide tous les codes en attente. L'utilisateur
  reçoit "Code invalide ou expiré" alors qu'il a tapé le bon code.
- **Bloquant pour** : continuité de service pendant un déploiement.
- **Fix** : table Postgres `password_reset_tokens(code, email,
  expires_at)` avec index sur `code`, GC par cron horaire. Voir
  POST_LAUNCH_ROADMAP D+30 item 6.

### M4 — Brevo email templates pointent uniquement vers deep-links mobile
- **Fichier** : `apps/server/src/services/email.ts`
- **Symptôme** : aucun lien des emails (vérification, welcome, reset,
  password-changed) ne pointe vers `civique.integrafle.fr`. L'email "Bienvenue"
  ne propose pas le web comme alternative au mobile. Les liens du
  footer pointent vers `api.integrafle.fr/privacy` (backend HTML) et
  pas vers `civique.integrafle.fr/privacy` (UI propre).
- **Bloquant pour** : conversion des inscrits web qui ne téléchargent
  pas le mobile.
- **Fix** : ajouter un CTA "Ouvrir Civique sur le web →
  https://civique.integrafle.fr/app" dans `sendWelcomeEmail`. Remplacer les liens
  footer par `https://civique.integrafle.fr/privacy` / `/terms`.

### M5 — Disque local de la machine de dev (C:) saturé
- **Symptôme** : sur la machine de dev d'Anis (Windows), `C:` plein →
  `pnpm install` échoue avec ENOSPC. Bloque toute itération locale.
  **Pas un bug du repo** mais une contrainte d'opération.
- **Bloquant pour** : tout `pnpm install` local (ajout / mise à jour
  dépendance).
- **Fix** : nettoyer le `C:` (`pnpm store prune`, vider les `.next`,
  `dist`, `node_modules` orphelins, vider le cache npm/yarn historique).
  Solution durable : déplacer le repo sur un autre volume avec plus
  d'espace, ou monter un worktree sur `D:` / `G:`.

---

## 🟡 Mineur

### m1 — Comments full-thread page absente
- **Fichier** : `apps/web/components/train/TrainingSession.tsx`
  (composant `QuestionComments`)
- **Symptôme** : la preview affiche les 3 derniers commentaires + un
  lien "Voir tous". Le lien existe mais la page cible
  (`/app/questions/[id]/discussion`) n'a pas encore été codée.
- **Impact** : un user qui clique tombe sur un 404.
- **Fix immédiat** (post-launch J+1) : retirer le lien ou pointer vers
  `#` avec un `disabled` + tooltip "Bientôt disponible". **Fix complet** :
  voir POST_LAUNCH_ROADMAP D+60 item 4.

### m2 — Confettis : déclenchés sur examen, pas sur level perfection
- **Fichier** : `apps/web/components/train/TrainingSession.tsx`
- **Symptôme** : un user qui finit un niveau à 100 % (10/10) ne reçoit
  pas de confettis. Renforcement positif inégal entre examen blanc et
  entraînement.
- **Impact** : motivation utilisateur sous-optimisée.
- **Fix** : trigger `<Confetti />` quand `correctCount === total &&
  !isRandom`. ~30 min.

### m3 — Cross-browser testing pending
- **Symptôme** : QA n'a couvert que Chrome desktop + Safari iOS.
  Firefox, Edge, Samsung Internet, Safari macOS n'ont pas été
  exercés sur les flows complets.
- **Risque** : bugs spécifiques navigateur (autofill, cookies tiers,
  date inputs) à découvrir en production.
- **Fix** : passer `QA_SMOKE.md` sur 5 navigateurs × 2 viewports.
  Voir POST_LAUNCH_ROADMAP D+60 item 7.

### m4 — `aria-current` manquant sur QuestionGrid
- **Fichier** : `apps/web/components/exam/QuestionGrid.tsx`
- **Symptôme** : les boutons numérotés n'ont pas `aria-current="true"`
  sur la question en cours. Atténué par le label "(en cours)" qui est
  bien annoncé par les lecteurs d'écran.
- **Impact** : acceptable selon `A11Y.md`, à corriger si ressource.

### m5 — `prefers-reduced-motion` non respecté pour la `WelcomeStrip`
- **Fichier** : `apps/web/components/brand/WelcomeStrip.tsx`,
  `apps/web/app/globals.css`
- **Symptôme** : le marquee et les animations `rise-init` continuent
  même quand l'utilisateur a activé "réduire les mouvements" système.
- **Impact** : RGAA / WCAG 2.1 — recommandé non bloquant.
- **Fix** : règle `@media (prefers-reduced-motion: reduce)` dans
  `globals.css` qui force `animation-duration: 0s`.

### m6 — Contraste `text-bone/60` sur fond aubergine
- **Symptôme** : ratio à la limite WCAG AA (4.5:1) sur le footer et
  certains sous-titres.
- **Impact** : confort de lecture pour les utilisateurs malvoyants.
- **Fix** : passer `text-bone/60` → `text-bone/75` minimum (validation
  designer requise). Voir `A11Y.md` "Restent à traiter".

---

## ⚪ Dette technique

### D1 — Packages mobile non utilisés
- **Fichier** : `apps/mobile/package.json`
- **Symptôme** : `expo-auth-session`, `expo-crypto`,
  `expo-web-browser` ne sont plus importés (migration Google Sign-In
  vers SDK natif). Encore présents → gonflent le bundle.
- **Impact** : ~200-300 Ko de bundle gaspillés, charge cognitive à la
  lecture.
- **Fix** : retirer du `package.json`, `pnpm install`, build preview
  pour valider qu'aucune référence transitive ne dépend d'eux.

### D2 — Route webhook Stripe legacy (mobile)
- **Fichier** : `apps/server/src/routes/payments/index.ts`
- **Symptôme** : `/payments/webhook/stripe` reste exposé alors que les
  achats mobile passent désormais par RevenueCat (qui appelle
  `/payments/webhook/revenuecat`). Le webhook Stripe sert encore au
  web — donc on ne peut pas le supprimer, mais le commentaire
  documentaire dans `PROJECT_STATUS.md` ("code legacy non utilisé") est
  trompeur.
- **Fix** : mettre à jour `PROJECT_STATUS.md` pour clarifier que le
  webhook Stripe est **utilisé par le flux web** et pas legacy.

### D3 — Backend `/privacy` et `/terms` servent du Markdown maison
- **Fichier** : `apps/server/src/index.ts` (lignes ~146-174)
- **Symptôme** : le backend rend lui-même la politique de
  confidentialité et les CGU à partir des `.md` dans `store/` via un
  regex Markdown ad-hoc. Le web a ses propres pages
  (`apps/web/app/privacy/page.tsx`) qui sont la version "officielle".
- **Impact** : risque de divergence — modifier le `.md` change la
  version mobile/backend mais pas la version web (et vice-versa).
- **Fix** : à terme, supprimer les routes backend HTML et faire
  pointer mobile vers `https://civique.integrafle.fr/privacy` directement.

### D4 — `STRIPE_PRICES` avec fallback en dur
- **Fichier** : `apps/server/src/routes/payments/index.ts` (lignes
  ~15-19)
- **Symptôme** : les `priceId` ont un fallback hardcodé (un
  `price_1TG5...` Stripe). Si la variable d'env est manquante en
  production, le user paye sur un product Test au lieu du Live.
- **Risque** : silence dangereux. Mieux vaut crasher au boot si la
  variable est absente.
- **Fix** : faire de `STRIPE_PRICE_WEEKLY/MONTHLY/SEMIANNUAL` des
  variables **obligatoires** dans `config/env.ts` (Zod required).

### D5 — Pas de tests automatisés
- **Symptôme** : aucun `vitest`, `jest`, `playwright`. Tout repose sur
  `QA_SMOKE.md` exécuté à la main.
- **Impact** : régressions difficiles à détecter à mesure que le
  surface grandit.
- **Décision MVP** : assumée. Voir `CLAUDE.md` "Recent decisions".
  Première étape post-launch : `@axe-core/playwright` sur les flows
  critiques (auth + 1 training session + 1 checkout test mode).

### D6 — Sentry uniquement sur mobile
- **Symptôme** : ni le web (`apps/web`) ni le backend (`apps/server`)
  n'a Sentry installé. Une erreur 500 silencieuse peut rester
  inaperçue.
- **Fix** : voir POST_LAUNCH_ROADMAP D+30 item 1.

### D7 — Question seed in TS, pas de panneau admin
- **Symptôme** : les 611 questions sont en `.ts` statique. Corriger
  une typo nécessite un push + déploiement. Pas viable à long terme.
- **Fix** : voir POST_LAUNCH_ROADMAP D+90 item 4.

---

## Bugs connus côté stores (mobile)

Repris depuis `PROJECT_STATUS.md` pour avoir le panorama complet :

- **iOS IAP non visibles** tant qu'Apple n'a pas approuvé le build +
  les IAP (normal, première soumission).
- **Google Sign-In sur Huawei sans GMS** : ne fonctionne pas (le SDK
  natif requiert Google Play Services).

---

## Workflow pour signaler un nouveau bug

1. Reproduire (ou décrire un repro raisonnable).
2. Vérifier qu'il n'est pas déjà dans ce document.
3. Ajouter une entrée dans la section de sévérité appropriée :
   - **Fichier** : chemin absolu depuis la racine
   - **Symptôme** : ce que l'utilisateur voit
   - **Bloquant pour** : quel parcours est cassé
   - **Fix** : pistes ou ETA renvoyant vers `POST_LAUNCH_ROADMAP.md`
4. Si bloquant : ouvrir aussi une issue GitHub avec le label `bug` +
   `P0` ou `P1`.

---

*Document maintenu en parallèle de la roadmap. Un bug rajouté ici doit
soit recevoir un fix dans les 30 jours, soit être déplacé dans la
section dette technique avec justification.*
