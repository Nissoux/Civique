import { env } from '../config/env.js';

const FROM_EMAIL = 'support@integrafle.fr';
const FROM_NAME = 'Civique';

async function sendEmail(to: string, subject: string, html: string) {
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
        htmlContent: html,
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

export async function sendWelcomeEmail(email: string, displayName: string) {
  await sendEmail(email, 'Bienvenue sur Civique !', `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#1A1A2E">
  <div style="text-align:center;padding:30px 0">
    <h1 style="color:#2563EB;font-size:28px;margin:0">Bienvenue sur Civique !</h1>
  </div>
  <p>Bonjour <strong>${displayName}</strong>,</p>
  <p>Votre compte a été créé avec succès. Vous êtes prêt(e) à préparer votre examen civique français.</p>
  <div style="background:#EFF6FF;border-radius:16px;padding:20px;margin:20px 0">
    <p style="margin:0 0 8px"><strong>Ce qui vous attend :</strong></p>
    <ul style="margin:0;padding-left:20px">
      <li>611 questions d'entraînement</li>
      <li>Mises en situation comme à l'examen</li>
      <li>Examens blancs en conditions réelles</li>
      <li>Suivi de votre progression</li>
    </ul>
  </div>
  <p>Bonne préparation !</p>
  <p style="color:#999;font-size:12px;margin-top:30px">
    Cet email a été envoyé automatiquement par Civique.
  </p>
</body>
</html>`);
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const code = token.substring(0, 8).toUpperCase();
  await sendEmail(email, 'Réinitialisation de votre mot de passe - Civique', `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#1A1A2E">
  <div style="text-align:center;padding:30px 0">
    <h1 style="color:#2563EB;font-size:24px;margin:0">Réinitialisation du mot de passe</h1>
  </div>
  <p>Bonjour,</p>
  <p>Vous avez demandé la réinitialisation de votre mot de passe. Voici votre code :</p>
  <div style="background:#EFF6FF;border-radius:16px;padding:24px;margin:20px 0;text-align:center">
    <p style="font-size:32px;font-weight:bold;color:#2563EB;letter-spacing:4px;margin:0">${code}</p>
  </div>
  <p>Ce code expire dans <strong>1 heure</strong>.</p>
  <p>Si vous n'avez pas demandé cette réinitialisation, ignorez ce message.</p>
  <p style="color:#999;font-size:12px;margin-top:30px">Cet email a été envoyé automatiquement par Civique.</p>
</body>
</html>`);
}

export async function sendPasswordChangedEmail(email: string) {
  await sendEmail(email, 'Mot de passe modifié - Civique', `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#1A1A2E">
  <p>Bonjour,</p>
  <p>Votre mot de passe a été modifié avec succès.</p>
  <p>Si vous n'êtes pas à l'origine de ce changement, contactez-nous immédiatement à <a href="mailto:support@integrafle.fr">support@integrafle.fr</a>.</p>
  <p style="color:#999;font-size:12px;margin-top:30px">Cet email a été envoyé automatiquement par Civique.</p>
</body>
</html>`);
}
