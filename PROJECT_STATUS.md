# Civique — Project Status
**Last updated**: 12 avril 2026  
**Commit**: `327636d` — migrate Google Sign-In to native SDK

---

## Architecture

| Composant | Stack | Emplacement |
|---|---|---|
| Mobile | Expo SDK 54, React Native 0.81.5, TypeScript | `apps/mobile/` |
| Backend | Fastify, Drizzle ORM, PostgreSQL | `apps/server/` |
| Shared | Types + constants partagés | `packages/shared/` |
| Infra | Hetzner VPS, Nginx, PM2, Let's Encrypt | `ssh root@api.integrafle.fr` |

**Monorepo** pnpm workspaces  
**API URL** : `https://api.integrafle.fr`  
**Bundle ID / Package** : `com.civique.app`

---

## Comptes et accès

| Service | Identifiant |
|---|---|
| GitHub | https://github.com/Nissoux/Civique |
| Expo | owner: `nissouz`, project ID: `5a34a1b4-9159-42f9-84e8-458eda387f4e` |
| Apple Developer | Team ID: `N68KLMZ9DW`, Apple ID: `anis.dah@proton.me` |
| App Store Connect | App ID: `6761684101` |
| Google Cloud Console | Projet: `CIVIQUE` (ID: `civique-492312`) |
| RevenueCat | Projet: Civique (API keys ci-dessous) |
| Sentry | DSN configuré dans `_layout.tsx` |
| Brevo | API HTTP pour emails transactionnels |

---

## OAuth Clients (Google Cloud Console)

| Type | Client ID | Usage |
|---|---|---|
| **iOS** | `593427095159-374od3aoal2tvm9lutvp383po7kaknrf` | Google Sign-In iOS (bundle: `com.civique.app`) |
| **Android** | `593427095159-lq6gta272m2fulbfporu887i60c0kd59` | Google Play Services (package: `com.civique.app`, SHA-1: `D3:51:8A:F7:8A:81:86:04:72:EC:87:88:B7:04:A1:CE:D2:24:45:05`) |
| **Web** | `593427095159-ccfousaqelr1rj1mk9ojhifbo87levud` | `webClientId` pour idToken backend verification |

**Important** : le SHA-1 Android doit correspondre au keystore EAS production (`eas credentials --platform android`).

---

## RevenueCat

| Clé | Valeur |
|---|---|
| Apple API Key | `appl_nQxYIjvONBNnMwfRyQIfvWjkkcm` |
| Google API Key | `goog_NyEtOpLwYjFGSBcAQPygeTmhMYs` |
| Entitlement | `Civique Pro` (casse et espace importants) |
| Offering | `default` (doit être "Current") |

### Packages RevenueCat (offering `default`)

| Package ID | iOS Product | Android Product |
|---|---|---|
| `$rc_weekly` | `civique_weekly` | `civique_weekly:weekly-base` |
| `$rc_monthly` | `civique_monthly` | `civique_monthly:monthly-base` |
| `$rc_six_month` | `civique_six_month` | `civique_six_month:six-month-base` |

### Prix

| Plan | Prix |
|---|---|
| Hebdomadaire | 3,99 EUR/semaine |
| Mensuel | 10,99 EUR/mois |
| Semestriel | 39,99 EUR/6 mois |

---

## Codes promo (backend)

| Code | Durée | Max utilisations |
|---|---|---|
| `CIVIQUE2026` | 365 jours | 100 |
| `BIENVENUE` | 30 jours | 500 |
| `TESTPREMIUM` | 7 jours | 10 |

**Note** : les codes promo sont masqués sur iOS (`Platform.OS !== 'ios'`) pour conformité Apple 3.1.1.

---

## API Endpoints

### Base URL : `https://api.integrafle.fr/api`

### Auth (`/auth`)

