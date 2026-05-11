# Civique — Feuille de route post-lancement (D+30 / D+60 / D+90)

Document de pilotage technique pour les trois mois qui suivent le lancement
public de `civique.integrafle.fr` et la mise en production des apps iOS/Android. Chaque
item suit le format **POURQUOI / QUOI / COMMENT** + ordre de grandeur du
coût (temps homme + euros si récurrent).

> Lire en parallèle de [`KNOWN_ISSUES.md`](./KNOWN_ISSUES.md) et de
> [`PROJECT_STATUS.md`](./PROJECT_STATUS.md). Les "Recent decisions" de
> [`CLAUDE.md`](./CLAUDE.md) figent les arbitrages déjà tranchés — ne pas
> les reproposer ici.

---

## D+30 — Stabiliser

Objectif : tenir la première vague d'utilisateurs sans incident bloquant,
mesurer la réalité du terrain, corriger les bugs de la première semaine.
Aucune nouvelle fonctionnalité.

### 1. Monitoring d'erreurs serveur + web (Sentry)
- **Pourquoi** : aucune télémétrie d'erreur côté web aujourd'hui — un 500
  silencieux peut durer des jours avant qu'un user le signale. Mobile a
  déjà Sentry, web et serveur n'en ont pas.
- **Quoi** : installer Sentry sur `apps/web` (via `@sentry/nextjs`) et sur
  `apps/server` (via `@sentry/node`). Définir un seul DSN par
  environnement, capturer 100 % des erreurs (volume faible au début).
- **Comment** : `pnpm --filter web add @sentry/nextjs` puis
  `npx @sentry/wizard@latest -i nextjs`. Côté serveur, init dans
  `apps/server/src/index.ts` avant les routes. **1h30 setup, 0 €/mois**
  (free tier Sentry SaaS suffit pour < 5k events/mois) ou **2h setup, 0 €/mois**
  si auto-hébergé sur le VPS (Docker compose officiel).

### 2. Uptime + alertes
- **Pourquoi** : si Nginx, PM2 ou Postgres tombe, on doit le savoir avant
  l'utilisateur. Aujourd'hui aucune sonde externe.
- **Quoi** : ping HTTP toutes les 5 min sur `https://civique.integrafle.fr` et
  `https://api.integrafle.fr/health`, alerte mail + SMS.
