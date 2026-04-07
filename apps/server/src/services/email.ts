import { env } from '../config/env.js';

const FROM_EMAIL = 'support@integrafle.fr';
const FROM_NAME = 'Civique';

// Logo hosted on GitHub for email rendering
const LOGO_URL = 'https://raw.githubusercontent.com/Nissoux/Civique/main/apps/mobile/assets/logo-c.png';

function emailWrapper(content: string): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#F4F1FA;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F4F1FA;padding:40px 20px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF;border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
        <!-- Header avec gradient -->
        <tr><td style="background:linear-gradient(135deg,#0F172A 0%,#1E2B50 50%,#2563EB 100%);padding:40px 40px 30px;text-align:center">
          <img src="${LOGO_URL}" alt="Civique" width="72" height="72" style="border-radius:18px;margin-bottom:16px;display:block;margin-left:auto;margin-right:auto">
          <h1 style="color:#FFFFFF;font-size:24px;font-weight:800;margin:0;letter-spacing:-0.5px">Civique</h1>
          <p style="color:rgba(255,255,255,0.6);font-size:13px;margin:6px 0 0">Préparation à l'examen civique français</p>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:36px 40px 40px">
          ${content}
        </td></tr>
        <!-- Footer -->
        <tr><td style="background-color:#F8F6FC;padding:24px 40px;text-align:center;border-top:1px solid #EDE9F5">
          <p style="color:#9994A1;font-size:12px;margin:0;line-height:18px">
            Cet email a été envoyé par Civique — IntégraFLE<br>
            <a href="https://api.integrafle.fr/privacy" style="color:#2563EB;text-decoration:none">Politique de confidentialité</a> ·
            <a href="https://api.integrafle.fr/terms" style="color:#2563EB;text-decoration:none">CGU</a> ·
            <a href="mailto:support@integrafle.fr" style="color:#2563EB;text-decoration:none">Support</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

async function sendEmail(to: string, subject: string, content: string) {
  const apiKey = env.BREVO_API_KEY;
  if (!apiKey) {
    console.error('BREVO_API_KEY not set — email not sent');
    return;
  }

  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: FROM_NAME, email: FROM_EMAIL },
        to: [{ email: to }],
        subject,
        htmlContent: emailWrapper(content),
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Brevo API error:', res.status, err);
    }
  } catch (err) {
    console.error('Failed to send email:', err);
  }
}

export async function sendVerificationEmail(email: string, code: string) {
  await sendEmail(email, 'Vérifiez votre adresse e-mail — Civique', `
    <h2 style="color:#1A1A2E;font-size:22px;font-weight:700;margin:0 0 12px">Vérification de votre e-mail</h2>
    <p style="color:#635F69;font-size:15px;line-height:24px;margin:0 0 24px">
      Bienvenue sur Civique ! Pour activer votre compte, entrez le code ci-dessous dans l'application :
    </p>
    <div style="background:#EFF6FF;border-radius:16px;padding:28px;text-align:center;margin:0 0 24px">
      <p style="font-size:36px;font-weight:800;color:#2563EB;letter-spacing:8px;margin:0;font-family:monospace">${code}</p>
    </div>
    <p style="color:#9994A1;font-size:13px;line-height:20px;margin:0">
      Ce code expire dans <strong>15 minutes</strong>.<br>
      Si vous n'avez pas créé de compte sur Civique, ignorez ce message.
    </p>
  `);
}

export async function sendWelcomeEmail(email: string, displayName: string) {
  await sendEmail(email, 'Bienvenue sur Civique ! 🎉', `
    <h2 style="color:#1A1A2E;font-size:22px;font-weight:700;margin:0 0 12px">Bienvenue, ${displayName} !</h2>
    <p style="color:#635F69;font-size:15px;line-height:24px;margin:0 0 24px">
      Votre compte est vérifié et prêt à l'emploi. Vous pouvez maintenant préparer votre examen civique français.
    </p>
    <div style="background:#EFF6FF;border-radius:16px;padding:24px;margin:0 0 24px">
      <p style="margin:0 0 12px;font-weight:700;color:#1A1A2E;font-size:15px">Ce qui vous attend :</p>
      <table cellpadding="6" cellspacing="0" style="width:100%">
        <tr><td style="color:#2563EB;font-size:18px;width:30px">📝</td><td style="color:#635F69;font-size:14px">611 questions d'entraînement</td></tr>
        <tr><td style="color:#2563EB;font-size:18px;width:30px">🎯</td><td style="color:#635F69;font-size:14px">Mises en situation comme à l'examen</td></tr>
        <tr><td style="color:#2563EB;font-size:18px;width:30px">📊</td><td style="color:#635F69;font-size:14px">Suivi de progression avec XP et couronnes</td></tr>
        <tr><td style="color:#2563EB;font-size:18px;width:30px">🌍</td><td style="color:#635F69;font-size:14px">Disponible en 6 langues</td></tr>
      </table>
    </div>
    <p style="color:#635F69;font-size:15px;line-height:24px;margin:0">Bonne préparation ! 🇫🇷</p>
  `);
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const code = token.substring(0, 8).toUpperCase();
  await sendEmail(email, 'Réinitialisation du mot de passe — Civique', `
    <h2 style="color:#1A1A2E;font-size:22px;font-weight:700;margin:0 0 12px">Réinitialisation du mot de passe</h2>
    <p style="color:#635F69;font-size:15px;line-height:24px;margin:0 0 24px">
      Vous avez demandé la réinitialisation de votre mot de passe. Voici votre code :
    </p>
    <div style="background:#EFF6FF;border-radius:16px;padding:28px;text-align:center;margin:0 0 24px">
      <p style="font-size:36px;font-weight:800;color:#2563EB;letter-spacing:8px;margin:0;font-family:monospace">${code}</p>
    </div>
    <p style="color:#9994A1;font-size:13px;line-height:20px;margin:0">
      Ce code expire dans <strong>1 heure</strong>.<br>
      Si vous n'avez pas demandé cette réinitialisation, ignorez ce message.
    </p>
  `);
}

export async function sendPasswordChangedEmail(email: string) {
  await sendEmail(email, 'Mot de passe modifié — Civique', `
    <h2 style="color:#1A1A2E;font-size:22px;font-weight:700;margin:0 0 12px">Mot de passe modifié</h2>
    <p style="color:#635F69;font-size:15px;line-height:24px;margin:0 0 16px">
      Votre mot de passe a été modifié avec succès.
    </p>
    <div style="background:#FEE2E2;border-radius:12px;padding:16px;margin:0 0 16px">
      <p style="color:#DC2626;font-size:14px;margin:0">
        ⚠️ Si vous n'êtes pas à l'origine de ce changement, contactez-nous immédiatement à
        <a href="mailto:support@integrafle.fr" style="color:#DC2626;font-weight:700">support@integrafle.fr</a>
      </p>
    </div>
  `);
}
