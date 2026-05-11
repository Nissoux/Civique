# Civique — Plan de régression post-déploiement

Ce document décrit le **minimum** à vérifier après chaque déploiement —
qu'il soit `server`, `web` ou `all`. Si l'un des parcours échoue, **rollback
immédiat** (`git revert` + `bash infra/deploy.sh`) ou bascule en mode
maintenance Nginx.

> Quand le lancer :
> - **Toujours** après un déploiement en prod (`bash infra/deploy.sh`).
> - **Toujours** après un changement de schéma DB (`drizzle-kit push`).
> - **Toujours** après une rotation de secret (JWT, Stripe, Brevo).
> - **Recommandé** chaque lundi matin, même sans déploiement, pour
>   détecter les dérives silencieuses (certif TLS qui expire, DNS qui
>   bouge, quota Brevo dépassé).

---

## Pré-flight automatique — 30 secondes

```bash
bash infra/smoke-test.sh
```

Si le smoke test échoue, **ne pas continuer** : régler le problème
d'abord. Il couvre les pages publiques, les redirections middleware, et
la disponibilité de l'API.

---

## Parcours 1 — Cold visit → premier examen blanc (≈ 15 min)

**Objectif** : vérifier que la chaîne complète signup → onboarding →
exam → stat fonctionne pour un utilisateur tout neuf.

**Pré-requis** : une boîte email jetable (Mailinator, ou un alias
Brevo dédié), session de navigation privée (cookies vidés).

| # | URL / Action | Attendu |
|---|---|---|
| 1 | Ouvrir `https://civique.integrafle.fr/` en navigation privée | Landing s'affiche, bannière cookies visible, hero "Civique" |
| 2 | Cliquer "Commencer" → `/register` | Formulaire `email + mot de passe + nom` |
| 3 | Remplir avec `qa-<timestamp>@mailinator.com`, MdP `Test1234!`, soumettre | Redirection vers `/verify-email` |
| 4 | Ouvrir Mailinator, cliquer le lien de vérification | Atterrit sur `/auth/verified` puis `/onboarding` |
| 5 | Carrousel : cliquer "Suivant" 3 fois | Slide 1 → 2 → 3 → choix d'examen |
| 6 | Sélectionner "Naturalisation" (ou autre), valider | Redirection vers `/app` (dashboard) |
| 7 | Cliquer sur Thème 1 → niveau 1 → `/app/train/1/1` | 10 questions visibles, timer en haut |
| 8 | Répondre aux 10 questions (peu importe la justesse) | Écran de récap avec XP et score |
| 9 | Revenir au dashboard `/app` | La barre du Thème 1 reflète la progression (≠ 0%) |
| 10 | Ouvrir `/app/stats` | Métriques héro non nulles : sessions ≥ 1, temps total ≥ 1 min |

**Critères de réussite** :
- Email arrive en < 2 min (sinon : vérifier quota Brevo et logs PM2).
- Aucun écran blanc, aucune erreur console.
- La progression est persistée après reload (Ctrl+F5 sur `/app`).

**Si échec à l'étape 3** : vérifier `pm2 logs civique` côté serveur,
chercher `400 Validation Error` ou `500`.

**Si échec à l'étape 4** : email Brevo non envoyé → vérifier
`BREVO_API_KEY` dans `.env` du VPS, et le quota mensuel sur le dashboard
Brevo.

---

## Parcours 2 — Returning user → reprise de session (≈ 5 min)

**Objectif** : vérifier que la session JWT survit à une déconnexion
navigateur et que la progression est conservée.

**Pré-requis** : compte créé au parcours 1 (ou compte de test stable).

| # | URL / Action | Attendu |
|---|---|---|
| 1 | Fermer toutes les fenêtres du navigateur, vider les cookies de session uniquement (garder `civique_refresh`) | — |
| 2 | Ouvrir `https://civique.integrafle.fr/login` | Formulaire login |
| 3 | Renseigner email + MdP, soumettre | Redirection directe vers `/app` |
| 4 | Reprendre une session : Thème 1 → niveau 2 → `/app/train/1/2` | Questions chargées en < 1 s |
| 5 | Répondre à 3 questions puis quitter (cliquer "Logo" pour revenir au dashboard) | Session sauvegardée, message "Reprise possible" |
| 6 | Recharger `/app` (F5) | La carte du Thème 1 propose "Reprendre" |
| 7 | Cliquer "Reprendre" | On reprend à la question 4, pas au début |