| Méthode | Path | Auth | Description |
|---|---|---|---|
| POST | `/register` | - | Inscription email/password |
| POST | `/login` | - | Connexion email/password |
| POST | `/verify-email` | JWT | Vérifier email (code 6 chiffres) |
| POST | `/resend-verification` | JWT | Renvoyer code de vérification |
| POST | `/refresh` | - | Rafraîchir les tokens JWT |
| GET | `/me` | JWT | Profil utilisateur |
| PATCH | `/me` | JWT | Modifier profil |
| DELETE | `/me` | JWT | Supprimer compte (cascade manuelle) |
| POST | `/change-password` | JWT | Changer mot de passe |
| POST | `/forgot-password` | - | Demander reset MDP (email Brevo) |
| POST | `/reset-password` | - | Réinitialiser MDP avec token |
| POST | `/google` | - | Google Sign-In (idToken) |
| POST | `/apple` | - | Apple Sign-In (identityToken) |

### Questions (`/questions`)

| Méthode | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | - | Liste avec filtres (themeId, type, difficulty, isPremium, examType, lang, limit, offset) |
| GET | `/random` | - | Questions aléatoires (perTheme distribution) |
| GET | `/:id` | - | Question par ID |

### Examens (`/exams`)

| Méthode | Path | Auth | Description |
|---|---|---|---|
| POST | `/start` | JWT | Démarrer examen (40q : 28 connaissances + 12 situations) |
| GET | `/:sessionId` | JWT | Récupérer session d'examen |
| POST | `/:sessionId/answer` | JWT | Soumettre réponse |
| POST | `/:sessionId/finish` | JWT | Terminer et calculer score |
| GET | `/history` | JWT | Historique des examens (paginé) |
| GET | `/:sessionId/results` | JWT | Résultats détaillés par thème |

### Fiches (`/fiches`)

| Méthode | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | - | Liste fiches de révision (themeId, isPremium, lang, limit, offset) |
| GET | `/:id` | - | Fiche par ID |

### Stats (`/stats`)

| Méthode | Path | Auth | Description |
|---|---|---|---|
| GET | `/overview` | JWT | Vue d'ensemble (total, accuracy, streak, exams) |
| GET | `/by-theme` | JWT | Performance par thème |
| GET | `/weak-areas` | JWT | Thèmes < 60% de réussite |
| GET | `/history` | JWT | Historique jour par jour |
| GET | `/quota` | JWT | Quota gratuit restant |
| POST | `/practice` | JWT | Enregistrer réponse (check quota free users) |

### Social (`/social`)

| Méthode | Path | Auth | Description |
|---|---|---|---|
| GET | `/leaderboard` | - | Top scorers (week/month/all) |
| GET | `/friends` | JWT | Liste amis / demandes |
| POST | `/friends/request` | JWT | Envoyer demande d'ami |
| PATCH | `/friends/:id` | JWT | Accepter/refuser demande |
| POST | `/challenges` | JWT | Créer un défi |
| GET | `/challenges` | JWT | Liste des défis |
| GET | `/challenges/:id` | JWT | Détail défi + questions |
| POST | `/challenges/:id/answer` | JWT | Répondre au défi |
| POST | `/challenges/:id/finish` | JWT | Terminer le défi |
| GET | `/comments` | JWT | Commentaires sur une question |
| POST | `/comments` | JWT | Créer commentaire |
| DELETE | `/comments/:id` | JWT | Supprimer commentaire |

### Payments (`/payments`)

| Méthode | Path | Auth | Description |
|---|---|---|---|
| GET | `/subscription` | JWT | Statut abonnement |
| POST | `/create-checkout` | JWT | Créer session Stripe checkout |
| POST | `/webhook/stripe` | - | Webhook Stripe (non utilisé, legacy) |
| POST | `/webhook/revenuecat` | - | Webhook RevenueCat |
| POST | `/redeem-code` | JWT | Valider code promo |
| POST | `/admin/create-code` | Admin | Créer codes promo |

### Autres

