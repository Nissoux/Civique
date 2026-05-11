# Civique — Instructions pour Claude

## Règles absolues

1. **Ne JAMAIS lancer un build si un fix est en attente de commit/push**
2. **Ne JAMAIS dire "ce n'est pas grave"** — chaque bug est grave pour l'utilisateur
3. **Tester VISUELLEMENT** chaque modification qui touche l'affichage — pas juste le code
4. **Quand un shuffle/tri/réordonnancement est implémenté** — vérifier que TOUTES les données liées (traductions, labels, IDs) suivent le même ordre
5. **Tester les traductions** avec au moins une langue non-française après chaque modification des composants qui affichent des questions/choix
6. **Avant de dire "c'est fait"** — relire le code modifié ligne par ligne et vérifier la logique

## Architecture

- **Mobile** : Expo SDK 54, React Native, TypeScript
- **Web** : Next.js 15 App Router, React 19, Tailwind 3.4 (Tisserand design, light-only)
- **Serveur** : Fastify 5, Drizzle ORM, PostgreSQL 16
- **VPS** : Hetzner (Allemagne), PM2, Nginx, Let's Encrypt
- **API** : https://api.integrafle.fr
- **Web** : https://civique.integrafle.fr
- **Emails** : Brevo API HTTP (sender `support@integrafle.fr`)
- **Auth** : JWT (httpOnly cookies côté web) + Apple Sign-In + Google Sign-In (mobile)

Pour une vue détaillée des flux de données, voir [`ARCHITECTURE.md`](ARCHITECTURE.md).

## Déploiement

Le script `infra/deploy.sh` accepte trois modes — choisir le plus
ciblé possible (gain de temps + risque réduit).

**Backend uniquement** (rapide, pas d'install ni de build, ~5 s) :
```bash
ssh root@api.integrafle.fr "bash /root/Civique/infra/deploy.sh server"
```

**Web uniquement** (install + build Next.js + restart, ~2-3 min) :
```bash
ssh root@api.integrafle.fr "bash /root/Civique/infra/deploy.sh web"
```

**Tout (par défaut, full deploy)** :
```bash
ssh root@api.integrafle.fr "bash /root/Civique/infra/deploy.sh"
# équivalent à
ssh root@api.integrafle.fr "bash /root/Civique/infra/deploy.sh all"
```

Le script enchaîne `git pull origin main` → `pnpm install --frozen-lockfile`
(si web ou all) → `pnpm --filter web build` (si web ou all) → `pm2 restart`
(`civique` et/ou `civique-web` selon le mode). Voir
[DEPLOYMENT.md](DEPLOYMENT.md) pour le setup initial (Nginx, Let's
Encrypt, PM2 register, variables d'environnement, configuration Stripe
et Brevo).

## Checklist avant build

Voir `.claude/VERIFICATION_CHECKLIST.md`. Pour les builds mobile (EAS),
suivre aussi `LESSONS_LEARNED.md` section 9.

## Recent decisions

Décisions d'architecture / produit déjà tranchées avec le Product Owner.
**Ne pas remettre en cause sans accord explicite** — chaque ligne ici a
été pesée et débattue.

1. **Hetzner plutôt que Vercel pour le web** — souveraineté (hébergement
   Allemagne, RGPD), coût fixe prévisible, mutualisation avec le
   backend déjà sur le VPS. Trade-off assumé : on opère soi-même
   Nginx / PM2 / Postgres au lieu d'avoir l'edge CDN. Le fichier
   `apps/web/vercel.json` reste prêt si revirement.
2. **Design Tisserand light-only** côté web — palette terracotta /
   bone / aubergine validée par le PO, dark mode skippé (charge dev
   disproportionnée par rapport à la valeur pour un public francophone
   qui consulte plutôt en journée et sur mobile). L'app mobile garde
   son dark mode existant (claymorphism), sans contradiction.
3. **Pas de tests automatisés pour le MVP** — `QA_SMOKE.md` (53 items)
   sert de référence manuelle, exécutée avant chaque release. Trade-off
   assumé : on rattrapera par `vitest` + `@axe-core/playwright`
   post-launch quand le rythme de shipping ralentira. Voir
   `POST_LAUNCH_ROADMAP.md` D+60.
4. **Codes de reset MDP à 8 caractères uppercase** plutôt que tokens
   URL longs — l'utilisateur tape le code reçu par email dans un champ
   (TTL 1h). Plus simple côté UX (pas de copie de lien fragile depuis
   un client mail mobile), entropy suffisante (8 char hex =
   ~4 milliards de combinaisons sur 1h TTL + rate limit 100 req/min).
   Implémenté dans `apps/server/src/routes/auth/index.ts`.

Pour les bugs déjà connus / la dette technique acceptée, voir
[`KNOWN_ISSUES.md`](KNOWN_ISSUES.md). Pour les priorités à 30/60/90
jours, voir [`POST_LAUNCH_ROADMAP.md`](POST_LAUNCH_ROADMAP.md).
