# Civique — Runbook opérationnel

Pour quand quelque chose tourne mal en prod. Chaque scénario : 1-3 phrases
de contexte + les commandes exactes à coller.

> Convention : toutes les commandes supposent que tu es **root sur le VPS**
> (`ssh root@api.integrafle.fr`), sauf mention contraire.

---

## Table des matières

1. [Rollback web](#1-rollback-web)
2. [Rollback backend](#2-rollback-backend)
3. [Backup à chaud de la DB](#3-backup-à-chaud-de-la-db)
4. [Restore d'un backup](#4-restore-dun-backup)
5. [Consulter les logs PM2](#5-consulter-les-logs-pm2)
6. [Restart zero-downtime](#6-restart-zero-downtime-pm2-reload)
7. [Reset PM2 (cas désespéré)](#7-reset-pm2-cas-désespéré)
8. [Augmenter le swap](#8-augmenter-le-swap)
9. [Renouveler le SSL manuellement](#9-renouveler-le-ssl-manuellement)
10. [Diagnostiquer un 502 Bad Gateway](#10-diagnostiquer-un-502-bad-gateway)
11. [Disque plein](#11-disque-plein)
12. [Pression mémoire](#12-pression-mémoire)

---

## 1. Rollback web

**Contexte** : un commit cassé est passé en prod côté Next.js. La landing
ou l'app web est inutilisable. Revenir au commit précédent.

```bash
# Sur ta machine locale :
git revert HEAD --no-edit
git push origin main

# Puis déployer le web uniquement (rapide) :
ssh root@api.integrafle.fr "bash /root/Civique/infra/deploy.sh web"

# Vérifier :
curl -I https://civique.integrafle.fr   # 200 attendu
```

Si le rebuild casse aussi : `cd /root/Civique && git checkout <sha_stable> -- apps/web && pnpm --filter web build && pm2 restart civique-web`. Note le SHA stable depuis `git log --oneline -10`.

---

## 2. Rollback backend

**Contexte** : un commit serveur fait crasher Fastify ou casse une route
critique (paiement, auth…). Le frontend continue de tourner mais les
appels API échouent.

```bash
# Sur ta machine locale :
git revert HEAD --no-edit
git push origin main

# Sur le VPS (rapide — pas de pnpm install requis pour le backend) :
ssh root@api.integrafle.fr "bash /root/Civique/infra/deploy.sh server"

# Vérifier :
curl https://api.integrafle.fr/health
# {"status":"ok","timestamp":"..."}
```

Si le revert touche une migration DB déjà appliquée, voir §4 (restore)
avant de redéployer.

---

## 3. Backup à chaud de la DB

**Contexte** : avant une opération risquée (migration, restore, refactor
de schéma), on prend un dump immédiat — en plus du backup cron quotidien.

```bash
bash /root/Civique/infra/backup-db.sh

# Vérifie le fichier créé :
ls -lh /var/backups/civique/ | tail -3
```

Le dump compressé arrive à `/var/backups/civique/civique-YYYY-MM-DD.sql.gz`.
S'il existe déjà pour aujourd'hui, il est écrasé (atomique via `.tmp`).

---

## 4. Restore d'un backup

**Contexte** : la DB est corrompue ou une migration a effacé une table.
On revient au dump du jour précédent. **Cette procédure détruit la DB
actuelle — fais un dump à chaud avant si possible.**

```bash
# 1. Lister les backups disponibles :
ls -lh /var/backups/civique/

# 2. Stopper le backend (évite les writes pendant le restore) :
pm2 stop civique

# 3. Drop + recreate la DB :
sudo -u postgres psql -c "DROP DATABASE civique;"
sudo -u postgres psql -c "CREATE DATABASE civique OWNER civique;"

# 4. Restorer (remplacer la date par le bon fichier) :
gunzip -c /var/backups/civique/civique-2026-05-10.sql.gz | \
  sudo -u postgres psql civique

# 5. Re-démarrer + vérifier :
pm2 start civique
pm2 logs civique --lines 50
curl https://api.integrafle.fr/health
```

Avant de manipuler la prod, smoke-test sans destruction :

```bash
sudo -u postgres createdb civique_restore_test
gunzip -c /var/backups/civique/civique-2026-05-10.sql.gz | \
  sudo -u postgres psql civique_restore_test
sudo -u postgres psql civique_restore_test -c "SELECT count(*) FROM users;"
sudo -u postgres dropdb civique_restore_test
```

---

## 5. Consulter les logs PM2

**Contexte** : un user signale un bug, on cherche la trace côté serveur
ou côté web.

```bash
# Stream live (Ctrl+C pour sortir) :
pm2 logs civique          # backend
pm2 logs civique-web      # frontend

# Les N dernières lignes seulement :
pm2 logs civique --lines 200 --nostream
pm2 logs civique-web --lines 200 --nostream

# Filtrer une erreur :
pm2 logs civique --lines 1000 --nostream | grep -i error

# Erreurs uniquement (sépare stdout / stderr) :
pm2 logs civique --err --lines 200 --nostream
```

Les fichiers bruts sont dans `~/.pm2/logs/` (rotés par `pm2-logrotate`).

---

## 6. Restart zero-downtime (`pm2 reload`)

**Contexte** : après un déploiement ou un changement d'env, on veut
relancer sans laisser tomber les requêtes en cours. `reload` démarre la
nouvelle instance avant de tuer l'ancienne ; `restart` les tue d'abord
(downtime de 1-2 s).

```bash
# Préférer pour les déploiements courants :
pm2 reload civique
pm2 reload civique-web

# Si reload ne marche pas (process crashed), restart est plus brut mais
# fiable :
pm2 restart civique
pm2 restart civique-web
```

Note : `reload` ne fonctionne vraiment en zero-downtime qu'en mode cluster
(plusieurs instances). Avec `instances: 1` (notre cas), `reload` se
comporte comme `restart` mais sans purger le PID — toujours préférable.

---

## 7. Reset PM2 (cas désespéré)

**Contexte** : PM2 lui-même se comporte bizarrement (process zombie,
status `errored` qui ne disparaît pas, conflit de port). On flush
complètement et on relance depuis la liste sauvegardée.

```bash
# Sauve l'état actuel (au cas où) :
pm2 save

# Kill total du daemon PM2 + tous les process gérés :
pm2 kill

# Relance depuis la dernière sauvegarde :
pm2 resurrect

# Vérifier :
pm2 status
curl https://api.integrafle.fr/health
curl -I https://civique.integrafle.fr
```

Si `pm2 resurrect` ne ramène pas `civique-web`, redémarre-le manuellement :

```bash
cd /root/Civique
pm2 start apps/web/ecosystem.config.cjs
pm2 save
```

---

## 8. Augmenter le swap

**Contexte** : un build Next.js peut prendre 1-1.5 GB de RAM. Sur un VPS
4 GB partagé avec Postgres + 2 process Node, on frôle le OOM. Ajouter du
swap protège contre les kills.

```bash
# Vérifier ce qu'on a déjà :
free -h
swapon --show

# Ajouter 2 GB (ou 4 GB si build répété) :
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile

# Persistant à travers les reboots :
echo '/swapfile none swap sw 0 0' >> /etc/fstab

# Vérifier :
free -h
```

Tip : si le disque est tight, réduis la taille (`-l 1G`). Le swap mange
de l'espace disque équivalent à sa taille.

---

## 9. Renouveler le SSL manuellement

**Contexte** : normalement `certbot.timer` renouvelle tout seul tous les
60 jours. Si l'expiration approche et tu n'as pas eu d'email, force le
renouvellement.

```bash
# Dry-run d'abord (vérifie que tout fonctionne sans toucher au cert) :
certbot renew --dry-run

# Si OK, force le vrai renouvellement :
certbot renew

# Recharger Nginx pour servir le nouveau cert :
systemctl reload nginx

# Vérifier la date d'expiration :
echo | openssl s_client -connect civique.integrafle.fr:443 2>/dev/null | \
  openssl x509 -noout -dates
```

Domaines à surveiller : `civique.integrafle.fr`, `www.civique.integrafle.fr`, `api.integrafle.fr`.

---

## 10. Diagnostiquer un 502 Bad Gateway

**Contexte** : Nginx répond mais le process applicatif derrière (PM2)
ne répond pas. Le user voit "502 Bad Gateway".

Checklist dans l'ordre :

```bash
# 1. PM2 a-t-il le process en "online" ?
pm2 status
# Attendu : civique online, civique-web online

# 2. Le port est-il bien ouvert localement ?
curl -I http://127.0.0.1:3000/health   # backend
curl -I http://127.0.0.1:3001          # web
# 200 attendu

# 3. Si non, regarde les logs récents :
pm2 logs civique --lines 100 --nostream --err
pm2 logs civique-web --lines 100 --nostream --err

# 4. Vérifie que Nginx pointe vers le bon port :
nginx -T 2>/dev/null | grep -E "proxy_pass|upstream"

# 5. Erreurs Nginx récentes :
tail -50 /var/log/nginx/error.log

# 6. Si pm2 est down → redémarrer :
pm2 start civique civique-web
# Si reload ne suffit pas → §7 (reset PM2)
```

Causes fréquentes : OOM-killer a tué le process (voir `dmesg | tail`),
DATABASE_URL invalide après changement d'env, port déjà occupé par un
process zombie (`lsof -i :3000`).

---

## 11. Disque plein

**Contexte** : `df -h /` affiche > 90 % d'utilisation. Le risque : Postgres
refuse les writes, les logs ne s'écrivent plus, le build échoue.

```bash
# 1. Voir où ça se passe :
du -sh /root/Civique /var/log /var/lib/postgresql /var/backups/civique
du -sh /root/.pm2/logs/*
du -sh /root/Civique/apps/web/.next

# 2. Cleanup en un coup :
bash /root/Civique/infra/disk-hygiene.sh

# 3. Si toujours tight, cibles spécifiques :
journalctl --vacuum-time=7d              # systemd logs
pm2 flush                                 # PM2 logs (rotation gérée par pm2-logrotate)
apt clean                                 # cache APT
rm -rf /root/Civique/apps/web/.next/cache # Next.js cache (rebuild le récupère)
find /var/backups/civique -mtime +7 -delete  # vieux backups

# 4. Si Postgres a explosé en taille :
sudo -u postgres psql -c "SELECT pg_size_pretty(pg_database_size('civique'));"
# Si > 1 GB et inattendu : voir les plus grosses tables
sudo -u postgres psql civique -c "
  SELECT relname, pg_size_pretty(pg_total_relation_size(relid))
  FROM pg_catalog.pg_statio_user_tables
  ORDER BY pg_total_relation_size(relid) DESC LIMIT 10;"
```

---

## 12. Pression mémoire

**Contexte** : `free -h` montre RAM proche du max, `Swap used` non nul,
le serveur rame. Risque : OOM-killer choisit Postgres ou Node et casse le
service.

```bash
# 1. Vue d'ensemble :
free -h
pm2 monit       # interactive — Ctrl+C pour sortir

# 2. Quel process bouffe la RAM ?
ps aux --sort=-%mem | head -10

# 3. Vérifier si l'OOM-killer a déjà frappé (passé récent) :
dmesg | grep -i 'killed process' | tail -5

# 4. Solution rapide — relancer les process lourds :
pm2 reload civique-web   # Next.js peut leaker, restart rafraîchit
pm2 reload civique

# 5. Solution durable : augmenter le swap (§8) ou augmenter la RAM du
# VPS (Hetzner Cloud → Console → Rescale, downtime ~30 s).

# 6. Vérifier les seuils max_memory_restart des configs PM2 :
grep -r max_memory_restart /root/Civique/apps/*/ecosystem.config.cjs
# civique-web est à 600M par défaut — PM2 redémarre auto si dépassé.
```

---

## Annexes

- Script de déploiement : `/root/Civique/infra/deploy.sh`
- Backup : `/root/Civique/infra/backup-db.sh` + cron `0 3 * * *`
- Logrotate PM2 : `/root/Civique/infra/setup-logrotate.sh` (lancer 1 fois)
- Hygiène disque : `/root/Civique/infra/disk-hygiene.sh`
- Monitoring : `infra/monitoring.md` (Uptime Robot, 2 monitors)
- Déploiement initial : `DEPLOYMENT.md` (à la racine du repo)