- **Comment** : compte gratuit Uptime Robot, 2 monitors, 50 contacts
  par défaut. **30 min, 0 €/mois** (jusqu'à 50 monitors gratuits).

### 3. Quotidien : backups Postgres
- **Pourquoi** : `infra/backup-db.sh` existe mais n'est pas branché en
  cron. Un `DROP TABLE` accidentel = perte totale.
- **Quoi** : cron daily à 03:00 UTC qui dump `civique` vers
  `/var/backups/civique/civique-YYYY-MM-DD.sql.gz`, rotation 14 jours,
  copie hors VPS (S3 / B2 / Hetzner Storage Box).
- **Comment** : `crontab -e` sur le VPS, dump via `pg_dump | gzip`,
  upload avec `rclone copy` vers Hetzner Storage Box. **2h setup,
  4 €/mois** (Hetzner Storage Box 100 GB).

### 4. Performance baseline web
- **Pourquoi** : on ignore la vraie latence vue utilisateur. Lighthouse
  local n'a été passé qu'une fois sur la landing.
- **Quoi** : mesurer LCP, INP, CLS sur 5 pages clés (`/`, `/login`,
  `/app`, `/app/train/1/1`, `/app/exams`) avec WebPageTest gratuit
  depuis Paris et Casablanca. Documenter chiffres dans `PROJECT_STATUS.md`
  pour comparaison future.
- **Comment** : 5 runs WebPageTest manuels + Lighthouse CI sur Vercel
  preview ou run local. **2h, 0 €**.

### 5. Auditer + fixer les bugs remontés J+1 à J+30
- **Pourquoi** : c'est statistiquement la fenêtre où sortent les bugs
  qu'aucun smoke test n'avait attrapés (cas limites, navigateurs
  exotiques, comptes en état bizarre).
- **Quoi** : revue quotidienne pendant 10 jours, hebdomadaire ensuite.
  Tenir une liste FIFO dans `KNOWN_ISSUES.md`. Ne shipper qu'après
  reproduction + fix testé.
- **Comment** : créer un canal Slack/Telegram « civique-bugs » privé,
  triager chaque soir. **~30 min/jour pendant 30 jours**.

### 6. Migrer `passwordResetTokens` en BDD
- **Pourquoi** : la map est en mémoire dans `apps/server/src/routes/auth/index.ts`.
  Un `pm2 restart` invalide tous les codes en cours. Pas critique mais
  surprenant pour l'utilisateur ("le code ne marche plus").
- **Quoi** : table `password_reset_tokens` (id, code uppercase, email,
  expires_at), avec index sur `code`. GC manuel ou via cron toutes les
  heures.
- **Comment** : nouvelle migration Drizzle + remplacement de la `Map`.
  **2h dev + tests**.

### 7. Compléter les mentions légales
- **Pourquoi** : obligation légale française dès la première transaction
  Stripe. Aujourd'hui placeholders visibles en jaune.
- **Quoi** : saisir raison sociale, statut juridique, adresse,
  RCS/SIRET/TVA, nom du directeur de publication. Retirer le bloc
  `role="note"` jaune une fois rempli.
- **Comment** : récupérer les infos officielles, remplacer
  `<PlaceholderText>...</PlaceholderText>` par les valeurs réelles dans
  `apps/web/app/mentions-legales/page.tsx`. **45 min** une fois les
  infos en main.

### 8. Documenter les premières métriques produit
- **Pourquoi** : sans données, impossible de prioriser D+60. On veut
  savoir : taux d'inscription→vérification, vérification→première
  question, première question→examen, examen→Premium.
- **Quoi** : choisir un outil RGPD-compliant (Plausible auto-hébergé ou
  Umami). Tagger les 4-5 événements clés via custom events.
- **Comment** : Plausible CE en Docker sur le même VPS (port 8000,
  derrière Nginx). **3h setup, 0 €/mois** auto-hébergé (vs 9 €/mois SaaS).

---

## D+60 — Grandir

Objectif : convertir les premiers signaux (bugs, feedback, conversion
Premium) en améliorations ciblées. Premier travail SEO + rétention.

### 1. SEO contenu : 5 articles de fond
- **Pourquoi** : la landing seule ne suffit pas à capter le trafic
  organique sur "examen citoyenneté française", "naturalisation
  questions", "carte de séjour examen", etc.
- **Quoi** : 5 articles markdown éditorialisés dans
  `apps/web/app/(blog)/` (à créer) : « Comment se préparer à l'examen
  CSP », « Différence CSP / CR / NAT », « Les 5 thèmes officiels »,
  « Que faire en cas d'échec », « Témoignages d'utilisateurs ». 600-900
  mots chacun, optimisés Search Console.
- **Comment** : sous-route `/guide`, sitemap auto, schéma `Article` JSON-LD,
  CTA vers inscription. **3 jours de rédaction + 1 jour intégration**.

### 2. Notifications email de rétention (jour 3, jour 7, jour 14)
- **Pourquoi** : un user qui s'inscrit et ne revient pas est perdu.
  Brevo est déjà branché, autant l'utiliser.
- **Quoi** : 3 emails séquentiels — J+3 « Reprenez où vous en étiez »,
  J+7 « Vous êtes à X% du thème Y », J+14 « Avez-vous essayé les
  examens blancs ? ». Tous opt-out en un clic.
- **Comment** : job cron quotidien sur le serveur qui interroge
  `practice_logs.lastSeenAt` et fanout vers Brevo. **1.5 jour dev** +
  copywriting.

### 3. Métrique de rétention D+7 / D+30
- **Pourquoi** : LTV, CAC, et churn prévisionnel dépendent de cette
  métrique. Sans elle, impossible de calibrer le coût d'acquisition.
- **Quoi** : table `user_activity_daily` (userId, date, sessionsCount),
  alimentée par `recordPractice`. Vue Drizzle ou requête ad-hoc pour
  computer D+7/D+30 par cohorte hebdomadaire.
- **Comment** : 1 migration + 1 endpoint admin `/admin/cohorts`.
  **1 jour dev**.

### 4. Comments full-thread page
- **Pourquoi** : la preview dans `TrainingSession` montre 3 commentaires
  + un lien `Voir tous`. Aujourd'hui ce lien pointe nulle part — feature
  reportée mais visible côté UI. Soit on cache le lien, soit on livre.
- **Quoi** : route `/app/questions/[id]/discussion` avec threads
  imbriqués, pagination, signalement. La route backend `/social/comments`
  existe déjà.
- **Comment** : page Next.js + actions serveur, hydratation côté client
  pour pagination. **2.5 jours dev**.

### 5. Audio des questions (TTS pour public peu alphabétisé)
- **Pourquoi** : cas d'usage central — l'examen vise un public dont
  certains lisent peu. C'est aussi un différenciant fort vs concurrents
  textuels.
- **Quoi** : générer un MP3 par question (FR uniquement v1) au build,
  jouer via `<audio>` sur la fiche question. ~600 fichiers × 50 Ko ≈ 30 Mo,
  servis statiquement.
- **Comment** : script `pnpm --filter server tts:generate` qui appelle
  ElevenLabs ou Azure TTS, sortie `apps/web/public/audio/q-{id}.mp3`,
  fallback Web Speech API si pas de réseau. **2 jours dev + 30-60 €
  one-shot** (génération une fois).

### 6. Améliorer l'enrichissement backend des challenges
- **Pourquoi** : `ChallengePlay.tsx` constate (commentaire ligne 47) que
  `/challenges/:id` ne renvoie pas `correctChoice`, `explanationFr` ni
  traductions. Conséquence : feedback dégradé en mode défi vs mode
  entraînement.
- **Quoi** : étendre le payload `getChallengeQuestions` côté serveur pour
  inclure ces champs, ajuster le typage `ChallengeQuestionRow`,
  réactiver l'affichage complet dans le composant.
- **Comment** : 1 modif dans `apps/server/src/routes/social/index.ts` +
  ajustement du composant web. **3h dev**.

### 7. Cross-browser testing officiel
- **Pourquoi** : on n'a testé que Chrome desktop + Safari iOS. Firefox,
  Edge, Samsung Internet, Safari macOS ont des comportements différents
  (autofill, dates, cookies).
- **Quoi** : passer la checklist `QA_SMOKE.md` sur 5 navigateurs ×
  2 viewports (mobile + desktop). Documenter les écarts dans `KNOWN_ISSUES.md`.
- **Comment** : BrowserStack en mode trial gratuit (100 min) ou tests
  manuels sur les navigateurs locaux. **1 jour**.

### 8. Confettis sur level perfection
- **Pourquoi** : aujourd'hui les confettis ne se déclenchent que sur
  passage d'examen blanc. Quand un user complète un niveau à 100 %, rien.
  Renforcement positif manquant.
- **Quoi** : trigger `<Confetti />` (déjà présent) à la fin de
  `TrainingSession` quand `correctCount === total` ET `isRandom === false`.
- **Comment** : 1 ligne dans le `useEffect` de fin de session.
  **30 min dev + 15 min test visuel**.

---

## D+90 — Échelle

Objectif : ce qui ne rentrait pas avant le MVP — refactos lourds,
nouveaux types d'examen, parité mobile-web.

### 1. Parité mobile-web : challenges + leaderboard
- **Pourquoi** : la version web a déjà tout ; la version mobile manque
  les écrans social complets. Un user qui passe de mobile à web est
  surpris (et inversement).
- **Quoi** : porter `/social/challenges` et `/social/leaderboard` mobile
  → écrans Expo Router équivalents avec le même backend.
- **Comment** : réutiliser les types `@civique/shared`, écrire les
  écrans à la Tisserand mobile (claymorphism). **5 jours dev mobile**.

### 2. Mode hors ligne mobile
- **Pourquoi** : public cible = transports, files d'attente, zones sans
  4G. Aujourd'hui mobile crash sans réseau.
- **Quoi** : cache local des 611 questions + fiches via SQLite (expo-sqlite)
  ou AsyncStorage, sync delta toutes les 24 h. Mode "Train hors ligne"
  qui rejoue les stats à la reconnexion.
- **Comment** : `expo-sqlite`, store Zustand persisted, queue d'actions
  side-effect. **8 jours dev mobile + tests réseau coupé**.

### 3. Nouveaux types d'examen : DELF / TCF
- **Pourquoi** : les examens CSP/CR/NAT couvrent uniquement la branche
  civique. Beaucoup d'utilisateurs préparent aussi le DELF A2 / TCF.
- **Quoi** : nouveau `examType` côté schéma (`'DELF_A2' | 'TCF_IRN'`),
  question banks dédiées, sélection au moment du onboarding.
- **Comment** : rédaction + seed de 200 nouvelles questions DELF,
  adaptation des écrans `choose-exam`. **15 jours rédaction + 5 jours
  dev**.

### 4. Refacto questions seed → BDD éditable
- **Pourquoi** : les 611 questions sont en TS statique
  (`apps/server/src/db/questions_themeN.ts`). Toute correction nécessite
  un déploiement. Pas viable à long terme.
- **Quoi** : interface admin minimale (route `/admin/questions`,
  protégée par `ADMIN_SECRET`) pour éditer, ajouter, masquer une
  question. Données vivent désormais en table `questions`.
- **Comment** : page Next.js d'admin, formulaire WYSIWYG simple,
  preview live. **6 jours dev**.

### 5. Push notifications mobile (rappels d'entraînement)
- **Pourquoi** : streak Duolingo-style demande un push quotidien pour
  fonctionner. Sans ça, la mécanique reste fragile.
- **Quoi** : `expo-notifications`, opt-in à l'onboarding, push quotidien
  à 19:00 locale (configurable). Pas de push commercial — uniquement
  streak.
- **Comment** : Expo Push Service (gratuit), tokens stockés côté serveur,
  cron quotidien. **4 jours dev mobile + 1 jour backend**.

### 6. Internationalisation complète UI web
- **Pourquoi** : aujourd'hui les questions sont traduites en 5 langues
  mais l'UI web (boutons, menus) reste en français. Un user arabophone
  voit la question en arabe mais "Suivante" en français.
- **Quoi** : i18n côté Next.js (next-intl ou `react-intl`), 5 locales,
  switcher persistant en cookie.
- **Comment** : extraction des strings → fichiers JSON, traduction
  professionnelle (~300 strings × 5 langues × 0,15 €/mot ≈ 200 €).
  **5 jours dev + 1 semaine traduction externe**.

### 7. Audit sécurité externe
- **Pourquoi** : avant de monter au-delà de 5k users payants, faire
  passer un audit indépendant (OWASP top 10, dépendances vulnérables,
  hardening serveur).
- **Quoi** : audit en boîte noire + revue de code, livré sous forme de
  rapport priorisé.
- **Comment** : prestataire spécialisé (ex: Yes We Hack via Pentest as
  a Service). **1500-3000 € one-shot, 2 jours de remédiation post-rapport**.

### 8. Suppression du legacy
- **Pourquoi** : `expo-auth-session`, `expo-crypto`, ancien code webhook
  Stripe (le mobile passe par RevenueCat). Ça gonfle le bundle et
  rend la lecture plus difficile.
- **Quoi** : retirer ces packages, supprimer les imports morts,
  désactiver les routes webhook qui ne sont plus utilisées.
- **Comment** : commit chirurgical après QA mobile. **3h dev + 1h
  vérification**.

---

## Tableau de bord récap

| Période | Items | Effort total estimé | Coût récurrent ajouté |
|---|---|---|---|
| D+30 | 8 | ~7 jours dev | ~4 €/mois (backups) |
| D+60 | 8 | ~17 jours dev + 4 jours rédaction | ~0-10 €/mois (TTS one-shot) |
| D+90 | 8 | ~52 jours dev + 15 jours rédaction | ~0 € (audit one-shot 1500-3000 €) |

Ces chiffres supposent un dev expérimenté sur la stack. Un dev moins
familier doublera l'estimation. **Toujours réserver 25 % de marge pour
l'imprévu**.

---

*Document maintenu à chaque sprint. Coche les items terminés mais ne les
supprime pas — l'historique sert au prochain quarterly.*
