# Rapport de session — Civique
**Date** : 7 avril 2026
**Durée** : ~12 heures

---

## Résumé

Session marathon de développement, test et préparation au déploiement de l'application Civique — app mobile de préparation à l'examen civique français.

---

## Ce qui a été fait

### Infrastructure
- [x] Clonage du projet sur Mac
- [x] Installation PostgreSQL via Docker en local
- [x] Mise à jour SDK Expo 52 → 54
- [x] Seed de la base de données : **610 questions + 3050 traductions + 5 fiches**
- [x] Déploiement sur VPS Hetzner (PostgreSQL, PM2, Nginx HTTPS)
- [x] API live : https://api.integrafle.fr

### Refonte visuelle complète
- [x] Design Claymorphism (recommandation UI/UX Pro Max Skill)
- [x] Logo C tricolore intégré (login, onboarding, splash, icon)
- [x] Tab bar flottante custom avec animations
- [x] Composants animés : AnimatedPressable, AnimatedCard, CMotif, ProgressRing, AnimatedCounter, ShimmerLoader, GlassCard, MotiView
- [x] Hero gradient + parallax sur l'écran d'accueil
- [x] Emojis thèmes uniques (🇫🇷🏛️⚖️📜🤝)
- [x] Dark mode complet

### Système Duolingo
- [x] Parcours d'apprentissage par niveaux (10 questions/niveau)
- [x] Couronnes (⭐ 60%, ⭐⭐ 80%, ⭐⭐⭐ 100%)
- [x] XP + Streaks
- [x] Déblocage progressif
- [x] Thèmes repliables/dépliables
- [x] Questions uniques par niveau (pagination, pas de répétition)

### Flashcards refondues
- [x] Sessions de 10 questions (7 connaissances + 3 mises en situation)
- [x] Filtrées par objectif (CSP/CR/NAT)
- [x] QCM interactif avec feedback correct/incorrect
- [x] Français toujours en texte principal, traduction en dessous
- [x] Shuffle des choix avec traductions alignées

### Authentification
- [x] Email + mot de passe (toLowerCase)
- [x] Apple Sign-In
- [x] Google Sign-In (Expo auth proxy)
- [x] Vérification email à l'inscription (code 6 chiffres via Brevo)
- [x] Mot de passe oublié (flow complet : email → code → reset)
- [x] Modification de mot de passe depuis le profil
- [x] Suppression de compte (Apple requirement, RGPD)

### Emails (Brevo API HTTP)
- [x] Email de vérification (code 6 chiffres)
- [x] Email de bienvenue (après vérification)
- [x] Email de réinitialisation de mot de passe
- [x] Email de confirmation changement MDP
- [x] Templates HTML avec logo, gradient, footer branded

### Sécurité
- [x] Helmet (headers HTTP)
- [x] CORS production only
- [x] Bcrypt 12 rounds
- [x] JWT 15min access / 7d refresh
- [x] Rate limiting 100 req/min
- [x] OAuth Google vérifié (google-auth-library)
- [x] OAuth Apple vérifié (clés publiques + iss/aud/exp)
- [x] Graceful shutdown (SIGTERM/SIGINT)
- [x] Admin secret séparé
- [x] Sentry error tracking intégré

### Legal / Compliance
- [x] Politique de confidentialité réécrite (RGPD, Hetzner, Brevo, Stripe, Apple, Google)
- [x] CGU réécrites (prix à jour, OFII disclaimer, 6 langues, suppression compte)
- [x] Pages légales servies en ligne (/privacy, /terms)
- [x] Pas d'infos techniques sensibles exposées

### Paiements
- [x] Prix mis à jour : 3.99€/semaine, 10.99€/mois, 39.99€/6 mois
- [x] Codes promo : CIVIQUE2026 (1 an), BIENVENUE (30 jours), TESTPREMIUM (7 jours)
- [x] "Lifetime" remplacé par "Semestriel" (180 jours)

