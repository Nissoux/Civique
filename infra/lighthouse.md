# Civique — Audits Lighthouse

Ce document explique comment lancer un audit Lighthouse sur Civique, sans
ajouter de dépendance au monorepo (pas d'install dans `apps/web/`,
`apps/server/` ni à la racine).

> Objectif : mesurer Performance, Accessibilité, Bonnes Pratiques et SEO sur
> la landing publique et sur le dashboard authentifié, avant chaque mise en
> ligne et après chaque évolution majeure du front.

---

## Installation — sans bloater le projet

Lighthouse n'est PAS une dépendance du projet : on ne l'ajoute jamais aux
`package.json` (et donc jamais au `pnpm-lock.yaml`). Deux options propres :

### Option A — `npx` (recommandée, zéro install)

Pas d'install du tout. À chaque lancement, npm télécharge Lighthouse dans
son cache global et l'exécute :

```bash
npx lighthouse@latest https://civique.fr --view
```

Avantage : aucun fichier ajouté au projet, pas de cache npm à nettoyer
manuellement, toujours la dernière version stable.

Inconvénient : premier lancement plus lent (téléchargement ~50 Mo).

### Option B — install globale (si audits répétés)

Si vous lancez 5+ audits par jour, l'install globale évite le download :

```bash
npm install -g lighthouse
lighthouse https://civique.fr --view
```

> Choix retenu pour Civique : **Option A (`npx`)**. La machine de dev a
> peu d'espace disque et l'on ne lance un audit que ponctuellement avant
> les déploiements majeurs.

### Prérequis Chrome / Chromium

Lighthouse pilote un navigateur headless. Sur Windows, Chrome doit être
installé (chemin par défaut `C:\Program Files\Google\Chrome\Application\chrome.exe`).
Sur le VPS Linux, installer `chromium-browser` (`apt install chromium-browser`).

---

## Audit 1 — Landing publique (`/`)

Pas d'authentification requise, scénario le plus simple :

```bash
npx lighthouse@latest https://civique.fr \
  --output html \
  --output json \
  --output-path ./lighthouse-landing \
  --only-categories=performance,accessibility,best-practices,seo \
  --chrome-flags="--headless=new --no-sandbox" \
  --view
```

Cela produit `lighthouse-landing.report.html` et `lighthouse-landing.report.json`.
L'option `--view` ouvre le rapport HTML dans le navigateur à la fin.

### Variantes mobile vs desktop

Par défaut, Lighthouse simule un mobile bas de gamme (Moto G4 + 3G ralenti).
Pour auditer en desktop :

```bash
npx lighthouse@latest https://civique.fr \
  --preset=desktop \
  --output html \
  --output-path ./lighthouse-landing-desktop.html \
  --only-categories=performance,accessibility,best-practices,seo
```

Lancez **les deux** : la barre de score mobile est presque toujours plus
basse, et c'est elle que Google retient pour le SEO mobile-first.

---

## Audit 2 — Dashboard authentifié (`/app`)

C'est la partie délicate : Lighthouse ouvre un navigateur fresh, donc pas
de cookies, donc le middleware redirige vers `/login` et l'audit mesure la
page de login au lieu du dashboard.

Trois approches au choix :

### 2.a — Cookies pré-injectés (le plus simple)

Récupérer une session de test depuis votre navigateur (DevTools →
Application → Cookies → `civique_access` + `civique_refresh`) puis :

```bash
npx lighthouse@latest https://civique.fr/app \
  --extra-headers='{"Cookie":"civique_access=<token>; civique_refresh=<token>"}' \
  --output html \
  --output-path ./lighthouse-dashboard.html \
  --only-categories=performance,accessibility,best-practices,seo
```

> Ne JAMAIS committer ce fichier `lighthouse-dashboard.html` — il contient
> votre session JWT dans le report JSON. Ajoutez `lighthouse-*.html` et
> `lighthouse-*.json` à `.gitignore` si ce n'est pas déjà fait.

### 2.b — User flow (Lighthouse 9+)

Pour mesurer un parcours (login → dashboard → première session), Lighthouse
expose une API user-flow programmable. Écrire un petit script Node.js :
`https://github.com/GoogleChrome/lighthouse/blob/main/docs/user-flows.md`.

À envisager seulement si l'on veut tracker le LCP de la première session
de training, pas pour des audits avant-déploiement.

### 2.c — Mode "compté comme une page publique" (mauvais)

NE PAS lancer Lighthouse sur `https://civique.fr/app` sans session : il
mesurera `/login`. Le score sera trompeur et faux-vert.

---

## Cibles RECOMMANDÉES — seuils de blocage

Mettre la barre haute parce que l'audience cible (préparation à l'examen
civique) inclut des publics en réseau dégradé (4G en zones rurales,
téléphones d'entrée de gamme).

| Catégorie | Mobile | Desktop |
|---|---|---|
| **Performance** | ≥ 85 | ≥ 90 |
| **Accessibilité** | ≥ 95 | ≥ 95 |
| **Bonnes pratiques** | ≥ 95 | ≥ 95 |
| **SEO** | ≥ 95 | ≥ 95 |

Si l'un de ces scores tombe sous la cible, **bloquer le déploiement** ou
ouvrir un ticket immédiat. Un Perf à 70 mobile est visible : la première
session de training met 3+ secondes à apparaître, certains utilisateurs
abandonnent.

---

## Échecs fréquents — diagnostic rapide

### LCP (Largest Contentful Paint) > 2,5 s

- Image hero trop lourde → optimiser (`next/image`, formats AVIF/WebP,
  width/height explicites pour réserver la place).
- Police custom (Fraunces, DM Sans) non préchargée → ajouter
  `<link rel="preload" as="font" crossOrigin>` dans `app/layout.tsx`.
- Server response > 600 ms → vérifier le SSR Next.js, regarder
  `pm2 logs civique-web`.

### CLS (Cumulative Layout Shift) > 0,1

- Images sans `width`/`height` ou sans `aspect-ratio`.
- Bannière cookie qui s'insère après hydration → utiliser un placeholder
  côté SSR.
- Polices custom qui basculent (FOUT) → `font-display: optional` ou
  préchargement.

### Accessibilité < 95

- Contraste insuffisant sur les boutons en `text-terracotta` → vérifier
  avec WebAIM Contrast Checker.
- Liens sans `aria-label` quand le texte visible est insuffisant ("→").
- `<img alt="">` manquant sur les images décoratives → `alt=""` explicite.

### SEO < 95

- `<meta name="description">` absent sur une route → ajouter dans le
  `metadata` Next.js.
- `<title>` manquant ou identique sur plusieurs pages → titres uniques.
- `robots.txt` non accessible → vérifier `/robots.txt` (déjà couvert par
  `infra/smoke-test.sh`).

### Bonnes pratiques < 95

- Images en HTTP au lieu de HTTPS → tout doit passer par civique.fr.
- Console errors visibles à l'audit → corriger ou supprimer.
- Vulnérabilités JS détectées (jQuery ancien, etc.) → upgrade pnpm.

---

## Workflow recommandé avant chaque release

1. Déployer en staging (ou tester en local : `pnpm --filter web build && pnpm --filter web start`).
2. Lancer audit mobile + desktop sur la landing.
3. Lancer audit dashboard (cookies pré-injectés).
4. Comparer les scores à la baseline du commit précédent.
5. Si régression > 5 points sur une catégorie, ouvrir un ticket avant push prod.
6. Archiver le HTML dans `infra/lighthouse-history/YYYY-MM-DD-<commit-sha>/`
   (en local, pas committé — le but est le suivi de tendance).