**Critères de réussite** :
- Pas de second prompt de login.
- Le cookie `civique_access` est régénéré silencieusement via
  `/api/auth/refresh` (visible dans l'onglet Network du DevTools).
- La progression intermédiaire est conservée même après un hard reload.

**Si échec à l'étape 3** : middleware Next.js cassé ou cookie
`civique_refresh` expiré. Tester `curl https://api.integrafle.fr/api/auth/refresh`
avec le token.

**Si échec à l'étape 7** : la session de training n'est pas écrite en DB
en temps réel — vérifier `pm2 logs civique` pour les `INSERT` sur la
table `training_sessions`.

---

## Parcours 3 — Premium flow → quota wall → Stripe Checkout (≈ 10 min)

**Objectif** : vérifier que le quota gratuit est bien bloqué, que
Stripe Checkout s'ouvre en **test mode** (clés `pk_test_…`), et que le
webhook reçu fait basculer le compte en premium.

> ATTENTION : ce parcours utilise les clés Stripe **test**. Ne JAMAIS
> tester avec une vraie carte sur les clés `live` pour valider un
> déploiement — utiliser la carte test `4242 4242 4242 4242`, expiration
> future, CVC `123`.

**Pré-requis** :
- Compte de test ayant atteint le quota gratuit (ou un compte fresh où
  on consomme manuellement le quota pour reproduire).
- Stripe CLI installé localement pour suivre les webhooks :
  `stripe listen --forward-to https://api.integrafle.fr/api/payments/webhook`.

| # | URL / Action | Attendu |
|---|---|---|
| 1 | Sur un compte au quota max, lancer une session de training | Modale "Quota atteint" + CTA "S'abonner" |
| 2 | Cliquer "S'abonner" → `/app/settings/subscription` | Page plans : hebdo, mensuel, semestriel |
| 3 | Cliquer "Choisir" sur le plan hebdo | Redirection vers `checkout.stripe.com/c/pay/…` |
| 4 | Vérifier l'URL : doit contenir `pk_test_` dans l'iframe Stripe (DevTools) | C'est bien le mode test |
| 5 | Saisir carte `4242 4242 4242 4242`, MM/YY `12/99`, CVC `123`, email du compte | Paiement accepté |
| 6 | Stripe redirige vers `https://api.integrafle.fr/payment-success` | Message "Paiement réussi" |
| 7 | Côté Stripe CLI : un événement `checkout.session.completed` est relayé | Webhook traité |
| 8 | Côté PM2 : `pm2 logs civique` montre `[payments] activated premium for user <id>` | OK |
| 9 | Recharger `/app/settings/subscription` | Statut "Premium actif jusqu'au …" |
| 10 | Relancer une session de training | Plus de modale quota, training démarre |

**Critères de réussite** :
- Stripe Checkout s'ouvre en moins de 3 s.
- Le webhook arrive en moins de 5 s après le succès.
- Le bouton "S'abonner" disparaît immédiatement après le retour.

**Si échec à l'étape 3** : variable `STRIPE_PUBLISHABLE_KEY` non
configurée côté web → vérifier `.env.production` de `apps/web/`.

**Si échec à l'étape 7** : le webhook n'est pas signé / la signature
échoue → vérifier `STRIPE_WEBHOOK_SECRET` et que le raw body est bien
capturé (cf. `apps/server/src/index.ts` ligne 57).

**Si échec à l'étape 9** : la DB n'a pas été mise à jour → exécuter
`SELECT * FROM users WHERE id = <id>;` sur Postgres pour vérifier la
colonne `premium_until`.

---

## Checklist post-incident — quand un parcours échoue

1. **Capturer** : screenshot, logs PM2 (`pm2 logs civique --lines 100`),
   onglet Network du DevTools (exporter HAR).
2. **Reproduire** : essayer en navigation privée, sur un second
   navigateur, sur mobile.
3. **Isoler** : est-ce que le smoke test (`bash infra/smoke-test.sh`)
   passe ? Si non, c'est plus large que ce parcours.
4. **Rollback** si nécessaire : `git revert HEAD && bash infra/deploy.sh`.
5. **Documenter** dans `SESSION_REPORT_*.md` avec date, commit incriminé,
   fix appliqué.

---

## Cadence recommandée

| Parcours | Avant chaque release | Après deploy server | Après deploy web | Hebdo |
|---|---|---|---|---|
| Smoke test | OUI | OUI | OUI | OUI |
| Parcours 1 (cold) | OUI | NON | OUI | OUI |
| Parcours 2 (returning) | OUI | OUI | OUI | NON |
| Parcours 3 (premium) | OUI | OUI | NON | OUI |
| QA_SMOKE manuel complet | OUI (release majeure) | NON | NON | NON |
| Lighthouse mobile + desktop | OUI | NON | OUI | NON |

Soit ~30 min pour un déploiement web complet, ~5 min pour un hot-fix
serveur, ~1 h pour une release majeure (avec QA_SMOKE complet).
