# Civique — Rapport Final de Projet

**Date de clôture** : 8 avril 2026
**Durée totale** : ~24 heures sur 2 jours

---

## Statut : APPLICATION DÉPLOYÉE 🚀

| Plateforme | Statut |
|-----------|--------|
| **iOS (App Store)** | ✅ Build uploadé, fiche en cours de finalisation |
| **Android (Google Play)** | ✅ Build soumis, en attente de 20 testeurs (14 jours) |
| **API serveur** | ✅ En production sur https://api.integrafle.fr |

---

## Ce qui a été construit

### Application mobile (React Native / Expo SDK 54)
- **610 questions** d'entraînement (connaissances + mises en situation)
- **3065 traductions** en 5 langues (arabe, espagnol, farsi, hindi, portugais)
- **5 thèmes** civiques couvrant tout le programme
- **3 objectifs** : CSP, Carte de Résident, Nationalité française
- **Système Duolingo** : niveaux, couronnes (⭐60% ⭐⭐80% ⭐⭐⭐100%), XP, streaks
- **Examens blancs** : 40 questions, 45 minutes, conditions réelles
- **Flashcards** : sessions de 10 questions (7 connaissances + 3 mises en situation)
- **Glossaire** et **fiches de révision** thématiques
- **Social** : classement, amis, défis
- **6 langues** avec français toujours en texte principal

### Design & UX
- **Claymorphism** (recommandation UI/UX Pro Max Skill)
- **Logo C tricolore** intégré partout (login, onboarding, splash, icon)
- **Tab bar flottante** custom avec animations
- **Composants animés** : AnimatedPressable, AnimatedCard, CMotif, ProgressRing, AnimatedCounter, ShimmerLoader, GlassCard, MotiView
- **Dark mode** complet
- **Haptic feedback** sur les interactions
- **Emojis thèmes** uniques (🇫🇷🏛️⚖️📜🤝)

### Authentification
- Email + mot de passe (case-insensitive)
- Apple Sign-In
- Google Sign-In
- Vérification email à l'inscription (code 6 chiffres via Brevo)
- Mot de passe oublié (flow complet avec email)
- Modification de mot de passe
- Suppression de compte (RGPD + Apple requirement)

### Paiements (RevenueCat)
- **Hebdomadaire** : 3,99 €
- **Mensuel** : 10,99 €
- **Semestriel** : 39,99 € (6 mois)
- IAP Apple + Google via RevenueCat
- Codes promo (CIVIQUE2026, BIENVENUE, TESTPREMIUM)
- Bouton "Restaurer les achats" (Apple requirement)
- Entitlement : "Civique Pro"

### Sécurité
- Helmet (headers HTTP)
- CORS production only
- Bcrypt 12 rounds
- JWT 15min access / 7d refresh
- Rate limiting 100 req/min
- OAuth vérifié (Google: google-auth-library, Apple: clés publiques)
- Graceful shutdown (SIGTERM/SIGINT)
- Admin secret séparé

### Emails (Brevo API HTTP)
- Email de vérification (code 6 chiffres)
- Email de bienvenue
- Email de réinitialisation de mot de passe
- Email de confirmation changement MDP
- Templates HTML avec logo, gradient, footer branded

### Legal / Compliance
- Politique de confidentialité (RGPD compliant)
- Conditions générales d'utilisation
- Pages servies en ligne (/privacy, /terms)
- Mentions de tous les sous-traitants (Hetzner, Brevo, Stripe, RevenueCat, Apple, Google)
- Suppression de compte fonctionnelle
- Pas d'infos techniques sensibles exposées