| Méthode | Path | Description |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/privacy` | Page politique de confidentialité (HTML) |
| GET | `/terms` | Page conditions d'utilisation (HTML) |

---

## Écrans Mobile (Expo Router)

### Auth
- `(auth)/login` — Connexion (email, Google, Apple)
- `(auth)/register` — Inscription
- `(auth)/forgot-password` — Mot de passe oublié
- `(auth)/verify-email` — Vérification email (code 6 chiffres)

### Tabs (navigation principale)
- `(tabs)/index` — Home (Bonjour, XP, streaks, parcours d'apprentissage)
- `(tabs)/flashcards` — Sessions rapides (10q : 7 connaissances + 3 situations)
- `(tabs)/glossaire` — Glossaire (FlatList optimisé, 150+ termes)
- `(tabs)/exams` — Examens blancs (40 questions)
- `(tabs)/profile` — Profil utilisateur
- `(tabs)/choose-exam` — Choix du type d'examen (CSP/CR/NAT)
- `(tabs)/stats` — Statistiques détaillées
- `(tabs)/fiches` — Fiches de révision
- `(tabs)/train` — Entraînement par thème

### Écrans secondaires
- `exam/session` — Session d'examen en cours
- `exam/results` — Résultats d'examen
- `train/[themeId]` — Entraînement par thème
- `train/random` — Entraînement aléatoire
- `fiches/[id]` — Détail d'une fiche
- `social/leaderboard` — Classement
- `social/friends` — Amis
- `social/challenges` — Défis
- `settings/subscription` — Écran d'abonnement Premium
- `onboarding` — Onboarding (première ouverture)
- `chronologie` — Chronologie historique

---

## Authentification

| Méthode | Statut | Librairie |
|---|---|---|
| Email + mot de passe | ✅ Fonctionnel | bcrypt 12 rounds, JWT 15min/7d |
| Google Sign-In | ✅ Fonctionnel | `@react-native-google-signin/google-signin` (SDK natif) |
| Apple Sign-In | ✅ Fonctionnel | `expo-apple-authentication` |
| Vérification email | ✅ Fonctionnel | Brevo API HTTP (code 6 chiffres) |
| Reset mot de passe | ✅ Fonctionnel | Brevo API HTTP |

**Note historique** : Google Sign-In utilisait initialement `expo-auth-session` (browser flow) qui a échoué en production pour 5 raisons différentes (versions SDK incompatibles, unsupported_response_type, PKCE, Unmatched Route expo-router, politique OAuth compliance). Migré vers le SDK natif `@react-native-google-signin/google-signin` le 12/04/2026 — solution officielle recommandée par Expo et Google. **Leçon : toujours lire la doc officielle avant d'implémenter.**

---

## Sécurité

- Helmet (headers HTTP)
- CORS production only (`https://api.integrafle.fr`)
- Bcrypt 12 rounds pour les passwords
- JWT 15min access token / 7d refresh token
- Rate limiting 100 req/min
- Google OAuth vérifié via `google-auth-library`
- Apple OAuth vérifié via clés publiques + iss/aud/exp
- Graceful shutdown (SIGTERM/SIGINT)
- Admin secret séparé
- Sentry error tracking
- Suppression de compte (Apple requirement, RGPD)

---

## Données

- **611 questions** (connaissances + mises en situation)
- **5 thèmes** : Principes et valeurs, Institutions, Droits et devoirs, Histoire, Société
- **5 langues de traduction** : Arabe, Espagnol, Farsi, Hindi, Portugais (3050 traductions)
- **5+ fiches** de révision
- **150+ termes** de glossaire
- **3 types d'examen** : Carte de séjour (CSP), Carte de résident (CR), Nationalité (NAT)

---

## Design System

- **Claymorphism** : bordures arrondies généreuses, surfaces semi-transparentes (dark mode), opaques (light mode)
- **Dark mode complet** avec `useColors()` hook
- **Composants animés** : AnimatedPressable, AnimatedCard, CMotif, ProgressRing, AnimatedCounter, ShimmerLoader, GlassCard, MotiView
- **Tab bar flottante** avec haptic feedback + animations
- **Hero gradient** + parallax
- **Duolingo-style progression** : XP, streaks, couronnes (60% = 1, 80% = 2, 100% = 3)

