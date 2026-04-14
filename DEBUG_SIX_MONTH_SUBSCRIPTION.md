# Debug — Abonnement 6 mois invisible sur StoreKit sandbox

**Date** : 14 avril 2026
**Statut** : 🔴 Non résolu — session précédente interrompue (limite technique upload images)
**Commit de référence** : `d4a6480` (main)

---

## Contexte global

Civique (iOS/Android) est en phase de **resoumission** suite au rejet Apple build 9 (guidelines 2.1b + 3.1.1 + 2.3.10).

Build 10 prêt à soumettre, bloqué par un problème d'IAP côté sandbox iOS.

---

## Le problème

Sur l'écran **Abonnement** de l'app iOS (TestFlight sandbox sur iPhone de l'utilisateur) :

- **Attendu** : 3 offres visibles (hebdomadaire, mensuel, 6 mois)
- **Observé** : seulement **2 offres** visibles (hebdomadaire, mensuel)
- Le **6 mois ne s'affiche jamais** malgré configuration identique aux 2 autres

### Code concerné
Fichier : `apps/mobile/app/settings/subscription.tsx` (+ services RevenueCat)
Le code utilise les **identifiers de package RevenueCat** (`$rc_weekly`, `$rc_monthly`, `$rc_six_month`), pas les product IDs Apple — donc RevenueCat fait le mapping.
Aucun filtre dans le code qui exclurait un package. Vérifié.

---

## Ce qui a été vérifié (tout ✅)

| Point | Statut |
|---|---|
| Shared Secret RevenueCat | ✅ |
| API Key `.p8` RevenueCat | ✅ |
| Paid Apps Agreement Apple | ✅ Actif |
| Product ID `civique_six_month` | ✅ Correct |
| Durée 6 mois | ✅ |
| Prix 39,99 EUR / 34,99 USD | ✅ |
| Statut App Store Connect | ✅ "Waiting for Review" (identique aux 2 autres qui marchent) |
| Métadonnées (langue, capture, catégorie d'imposition) | ✅ Remplies |
| Groupe d'abonnement "Civique Pro" | ✅ |
| RevenueCat API retourne les 3 packages (vérifié via curl) | ✅ |
| Cache StoreKit nettoyé (suppression + reset device) | ✅ Aucun effet |
| Pas de filtre côté code `subscription.tsx` | ✅ |

---

## Hypothèse de travail retenue

**Bug/glitch côté sandbox StoreKit Apple** sur le product ID spécifique `civique_six_month`.
- RevenueCat renvoie bien les 3 produits à l'app
- Mais StoreKit iPhone sandbox refuse de remonter `civique_six_month` vers RevenueCat
- Les 2 autres produits du même groupe, même statut, mêmes métadonnées, fonctionnent

Conclusion : **pas un problème code, pas un problème config visible**. Bug Apple sandbox sur un product ID "fantôme".

---

## Workaround tenté : recréation avec un nouvel ID

### Procédure appliquée

**App Store Connect**
- ❓ Suppression de `civique_six_month` (à confirmer — un produit supprimé peut ne pas libérer l'ID avant 24 h)
- Création d'un nouveau produit **`civique_semestriel`**
  - Durée : 6 mois
  - Prix : 39,99 EUR / 34,99 USD
  - Nom d'affichage FR : "Civique Pro - 6 mois"
  - Description : "Accès illimité aux questions et examens pendant 6 mois"
  - Catégorie d'imposition : identique aux 2 autres
  - Capture d'écran review : uploadée
  - Groupe : Civique Pro

**RevenueCat**
- Nouveau produit `civique_semestriel` créé (section App Store)
- Attaché à l'entitlement **"Civique Pro"**
- Dans l'offering `default`, package `$rc_six_month` mis à jour :
  - Ancien produit iOS `civique_six_month` retiré
  - Nouveau produit iOS `civique_semestriel` ajouté

**Build mobile** : **aucun rebuild nécessaire** (le code référence `$rc_six_month`, RevenueCat mappe).

### Étape suivante prévue
- Attendre **30 min** propagation StoreKit sandbox
- Désinstaller Civique de l'iPhone
- Réinstaller via TestFlight
- Ouvrir → écran Abonnement → vérifier que les 3 offres s'affichent

### Résultat du test
- ⚠️ **L'utilisateur a lancé le test et un message d'erreur s'est affiché sur le device**
- Le screenshot de l'erreur n'a pas pu être transmis (limite technique 2000 px sur la session précédente)
- **Nature exacte de l'erreur inconnue** à ce stade

---

## ⚠️ Ce qu'il faut faire en priorité dans la nouvelle session

1. **Récupérer le message d'erreur exact** affiché sur l'écran Abonnement après réinstall.
   - Screenshot OU texte recopié
   - Est-ce que 0, 1, 2 ou 3 produits s'affichent ?
   - L'erreur vient-elle de RevenueCat, de StoreKit, du backend, ou de l'app elle-même ?

2. **Vérifier RevenueCat dashboard** :
   - Le produit `civique_semestriel` est-il bien "Ready" (pas "Could not check") ?
   - Dans l'offering `default`, le package `$rc_six_month` liste-t-il bien le nouveau produit iOS ?
   - L'ancien `civique_six_month` est-il encore référencé quelque part ?

3. **Logs applicatifs** :
   - Ajouter des `console.log` autour de `Purchases.getOfferings()` pour voir ce qui revient réellement côté app
   - Vérifier `offering.current?.availablePackages` sur le device
   - Chercher Sentry pour les erreurs RevenueCat récentes

4. **Vérifier propagation App Store Connect** :
   - Status exact du nouveau produit (Waiting for Review ? Ready to Submit ? Missing Metadata ?)
   - Éventuellement passer par l'outil `App Store Connect API` pour vérifier programmatiquement

5. **Sandbox iCloud** :
   - Compte sandbox actif sur l'iPhone (Settings → App Store → Sandbox Account) ?
   - Essayer de forcer un nouveau sandbox account si pas déjà fait

---

## Décision stratégique à prendre

Deux voies possibles si le fix ne vient pas rapidement :

| Option | Pour | Contre |
|---|---|---|
| **A. Submit build 10 tel quel** avec 2 produits fonctionnels + 1 "Waiting for Review" | Apple review utilise son propre sandbox (indépendant du device user). Plus d'erreur visible = pas le même rejet. Déblocage immédiat | Risque de se faire rejeter à nouveau sur la 2.1b si leur sandbox a le même problème. **L'utilisateur a rejeté cette option.** |
| **B. Trouver la vraie cause et fixer avant submit** | Chemin propre, 3 offres garanties chez les reviewers Apple | Temps indéterminé, dépend en partie de la propagation Apple (24 h possibles sur l'ID libéré) |

→ **Direction choisie par l'utilisateur : B. Réparer. Pas de submit tant que ce n'est pas résolu.**

---

## Historique récent pertinent (Google Sign-In — pattern similaire)

Ce genre de bug "invisible" a déjà été rencontré avec Google Sign-In (5 échecs avant la bonne solution). Voir `LESSONS_LEARNED.md` section 2. Pattern : quand la config a l'air parfaite mais que ça marche pas, c'est souvent un détail plateforme (signing key, SHA-1, platform extension Metro). Les mêmes réflexes s'appliquent ici côté Apple.

---

## Contexte config (rappel depuis `PROJECT_STATUS.md`)

- **RevenueCat**
  - Apple API Key : `appl_nQxYIjvONBNnMwfRyQIfvWjkkcm`
  - Entitlement : `Civique Pro`
  - Offering : `default` (Current)
- **App Store Connect**
  - App ID : `6761684101`
  - Team ID : `N68KLMZ9DW`
  - Bundle ID : `com.civique.app`
- **Build en préparation** : build 10 (commit `327636d` — Google Sign-In natif + fixes 3.1.1 + 2.3.10)

---

*Fichier créé le 14 avril 2026 pour reprise dans une nouvelle session suite à interruption technique (limite image 2000 px).*
