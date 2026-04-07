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
- **Serveur** : Fastify, Drizzle ORM, PostgreSQL
- **VPS** : Hetzner (Allemagne), PM2, Nginx
- **API** : https://api.integrafle.fr
- **Emails** : Brevo API HTTP
- **Auth** : JWT + Apple Sign-In + Google Sign-In

## Déploiement

Après chaque push :
```bash
ssh root@api.integrafle.fr "cd /root/Civique && git pull origin main && pm2 restart civique"
```

## Checklist avant build

Voir `.claude/VERIFICATION_CHECKLIST.md`
