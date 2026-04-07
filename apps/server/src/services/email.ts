import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

const FROM_EMAIL = 'noreply@integrafle.fr';
const FROM_NAME = 'Civique';

function getTransporter() {
  const smtpKey = env.BREVO_SMTP_KEY;
  const smtpLogin = env.BREVO_SMTP_LOGIN;
  if (!smtpKey || !smtpLogin) {
    console.error('BREVO_SMTP_KEY or BREVO_SMTP_LOGIN not set — emails will not be sent');
    return null;
  }
  return nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
      user: smtpLogin,
      pass: smtpKey,
    },
  });
}

export async function sendWelcomeEmail(email: string, displayName: string) {
  try {
    const transporter = getTransporter();
    if (!transporter) return;
    await transporter.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to: email,
      subject: 'Bienvenue sur Civique !',
      html: `
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
    Si vous n'avez pas créé de compte, ignorez ce message.
  </p>
</body>
</html>`,
    });
  } catch (err) {
    console.error('Failed to send welcome email:', err);
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `https://api.integrafle.fr/reset-password?token=${token}`;

  try {
    const transporter = getTransporter();
    if (!transporter) return;
    await transporter.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to: email,
      subject: 'Réinitialisation de votre mot de passe - Civique',
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#1A1A2E">
  <div style="text-align:center;padding:30px 0">
    <h1 style="color:#2563EB;font-size:24px;margin:0">Réinitialisation du mot de passe</h1>
  </div>
  <p>Bonjour,</p>
  <p>Vous avez demandé la réinitialisation de votre mot de passe. Utilisez le code ci-dessous dans l'application :</p>
  <div style="background:#EFF6FF;border-radius:16px;padding:24px;margin:20px 0;text-align:center">
    <p style="font-size:32px;font-weight:bold;color:#2563EB;letter-spacing:4px;margin:0">${token.substring(0, 8).toUpperCase()}</p>
  </div>
  <p>Ce code expire dans <strong>1 heure</strong>.</p>
  <p>Si vous n'avez pas demandé cette réinitialisation, ignorez ce message.</p>
  <p style="color:#999;font-size:12px;margin-top:30px">
    Cet email a été envoyé automatiquement par Civique.
  </p>
</body>
</html>`,
    });
  } catch (err) {
    console.error('Failed to send password reset email:', err);
  }
}

export async function sendPasswordChangedEmail(email: string) {
  try {
    const transporter = getTransporter();
    if (!transporter) return;
    await transporter.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to: email,
      subject: 'Mot de passe modifié - Civique',
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#1A1A2E">
  <p>Bonjour,</p>
  <p>Votre mot de passe a été modifié avec succès.</p>
  <p>Si vous n'êtes pas à l'origine de ce changement, contactez-nous immédiatement à <a href="mailto:support@integrafle.fr">support@integrafle.fr</a>.</p>
  <p style="color:#999;font-size:12px;margin-top:30px">Cet email a été envoyé automatiquement par Civique.</p>
</body>
</html>`,
    });
  } catch (err) {
    console.error('Failed to send password changed email:', err);
  }
}
