# Civique — Smoke test manuel avant mise en ligne

Dérouler cette checklist sur <https://civique.integrafle.fr> avant d'annoncer un lancement
ou un déploiement majeur. Cocher au fur et à mesure ; toute case **P0** non
cochée bloque la communication publique.

> Astuce : utiliser un compte de test dédié (jamais le compte personnel),
> idéalement un compte créé pour l'occasion afin de tester le cycle complet
> inscription → suppression.

> Priorités :
> - **P0** = bloque le lancement (parcours principal cassé, fuite de données,
>   paiement défaillant, etc.).
> - **P1** = doit fonctionner mais ne bloque pas un go/no-go si le contournement
>   est documenté.
> - **P2** = nice-to-have, à corriger dans le sprint suivant si en panne.

---

## ⚡ Pré-flight — 5 vérifs critiques AVANT de basculer Stripe en `live`

Avant de retourner la clé `pk_test_…` en `pk_live_…`, **tous** ces points
doivent être verts. C'est le point de non-retour : une fois en live, un bug
de paiement = un litige bancaire, pas juste un bug.

- [ ] **(Stripe) webhook reçu** — sur la page `https://dashboard.stripe.com/test/webhooks`,
      l'endpoint `https://api.integrafle.fr/api/payments/webhook` affiche un événement
      `checkout.session.completed` à statut `Succeeded` dans les 5 dernières minutes
      (déclencher un paiement test avec carte `4242 4242 4242 4242` pour générer l'event).
- [ ] **(Email) Brevo envoie** — un email d'inscription test arrive sur une boîte
      Mailinator en moins de 2 minutes, depuis l'adresse `no-reply@civique.integrafle.fr` (et non
      `no-reply@sendinblue.com` — sinon la config Brevo n'est pas finalisée).
- [ ] **(Reset password) flow complet** — `/forgot-password` envoie un code, le code
      est valide pendant 15 min, `/reset-password?token=…` accepte un nouveau mot de
      passe et redirige vers `/login?reset=1`.
- [ ] **(Training) DB write** — démarrer une session de training, répondre à 3 questions,
      puis vérifier sur Postgres : `SELECT COUNT(*) FROM training_sessions WHERE user_id=<id>;`
      doit incrémenter en quasi-temps réel (pas de batch différé).
- [ ] **(Examen blanc) score enregistré** — soumettre un examen, vérifier sur Postgres :
      `SELECT * FROM exam_attempts WHERE user_id=<id> ORDER BY id DESC LIMIT 1;` montre
      le score, la durée et le détail par thème (pas null).

Si l'un des 5 échoue : NE PAS basculer Stripe en live. NE PAS communiquer
publiquement. Régler d'abord.

---

## Auth flow

- [ ] **P0** — Inscription d'un nouveau compte (`/register`) — email + mot de passe + nom acceptés, redirection vers la page "vérifie ton email"
- [ ] **P0** — Email de vérification reçu (Brevo) en moins de 2 minutes, lien cliquable, retour sur `/auth/verified`
- [ ] **P0** — Connexion (`/login`) — cookies `civique_access` + `civique_refresh` posés en `Secure; HttpOnly`
- [ ] **P0** — Mot de passe oublié (`/forgot-password`) — email envoyé avec lien de reset
- [ ] **P0** — Réinitialisation du mot de passe (`/reset-password?token=…`) — nouveau mot de passe accepté, redirection login
- [ ] **P1** — Tentative de login avec mauvais mot de passe — message d'erreur explicite, pas de cookie posé, pas de fuite "user existe / n'existe pas"
- [ ] **P1** — `/login` quand déjà connecté — redirection automatique vers `/app` (cf. `middleware.ts:REDIRECT_IF_AUTHED`)
- [ ] **P2** — Rate-limit sur 6+ tentatives de login échouées en 1 min — réponse 429 avec message "Trop de requêtes"

## Onboarding

- [ ] **P0** — Carrousel de bienvenue (`/onboarding`) — 3 slides avec navigation suivante/précédente
- [ ] **P0** — Sélection du type d'examen (3 options : CSP, CR, NAT) — bouton "continuer" actif uniquement après choix
- [ ] **P0** — Redirection vers le dashboard `/app` une fois l'onboarding terminé
- [ ] **P1** — Reload sur `/onboarding` après avoir choisi l'examen — le choix est persisté (pas de re-sélection nécessaire)
- [ ] **P2** — Navigation arrière au milieu du carrousel (bouton « précédent ») — pas de doublon de slide, pas d'overlap visuel

## Training

- [ ] **P0** — Démarrage d'une session — thème 1, niveau 1 (`/app/train/[themeId]/[level]`)
- [ ] **P0** — Bonne réponse — feedback visuel vert + barre de progression qui avance
- [ ] **P0** — Mauvaise réponse — feedback rouge + explication affichée
- [ ] **P0** — Fin de session — écran de récap avec score et XP gagnés
- [ ] **P0** — Retour au dashboard — la progression du thème est à jour (pourcentage et niveau)
- [ ] **P1** — Quitter une session en cours puis revenir — proposition "Reprendre" (pas redémarrage à zéro)
- [ ] **P1** — Compte gratuit qui atteint le quota — modale "Quota atteint" + CTA upgrade, plus de question chargée
- [ ] **P2** — Animation feedback (vert/rouge) en mode `prefers-reduced-motion` — animations désactivées, pas de flash

## Examen blanc

- [ ] **P0** — Démarrage d'un examen (`/app/exams`) — sélection d'un examen blanc disponible
- [ ] **P0** — Timer affiché et décompte en temps réel sans recharger
- [ ] **P0** — Soumission de l'examen — bouton final fonctionne même avec questions non répondues
- [ ] **P0** — Page de résultats — score global affiché + détail par thème + recommandations
- [ ] **P1** — Reload accidentel pendant l'examen — la session est sauvée et reprise au même endroit (pas de perte de réponses)
- [ ] **P1** — Tentative d'accès direct à un examen premium en compte gratuit — paywall affiché
- [ ] **P2** — Examen blanc avec langue secondaire arabe activée — les questions restent **en français uniquement** (cf. section "Language picker" plus bas)

## Fiches

- [ ] **P1** — Liste des fiches (`/app/fiches`) — pagination ou scroll infini OK
- [ ] **P1** — Filtre par thème — les résultats se mettent à jour sans rechargement complet
- [ ] **P1** — Détail d'une fiche (`/app/fiches/[id]`) — markdown rendu correctement (titres, listes, gras)
- [ ] **P2** — Bouton "marquer comme lue" — l'état persiste après reload

## Flashcards

- [ ] **P1** — Hub flashcards (`/app/flashcards`) — liste des decks par thème
- [ ] **P1** — Session "flip" — clic sur la carte révèle la réponse, boutons "je savais / je savais pas"
- [ ] **P1** — Mode quiz — questions à choix multiples basées sur les flashcards
- [ ] **P2** — Algorithme SRS — une carte "je savais pas" revient dans la session courante

## Glossaire

- [ ] **P1** — Recherche live (`/app/glossaire`) — filtrage instantané pendant la frappe (< 100 ms)
- [ ] **P1** — Clic sur un terme — pop-in ou page détail avec définition et exemples
- [ ] **P2** — Recherche avec accents (« État », « élection ») — match insensible aux diacritiques

## Stats

- [ ] **P0** — Métriques héro non nulles après une session — temps total, sessions, taux de réussite
- [ ] **P1** — Barres par thème — proportions cohérentes avec la progression réelle (pas de barre à 100 % si on n'a fait qu'un quiz)
- [ ] **P2** — Graphique d'évolution (7/30/90 jours) — courbe lisible, pas de NaN ni d'année 1970

## Social

- [ ] **P1** — Recherche d'un ami par email (`/app/social`) — autocomplete fonctionne
- [ ] **P1** — Envoi d'invitation — notification visible chez l'invité
- [ ] **P1** — Acceptation d'invitation — relation amicale créée des deux côtés
- [ ] **P1** — Leaderboard — affiche les amis triés par XP de la semaine
- [ ] **P2** — Blocage / suppression d'un ami — disparition immédiate du leaderboard

## Profile

- [ ] **P0** — Modification du `displayName` (`/app/profile`) — changement reflété immédiatement dans la nav
- [ ] **P1** — Modification de l'email — un email de re-vérification est envoyé à la nouvelle adresse
- [ ] **P1** — Modification du mot de passe — déconnexion automatique des autres sessions
- [ ] **P1** — Bouton "supprimer mon compte" — placeholder visible (action complète à implémenter ultérieurement)

## Subscription

- [ ] **P0** — Page plans (`/app/settings/subscription` ou équivalent) — 3 plans visibles (hebdo, mensuel, semestriel) avec prix corrects
- [ ] **P0** — Clic "S'abonner" — ouverture de Stripe Checkout en mode **live** (URL `checkout.stripe.com`)
- [ ] **P0** — Retour après paiement réussi — message de succès + statut premium actif sur le profil
- [ ] **P0** — Webhook Stripe reçu — colonne `premium_until` de la table `users` mise à jour en DB (cf. pré-flight)
- [ ] **P1** — Annulation depuis Stripe Checkout (bouton retour) — redirection sur `/payment-cancel`, pas de changement de statut
- [ ] **P2** — Tentative de double souscription — l'API refuse ou stripe affiche le bon état du portail client

## Language picker (multilingue)

- [ ] **P0** — Bascule en Arabe (sélecteur langue) — les questions affichent FR en haut + AR en italique mute en dessous
- [ ] **P0** — Retour en Français — affichage FR uniquement
- [ ] **P0** — Page Examen blanc — les questions **restent en FR uniquement** même langue secondaire active (l'examen reflète les conditions réelles)
- [ ] **P1** — Persistance de la langue après login/logout — la préférence reste sur le compte
- [ ] **P1** — 6 langues disponibles : FR, AR, FA, PT, ES, HI — chacune affiche au moins une traduction
- [ ] **P2** — RTL (arabe, farsi) — alignement des textes secondaires correct, pas de chevauchement avec la nav

## Mobile (responsive)

- [ ] **P0** — Barre de navigation basse — 5 emplacements visibles sur viewport < 768 px
- [ ] **P0** — Drawer "Plus" — s'ouvre au tap et liste les routes secondaires (profil, glossaire, etc.)
- [ ] **P1** — Boutons d'action principaux (training, exam) — zone tactile ≥ 44×44 px
- [ ] **P2** — Mode paysage sur mobile — pas de débordement horizontal, scroll vertical seulement

## Cookie banner

- [ ] **P0** — Bannière s'affiche à la première visite (storage vidé, mode navigation privée OK)
- [ ] **P0** — Bouton "j'accepte" — la bannière disparaît et ne réapparaît pas au rechargement (persistance localStorage)
- [ ] **P1** — Bouton "refuser" — choix persisté, pas de tracking analytics chargé

## Pages légales

- [ ] **P0** — `/privacy` accessible depuis le footer, contenu chargé
- [ ] **P0** — `/terms` accessible depuis le footer, contenu chargé
- [ ] **P0** — `/mentions-legales` accessible depuis le footer, contenu chargé
- [ ] **P1** — Lien email du DPO cliquable et adresse correcte
- [ ] **P2** — Dates de mise à jour cohérentes entre les 3 pages

## 404 / Erreurs

- [ ] **P0** — `/route-inexistante` affiche la page 404 customisée (`not-found.tsx`) avec lien retour accueil et texte "introuvable"
- [ ] **P1** — Erreur côté API (500) — page `error.tsx` affichée, pas la page Next.js par défaut
- [ ] **P2** — Comportement quand l'API est down — message dégradé visible, pas de spinner infini

## SEO / discovery

- [ ] **P1** — `/robots.txt` accessible et autorise `/`, `/login`, `/register`, `/privacy`, `/terms`, `/mentions-legales`, `/forgot-password`
- [ ] **P1** — `/sitemap.xml` accessible et liste les pages publiques
- [ ] **P1** — `<title>` et `<meta description>` uniques sur chaque page publique (vérifier sur landing, login, register, privacy)
- [ ] **P2** — OG image accessible — `https://civique.integrafle.fr/opengraph-image` renvoie une image PNG/JPG

## Accessibilité (smoke)

> Audit complet : voir `A11Y.md`. Ici, juste les check minimum avant release.

- [ ] **P1** — Navigation au clavier complète sur la landing (Tab → tous les liens accessibles, focus visible)
- [ ] **P1** — Lien "Aller au contenu principal" (skip-to-main) visible au premier `Tab`
- [ ] **P1** — Contraste suffisant sur les boutons primaires (terracotta sur bone) — Lighthouse a11y ≥ 95
- [ ] **P2** — `prefers-reduced-motion` honoré sur le carrousel de bienvenue et le marquee

## Performance (smoke)

> Audit complet : voir `infra/lighthouse.md`. Ici, vérif rapide à l'œil nu.

- [ ] **P1** — Landing s'affiche en < 3 s sur 4G simulée (DevTools → Network → Slow 3G)
- [ ] **P1** — Pas de CLS visible (le texte ne « saute » pas pendant le chargement des fonts)
- [ ] **P2** — Score Lighthouse mobile Performance ≥ 85

## Sécurité (smoke)

- [ ] **P0** — Cookies `civique_access` et `civique_refresh` posés en `HttpOnly; Secure; SameSite=Lax` (DevTools → Application → Cookies)
- [ ] **P0** — Accès direct à `/app` sans cookie de session → redirection vers `/login?next=/app` (cf. `middleware.ts`)
- [ ] **P0** — Aucun secret visible dans les sources HTML (pas de `STRIPE_SECRET_KEY`, `JWT_SECRET`, `BREVO_API_KEY` dans la response)
- [ ] **P1** — Tentative XSS dans un champ de profil (`<script>alert(1)</script>` comme displayName) — caractères échappés, pas d'exécution
- [ ] **P2** — Header `Content-Security-Policy` présent et restrictif (vérifier via DevTools → Network → Headers)
