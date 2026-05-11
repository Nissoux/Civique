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
- **Web** : Next.js 15 App Router, React 19, Tailwind 3.4 (Tisserand design)
- **Serveur** : Fastify, Drizzle ORM, PostgreSQL
- **VPS** : Hetzner (Allemagne), PM2, Nginx
- **API** : https://api.integrafle.fr
- **Web** : https://civique.fr
- **Emails** : Brevo API HTTP
- **Auth** : JWT (httpOnly cookies côté web) + Apple Sign-In + Google Sign-In (mobile)

## Déploiement

**Backend uniquement** (rapide, pas d'install) :
```bash
ssh root@api.integrafle.fr "bash /root/Civique/infra/deploy.sh server"
```

**Web uniquement** (build Next.js, ~2-3 min) :
```bash
ssh root@api.integrafle.fr "bash /root/Civique/infra/deploy.sh web"
```

**Tout (par défaut)** :
```bash
ssh root@api.integrafle.fr "bash /root/Civique/infra/deploy.sh"
```

Le script `infra/deploy.sh` fait `git pull` + `pnpm install --frozen-lockfile`
(si web) + `pnpm --filter web build` (si web) + `pm2 restart`. Voir
[DEPLOYMENT.md](DEPLOYMENT.md) pour le setup initial (Nginx, Let's Encrypt,
PM2 register).

## Checklist avant build

Voir `.claude/VERIFICATION_CHECKLIST.md`