### Infrastructure
- **VPS** : Hetzner (Allemagne, UE)
- **Base de données** : PostgreSQL
- **Process manager** : PM2
- **Reverse proxy** : Nginx avec HTTPS (Let's Encrypt)
- **Emails** : Brevo API HTTP
- **Error tracking** : Sentry (SDK intégré, plugin build désactivé temporairement)
- **Paiements** : RevenueCat (Apple IAP + Google Play Billing)

---

## Tests effectués

| Catégorie | Résultat |
|-----------|----------|
| API Auth (24 tests) | 24/24 PASS |
| Questions + Exams + Stats (26 tests) | 26/26 PASS |
| Paiements + Social + Legal (19 tests) | 19/19 PASS |
| Traductions 5 langues | 5/5 PASS |
| **Total** | **74/74 PASS** |

---

## Comptes & Accès

| Service | Détail |
|---------|--------|
| GitHub | https://github.com/Nissoux/Civique |
| API | https://api.integrafle.fr |
| VPS | ssh root@api.integrafle.fr |
| Expo | owner: nissouz |
| Apple Developer | Team ID: N68KLMZ9DW |
| App Store Connect | ascAppId: 6761684101 |
| Google Play Console | com.civique.app |
| RevenueCat | Apple: appl_nQxYIjvONBNnMwfRyQIfvWjkkcm / Google: goog_NyEtOpLwYjFGSBcAQPygeTmhMYs |
| Sentry | DSN dans _layout.tsx |
| Brevo | API key dans .env VPS |

---

## Codes promo actifs

| Code | Durée | Max utilisations | Utilisé |
|------|-------|-----------------|---------|
| CIVIQUE2026 | 365 jours | 100 | Quelques-uns |
| BIENVENUE | 30 jours | 500 | Quelques-uns |
| TESTPREMIUM | 7 jours | 10 | Quelques-uns |

---

## Compte de test Apple Review

- **Email** : bfanis667@gmail.com
- **Mot de passe** : Civique2026!

---

## Ce qui reste à faire

### Immédiat
- [ ] Finaliser la fiche App Store Connect (confidentialité, catégorie, droits du contenu)
- [ ] Soumettre pour review Apple
- [ ] Recruter 20 testeurs Google Play (14 jours de test interne requis)
- [ ] Créer les abonnements sur Google Play Console (après upload du AAB)

### Post-lancement
- [ ] Configurer Sentry avec org/projet pour les debug symbols
- [ ] Mode hors ligne (cache des questions)
- [ ] Synchronisation progression côté serveur
- [ ] Notifications push (rappels d'entraînement)
- [ ] Audio pour les questions
- [ ] Marketing : associations, centres de formation, SEO

---

## Bugs connus

| Bug | Sévérité | Statut |
|-----|----------|--------|
| Barre "Mots de passe" iOS clignote au login | Mineur | Non résolu (comportement iOS) |
| Abonnements Google Play non créés | Bloquant (Android) | En attente upload AAB sur Play Console |

---

## Architecture technique

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  App Mobile  │────▶│  API Server  │────▶│  PostgreSQL  │
│  (Expo/RN)   │     │  (Fastify)   │     │  (Hetzner)   │
└──────┬───────┘     └──────┬───────┘     └──────────────┘
       │                    │
       ├──▶ RevenueCat      ├──▶ Brevo (emails)
       ├──▶ Apple IAP       ├──▶ Sentry (errors)
       └──▶ Google Play     └──▶ Nginx + HTTPS
```

---

## Fichiers clés du projet

| Fichier | Rôle |
|---------|------|
| `apps/mobile/app/_layout.tsx` | Point d'entrée, auth guard, RevenueCat init |
| `apps/mobile/constants/theme.ts` | Thème Claymorphism complet |
| `apps/mobile/services/revenuecat.ts` | Service IAP |
| `apps/mobile/services/api.ts` | Client API Axios |
| `apps/mobile/stores/progressionStore.ts` | Système Duolingo (XP, couronnes, streaks) |
| `apps/server/src/index.ts` | Serveur Fastify + Helmet + CORS |
| `apps/server/src/routes/auth/index.ts` | Auth (register, login, OAuth, verify, delete) |
| `apps/server/src/services/email.ts` | Service email Brevo |
| `apps/server/src/db/schema.ts` | Schéma base de données |
| `CLAUDE.md` | Instructions et safety rules |
| `.claude/VERIFICATION_CHECKLIST.md` | Checklist avant chaque commit/build |

---

## Leçons apprises

1. **Toujours tester visuellement** — pas juste le code
2. **Shuffle = vérifier TOUTES les données liées** (traductions, IDs)
3. **Ne jamais lancer un build avec un bug connu**
4. **RevenueCat doit être configuré AVANT le premier build**
5. **pnpm monorepo + EAS Build = .npmrc avec shamefully-hoist**
6. **Les pages légales doivent être exactes** — pas de placeholders

---

*On a fait du taf. 🇫🇷*

*Rapport généré le 8 avril 2026*
