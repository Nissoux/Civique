# Monitoring uptime — Civique

Tant qu'on n'a pas de monitoring, on apprend qu'un service est tombé
quand un utilisateur écrit. Objectif : alerte mail < 5 min après une
panne. Solution gratuite, sans rien à installer sur le VPS.

---

## 1. Quel outil ?

| Outil          | Free tier                       | Intervalle | Verdict |
|----------------|---------------------------------|------------|---------|
| **Uptime Robot** | 50 monitors gratuits           | 5 min      | **Recommandé** — UI simple, alertes mail incluses, pas de carte requise pour s'inscrire |
| BetterStack    | 10 monitors / 3 min intervalle  | 3 min      | Plus joli (status page) mais carte demandée au-delà de 10 monitors |
| Hetzner Cloud Monitoring | Inclus avec le serveur  | 1 min      | Surveille **le serveur** (CPU/RAM/disque) pas les endpoints HTTP — complémentaire, pas un remplacement |

→ On part sur **Uptime Robot** pour les checks HTTP. On peut ajouter
Hetzner Monitoring plus tard pour les métriques serveur.

---

## 2. Setup Uptime Robot — étape par étape

### 2.1 — Créer le compte

1. Aller sur https://uptimerobot.com
2. **Sign Up** (free) — email + mot de passe, pas de carte
3. Confirmer l'email reçu

### 2.2 — Ajouter le monitor du frontend

1. Dashboard → **+ Add New Monitor**
2. Remplir :
   - **Monitor Type** : `HTTP(s)`
   - **Friendly Name** : `Civique Web`
   - **URL** : `https://civique.integrafle.fr`
   - **Monitoring Interval** : `5 minutes` (max en free)
3. **Alert Contacts to Notify** : cocher l'email par défaut (ton email
   d'inscription). Tu peux ajouter une 2e adresse en
   *My Settings → Alert Contacts → Add Alert Contact*.
4. **Create Monitor**

### 2.3 — Ajouter le monitor de l'API

1. **+ Add New Monitor** à nouveau
2. Remplir :
   - **Monitor Type** : `HTTP(s) — Keyword`
   - **Friendly Name** : `Civique API`
   - **URL** : `https://api.integrafle.fr/health`
   - **Keyword Type** : `exists`
   - **Keyword Value** : `ok`
   - **Monitoring Interval** : `5 minutes`
3. **Alert Contacts** : même email
4. **Create Monitor**

> Pourquoi keyword + `ok` ? Si le backend est planté mais Nginx renvoie
> une page d'erreur 502 avec code HTTP 200 (peu probable mais déjà vu),
> un check HTTP simple passe. Vérifier la présence du mot `ok` dans la
> réponse garantit que Fastify répond vraiment.

### 2.4 — Tester l'alerte

Sur le VPS :
```bash
pm2 stop civique-web
```
Attendre 5-6 min. Tu dois recevoir un mail "Civique Web is DOWN".
Re-démarrer :
```bash
pm2 start civique-web
```
Mail "Civique Web is UP" attendu dans les 5 min.

---

## 3. Endpoint /health côté backend

Déjà présent dans `apps/server/src/index.ts` :

```ts
app.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));
```

Réponse :
```json
{ "status": "ok", "timestamp": "2026-05-11T12:00:00.000Z" }
```

Pas besoin de l'ajouter — il existe déjà. C'est ce que checke le
monitor `Civique API` ci-dessus (mot-clé `ok` dans la réponse).

---

## 4. Améliorations futures (plus tard)

- **Status page publique** (Uptime Robot la fournit gratuite) — utile
  si on a > 50 users, pour qu'ils voient le statut avant d'écrire.
  *Dashboard → Public Status Pages → Add New*.
- **Slack/Discord webhook** au lieu de mail si on veut une équipe :
  *My Settings → Alert Contacts → Add → Webhook*.
- **Synthetic check** plus profond : POST `/api/auth/login` avec un
  compte test pour vérifier que la DB répond — demande le tier payant
  pour les checks avec body.
- **Sentry** côté Next.js (déjà cité dans `DEPLOYMENT.md` §7) pour les
  erreurs JS côté client — complémentaire d'Uptime Robot.

---

## 5. Récap

- 2 monitors créés, 0 € / mois
- Alerte mail < 5 min après une panne
- Pas de dette technique sur le VPS (rien à maintenir)
- `/health` existe déjà côté backend
