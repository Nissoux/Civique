#!/usr/bin/env node
/**
 * Réconciliation RevenueCat ↔ base Civique — le filet de sécurité
 * anti-rechute de l'incident webhooks (LESSONS_LEARNED §10).
 *
 * Toutes les 6 h (crontab), ce job interroge l'API RevenueCat pour
 * chaque utilisateur et ALIGNE la base : tout abonnement actif côté
 * RevenueCat qui n'est pas reflété en base est activé/prolongé.
 *
 * Philosophie « upgrade-only » : le job ACTIVE et PROLONGE, il ne
 * rétrograde JAMAIS. Les rétrogradations naturelles (expiration,
 * annulation) restent du ressort du webhook — ainsi les grants
 * manuels (promo, gestes commerciaux, premium à vie) survivent au
 * passage du job. Trade-off assumé : si le webhook meurt, un abonné
 * qui résilie garde son accès jusqu'à réparation — fuite mineure,
 * préférable à l'inverse (payeur bloqué).
 *
 * Zéro dépendance : Node ≥ 18 (fetch natif) + psql en CLI.
 * Config lue dans apps/server/.env :
 *   REVENUECAT_API_KEY   (clé SECRÈTE v1, sk_…) — job inerte si absente
 *   BREVO_API_KEY        (optionnel, pour l'email d'alerte)
 *   RECONCILE_ALERT_EMAIL (optionnel, défaut contact@integrafle.fr)
 *
 * Usage : node /root/Civique/infra/reconcile-revenuecat.mjs [--dry-run]
 */

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const ENV_PATH = '/root/Civique/apps/server/.env';
const DRY_RUN = process.argv.includes('--dry-run');

// ── Config ────────────────────────────────────────────────
function loadEnv(path) {
  const env = {};
  try {
    for (const line of readFileSync(path, 'utf-8').split('\n')) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m) env[m[1]] = m[2].trim();
    }
  } catch {
    /* .env absent — géré plus bas */
  }
  return env;
}

const env = loadEnv(ENV_PATH);
const RC_KEY = env.REVENUECAT_API_KEY;
const BREVO_KEY = env.BREVO_API_KEY;
const ALERT_EMAIL = env.RECONCILE_ALERT_EMAIL || 'contact@integrafle.fr';

const ts = () => new Date().toISOString();
const log = (msg) => console.log(`[${ts()}] ${msg}`);

if (!RC_KEY) {
  log('REVENUECAT_API_KEY absente du .env — job inerte (rien à faire). ' +
      'Créer une clé secrète dans RevenueCat → API keys et l\'ajouter au .env pour activer la réconciliation.');
  process.exit(0);
}

// ── Helpers ───────────────────────────────────────────────
function psql(query) {
  return execFileSync(
    'psql',
    ['-h', 'localhost', '-U', 'postgres', '-d', 'civique', '-tA', '-F', '\t', '-c', query],
    { env: { ...process.env, PGPASSWORD: 'postgres' }, encoding: 'utf-8' },
  ).trim();
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchSubscriber(userId) {
  const res = await fetch(`https://api.revenuecat.com/v1/subscribers/${encodeURIComponent(userId)}`, {
    headers: { Authorization: `Bearer ${RC_KEY}` },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/** Date d'expiration la plus lointaine parmi les entitlements actifs. */
function latestActiveExpiry(subscriber) {
  let latest = null;
  const entitlements = subscriber?.subscriber?.entitlements ?? {};
  for (const ent of Object.values(entitlements)) {
    if (!ent?.expires_date) continue; // lifetime RC — ne devrait pas arriver ici
    const exp = new Date(ent.expires_date);
    if (exp > new Date() && (!latest || exp > latest)) latest = exp;
  }
  return latest;
}

async function sendAlert(subject, lines) {
  if (!BREVO_KEY) {
    log(`(pas de BREVO_API_KEY — alerte non envoyée : ${subject})`);
    return;
  }
  try {
    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': BREVO_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender: { name: 'Civique — Réconciliation', email: 'support@integrafle.fr' },
        to: [{ email: ALERT_EMAIL }],
        subject: `[Civique] ${subject}`,
        textContent: lines.join('\n'),
      }),
      signal: AbortSignal.timeout(15000),
    });
    log(`Alerte envoyée à ${ALERT_EMAIL} : ${subject}`);
  } catch (e) {
    log(`Échec envoi alerte (${e.message}) — contenu : ${lines.join(' | ')}`);
  }
}

// ── Job ───────────────────────────────────────────────────
async function main() {
  log(`Réconciliation RevenueCat démarrée${DRY_RUN ? ' (dry-run)' : ''}`);

  const rows = psql(
    "SELECT id, email, is_premium, COALESCE(premium_expires::text, '') FROM users ORDER BY created_at",
  );
  const users = rows ? rows.split('\n').map((l) => {
    const [id, email, isPremium, premiumExpires] = l.split('\t');
    return { id, email, isPremium: isPremium === 't', premiumExpires };
  }) : [];
  log(`${users.length} utilisateurs à vérifier`);

  const corrections = [];
  const errors = [];

  for (const u of users) {
    try {
      const sub = await fetchSubscriber(u.id);
      const rcExpiry = latestActiveExpiry(sub);
      if (!rcExpiry) continue; // pas d'abonnement actif côté RC

      const dbExpiry = u.premiumExpires ? new Date(u.premiumExpires) : null;
      // Upgrade nécessaire si : pas premium, ou premium à durée plus
      // courte que la réalité RC. (premium_expires NULL = à vie → on
      // ne touche jamais, c'est déjà mieux que l'abonnement.)
      const needsUpgrade =
        !u.isPremium || (u.isPremium && dbExpiry !== null && dbExpiry < rcExpiry);

      if (needsUpgrade) {
        const expIso = rcExpiry.toISOString();
        if (!DRY_RUN) {
          psql(
            `UPDATE users SET is_premium = true, premium_expires = '${expIso}', updated_at = NOW() WHERE id = '${u.id}'`,
          );
        }
        corrections.push(`${u.email} → premium jusqu'au ${expIso} (était : ${u.isPremium ? u.premiumExpires || 'à vie' : 'gratuit'})`);
        log(`CORRIGÉ${DRY_RUN ? ' (dry-run)' : ''} : ${u.email} → ${expIso}`);
      }
    } catch (e) {
      errors.push(`${u.email} : ${e.message}`);
      log(`ERREUR ${u.email} : ${e.message}`);
    }
    await sleep(150); // politesse API
  }

  log(`Terminé — ${corrections.length} correction(s), ${errors.length} erreur(s)`);

  // Une correction = un payeur qui était bloqué = le webhook a raté
  // quelque chose → alerte. Des erreurs API en série → alerte aussi.
  if (corrections.length > 0) {
    await sendAlert(
      `Réconciliation : ${corrections.length} payeur(s) corrigé(s) — vérifier le webhook`,
      [
        'Le job de réconciliation a trouvé des abonnés RevenueCat actifs non reflétés en base.',
        'Cela signifie que des événements webhook ont été manqués. Corrections appliquées :',
        '',
        ...corrections,
        '',
        'Vérifier : RevenueCat → Integrations → Webhooks (statut des livraisons).',
      ],
    );
  }
  if (errors.length > 3) {
    await sendAlert(`Réconciliation : ${errors.length} erreurs API RevenueCat`, errors.slice(0, 20));
  }
}

main().catch(async (e) => {
  log(`ÉCHEC GLOBAL : ${e.message}`);
  await sendAlert('Réconciliation : échec global du job', [String(e.stack || e.message)]);
  process.exit(1);
});