### Assets stores
- [x] Icon 1024x1024 sans alpha (Apple requirement)
- [x] Adaptive icon 1024x1024
- [x] Splash screen avec logo C
- [x] Screenshots iOS (11 screenshots)
- [x] Screenshots Android (12 screenshots, status bar croppée)
- [x] Description Google Play
- [x] EAS submit configuré (Apple Team ID + ascAppId)

---

## Tests effectués

### Tests API : 69/69 PASS ✅
- Auth (24/24) : inscription, login, profil, vérification, MDP, suppression, OAuth
- Questions + Exams + Stats (26/26) : 610 questions, examens 40q, fiches, stats
- Paiements + Social + Legal (19/19) : codes promo, leaderboard, pages légales, Helmet

### Tests traductions : 5/5 langues PASS ✅
- Arabe, espagnol, farsi, hindi, portugais — toutes complètes

---

## Bugs corrigés en session

| Bug | Fix |
|-----|-----|
| Réponse D tronquée dans QCM | paddingBottom 100 + alignItems flex-start |
| Email case-sensitive au login | toLowerCase client + serveur |
| Onboarding ne disparaît pas | Store Zustand partagé pour onboardingDone |
| Progression 100% alors que 11 questions | Renommé en "Taux de réussite" + vraie progression ajoutée |
| Texte menu profil invisible | AnimatedPressable style sur Animated.View |
| Boutons Google/Apple mal affichés | Layout restructuré, pleine largeur |
| Logo avec fond blanc | Crop + alpha transparency via Pillow |
| Stats dark mode couleurs hardcodées | Toutes remplacées par useColors() |
| Suppression compte 500 | Suppression manuelle des données liées (FK sans cascade) |
| Noms colonnes FK incorrects | challenger_id, requester_id au lieu de creator_id, user_id |
| Questions répétées entre niveaux | Pagination (offset) au lieu de random |
| Réponse toujours "a" | shuffleChoices dans FlashcardQuizSession |
| Traductions désalignées après shuffle | Réordonnancement des traductions selon le shuffle |
| Clavier masque bouton valider | KeyboardAvoidingView + ScrollView |
| Clignotement au login | Retrait des MotiView autour des TextInputs |
| Emails non envoyés | SMTP → API HTTP Brevo + variables env corrigées |

---

## Reste à faire (post-session)

| Priorité | Tâche |
|----------|-------|
| 🔴 | **Build en cours** — attendre la fin puis tester les .ipa/.aab |
| 🔴 | **Soumettre sur App Store Connect + Google Play Console** |
| 🟠 | Configurer RevenueCat pour les IAP (Apple/Google exigent leur système de paiement) |
| 🟠 | Créer les prix IAP sur App Store Connect et Google Play Console |
| 🟠 | Ajouter le redirect URI Google (`https://auth.expo.io/@nissouz/civique`) dans Google Cloud Console |
| 🟡 | Mode hors ligne (cache des questions) |
| 🟡 | Synchronisation progression côté serveur |
| 🟡 | Notifications push (rappels d'entraînement) |
| 🟡 | Audio pour les questions (public peu alphabétisé) |

---

## Comptes et accès

| Service | Accès |
|---------|-------|
| GitHub | https://github.com/Nissoux/Civique |
| API | https://api.integrafle.fr |
| VPS | ssh root@api.integrafle.fr |
| Expo | owner: nissouz |
| Apple Developer | Team ID: N68KLMZ9DW |
| App Store Connect | ascAppId: 6761684101 |
| Sentry | DSN configuré dans _layout.tsx |
| Brevo | API key dans .env VPS |

---

## Codes promo actifs

| Code | Durée | Max utilisations |
|------|-------|-----------------|
| CIVIQUE2026 | 365 jours | 100 |
| BIENVENUE | 30 jours | 500 |
| TESTPREMIUM | 7 jours | 10 |

---

## Plugins installés

- **Superpowers** (obra/superpowers) — skills de développement
- **Claude-mem** (thedotmack/claude-mem) — mémoire persistante
- **UI/UX Pro Max** — recommandations design (utilisé pour Claymorphism)

---

*Rapport généré le 7 avril 2026*