---

## Compliance Apple

| Guideline | Statut | Détail |
|---|---|---|
| **3.1.1** — IAP obligatoire | ✅ Corrigé | Code promo masqué sur iOS (`Platform.OS !== 'ios'`), IAP via StoreKit/RevenueCat |
| **2.3.10** — Métadonnées tierces | ✅ Corrigé | "Google Play" retiré du binaire iOS via fichiers platform-specific (`subscription-strings.ios.ts` / `.android.ts`) |
| **Suppression de compte** | ✅ | `DELETE /auth/me` avec cascade manuelle |
| **Apple Sign-In** | ✅ | Obligatoire si Google Sign-In est proposé |
| **RGPD** | ✅ | Politique de confidentialité à `/privacy`, CGU à `/terms` |

---

## Déploiement

### Backend (VPS Hetzner)
- PM2 process manager
- Nginx reverse proxy
- Let's Encrypt HTTPS
- PostgreSQL local

### Mobile — Builds EAS

| Plateforme | Profile | Commande |
|---|---|---|
| Android preview (APK) | `preview` | `eas build --profile preview --platform android` |
| Android production (AAB) | `production` | `eas build --profile production --platform android` |
| iOS production (IPA) | `production` | `eas build --profile production --platform ios` |
| Submit iOS | `production` | `eas submit --profile production --platform ios --latest` |
| Submit Android | `production` | `eas submit --profile production --platform android --latest` |

### EAS Credentials Android
- **Keystore type** : JKS
- **SHA-1** : `D3:51:8A:F7:8A:81:86:04:72:EC:87:88:B7:04:A1:CE:D2:24:45:05`
- **SHA-256** : `E4:F8:9D:37:07:33:D7:22:9B:A5:3D:CC:D2:70:AC:E1:C1:23:44:6B:52:46:D5:5D:80:98:88:5D:B8:22:81:57`

---

## État actuel des soumissions stores

### Apple App Store
- **Statut** : Rejetée (build 9), en préparation resoumission (build 10 en cours)
- **Rejets corrigés** : 3.1.1 (code promo) + 2.3.10 (Google Play dans binaire)
- **IAP** : 3 abonnements créés, "Prêts à soumettre" (seront reviewés avec le binaire)
- **Build 10** : commit `327636d`, inclut Google Sign-In natif + tous les fixes

### Google Play Store
- **Statut** : AAB en internal testing
- **IAP** : 3 abonnements créés et "Published" (actifs)
- **Google Sign-In** : ✅ Testé et fonctionnel sur Android preview
- **Abonnements** : ✅ Testés et fonctionnels avec license tester
- **Reste à faire** : Trouver 20 testeurs pour le track internal (exigence Google 14 jours)

---

## Bugs connus / Limitations

1. **iOS IAP pas visibles** tant que Apple n'approuve pas le build + les IAP (normal, première soumission)
2. **Google Sign-In sur Huawei sans GMS** : ne fonctionnera pas (le SDK natif requiert Google Play Services)
3. **Webhook Stripe** : code legacy non utilisé (tout passe par RevenueCat), à supprimer en v1.1
4. **expo-auth-session + expo-crypto** : packages encore dans `package.json` mais plus importés — à retirer en v1.1

---

## Prochaines étapes (post-soumission)

| Priorité | Tâche |
|---|---|
| **P0** | Rebuilder iOS production (build 10) + soumettre à Apple |
| **P0** | Soumettre Android production sur Google Play |
| **P1** | Trouver 20 testeurs Google Play (internal testing 14 jours) |
| **P2** | Mode hors ligne (cache des questions) |
| **P2** | Synchronisation progression côté serveur |
| **P3** | Notifications push (rappels d'entraînement) |
| **P3** | Audio pour les questions (public peu alphabétisé) |
| **P3** | Retirer packages inutilisés (expo-auth-session, expo-crypto, webhook Stripe) |

---

*Généré le 12 avril 2026 — commit `327636d`*
