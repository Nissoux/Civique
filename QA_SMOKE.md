# Civique — Smoke test manuel avant mise en ligne

Dérouler cette checklist sur <https://civique.fr> avant d'annoncer un lancement
ou un déploiement majeur. Cocher au fur et à mesure ; toute case non cochée
bloque la communication publique.

> Astuce : utiliser un compte de test dédié (jamais le compte personnel),
> idéalement un compte créé pour l'occasion afin de tester le cycle complet
> inscription → suppression.

---

## Auth flow

- [ ] Inscription d'un nouveau compte (`/auth/register`) — email + mot de passe + nom acceptés, redirection vers la page "vérifie ton email"
- [ ] Email de vérification reçu (Brevo) en moins de 2 minutes, lien cliquable, retour sur `/auth/verified`
- [ ] Connexion (`/auth/login`) — cookies `civique_access` + `civique_refresh` posés en `Secure; HttpOnly`
- [ ] Mot de passe oublié (`/auth/forgot-password`) — email envoyé avec lien de reset
- [ ] Réinitialisation du mot de passe (`/auth/reset-password?token=…`) — nouveau mot de passe accepté, redirection login

## Onboarding

- [ ] Carrousel de bienvenue (`/onboarding`) — 3 slides avec navigation suivante/précédente
- [ ] Sélection du type d'examen (3 options : DELF, naturalisation, etc.) — bouton "continuer" actif uniquement après choix
- [ ] Redirection vers le dashboard `/app` une fois l'onboarding terminé

## Training

- [ ] Démarrage d'une session — thème 1, niveau 1 (`/app/train/[themeId]/[level]`)
- [ ] Bonne réponse — feedback visuel vert + barre de progression qui avance
- [ ] Mauvaise réponse — feedback rouge + explication affichée
- [ ] Fin de session — écran de récap avec score et XP gagnés
- [ ] Retour au dashboard — la progression du thème est à jour (pourcentage et niveau)

## Examen blanc

- [ ] Démarrage d'un examen (`/app/exams`) — sélection d'un examen blanc disponible
- [ ] Timer affiché et décompte en temps réel sans recharger
- [ ] Soumission de l'examen — bouton final fonctionne même avec questions non répondues
- [ ] Page de résultats — score global affiché + détail par thème + recommandations

## Fiches

- [ ] Liste des fiches (`/app/fiches`) — pagination ou scroll infini OK
- [ ] Filtre par thème — les résultats se mettent à jour sans rechargement complet
- [ ] Détail d'une fiche (`/app/fiches/[id]`) — markdown rendu correctement (titres, listes, gras)

## Flashcards

- [ ] Hub flashcards (`/app/flashcards`) — liste des decks par thème
- [ ] Session "flip" — clic sur la carte révèle la réponse, boutons "je savais / je savais pas"
- [ ] Mode quiz — questions à choix multiples basées sur les flashcards

## Glossaire

- [ ] Recherche live (`/app/glossaire`) — filtrage instantané pendant la frappe (< 100 ms)
- [ ] Clic sur un terme — pop-in ou page détail avec définition et exemples

## Stats

- [ ] Métriques héro non nulles après une session — temps total, sessions, taux de réussite
- [ ] Barres par thème — proportions cohérentes avec la progression réelle (pas de barre à 100 % si on n'a fait qu'un quiz)

## Social

- [ ] Recherche d'un ami par email (`/app/social`) — autocomplete fonctionne
- [ ] Envoi d'invitation — notification visible chez l'invité
- [ ] Acceptation d'invitation — relation amicale créée des deux côtés
- [ ] Leaderboard — affiche les amis triés par XP de la semaine

## Profile

- [ ] Modification du `displayName` (`/app/profile`) — changement reflété immédiatement dans la nav
- [ ] Modification de l'email — un email de re-vérification est envoyé à la nouvelle adresse
- [ ] Modification du mot de passe — déconnexion automatique des autres sessions
- [ ] Bouton "supprimer mon compte" — placeholder visible (action complète à implémenter ultérieurement)

## Subscription

- [ ] Page plans (`/app/settings/subscription` ou équivalent) — 3 plans visibles (hebdo, mensuel, semestriel) avec prix corrects
- [ ] Clic "S'abonner" — ouverture de Stripe Checkout en mode **live** (URL `checkout.stripe.com`)
- [ ] Retour après paiement réussi — message de succès + statut premium actif sur le profil

## Language picker

- [ ] Bascule en Arabe (sélecteur langue) — les questions affichent FR en haut + AR en italique mute en dessous
- [ ] Retour en Français — affichage FR uniquement
- [ ] Page Examen blanc — les questions restent en FR uniquement même langue secondaire active (l'examen reflète les conditions réelles)

## Mobile (responsive)

- [ ] Barre de navigation basse — 5 emplacements visibles sur viewport < 768 px
- [ ] Drawer "Plus" — s'ouvre au tap et liste les routes secondaires (profil, glossaire, etc.)

## Cookie banner

- [ ] Bannière s'affiche à la première visite (storage vidé, mode navigation privée OK)
- [ ] Bouton "j'accepte" — la bannière disparaît et ne réapparaît pas au rechargement (persistance localStorage)

## Pages légales

- [ ] `/privacy` accessible depuis le footer, contenu chargé
- [ ] `/terms` accessible depuis le footer, contenu chargé
- [ ] `/mentions-legales` accessible depuis le footer, contenu chargé

## 404

- [ ] `/route-inexistante` affiche la page 404 customisée (`not-found.tsx`) avec lien retour accueil
