const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

interface SendEmailParams {
  to: string;
  toName?: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, toName, subject, html }: SendEmailParams): Promise<boolean> {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || 'support@integrafle.fr';

  if (!apiKey) {
    console.warn('[Email] BREVO_API_KEY not set, skipping email');
    return false;
  }

  try {
    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: 'Civique', email: senderEmail },
        to: [{ email: to, name: toName || to }],
        subject,
        htmlContent: html,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('[Email] Brevo error:', response.status, err);
      return false;
    }

    return true;
  } catch (err) {
    console.error('[Email] Send failed:', err);
    return false;
  }
}

export function welcomeEmailHtml(displayName: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #F5F5F5;">
  <div style="background: #002395; padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Bienvenue sur Civique !</h1>
  </div>
  <div style="background: white; padding: 30px; border-radius: 0 0 16px 16px;">
    <p style="font-size: 16px; color: #333;">Bonjour <strong>${displayName}</strong>,</p>
    <p style="font-size: 16px; color: #333; line-height: 1.6;">
      Votre compte Civique a bien été créé. Vous êtes prêt(e) à commencer votre préparation à l'examen civique français.
    </p>
    <p style="font-size: 16px; color: #333; line-height: 1.6;">Avec Civique, vous avez accès à :</p>
    <ul style="font-size: 15px; color: #555; line-height: 1.8;">
      <li><strong>611 questions</strong> de connaissances et mises en situation</li>
      <li><strong>Examens blancs</strong> en conditions réelles (40 questions, 45 min)</li>
      <li><strong>6 langues</strong> de traduction disponibles</li>
      <li><strong>Fiches mémo</strong> et <strong>glossaire civique</strong></li>
    </ul>
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://integrafle.fr" style="background: #002395; color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 16px;">
        Commencer à réviser
      </a>
    </div>
    <p style="font-size: 14px; color: #888; text-align: center;">
      Bonne préparation !<br>L'équipe Civique — IntegraFLE
    </p>
  </div>
  <p style="font-size: 12px; color: #AAA; text-align: center; margin-top: 20px;">
    Cet email a été envoyé par Civique (IntegraFLE).
    <a href="https://api.integrafle.fr/legal/privacy" style="color: #AAA;">Politique de confidentialité</a>
  </p>
</body>
</html>`;
}

export function verificationEmailHtml(displayName: string, code: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #F5F5F5;">
  <div style="background: #002395; padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 24px;">Vérifiez votre adresse email</h1>
  </div>
  <div style="background: white; padding: 30px; border-radius: 0 0 16px 16px; text-align: center;">
    <p style="font-size: 16px; color: #333;">Bonjour <strong>${displayName}</strong>,</p>
    <p style="font-size: 16px; color: #333; line-height: 1.6;">
      Voici votre code de vérification :
    </p>
    <div style="background: #F0F0F0; border-radius: 12px; padding: 20px; margin: 20px 0;">
      <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #002395;">${code}</span>
    </div>
    <p style="font-size: 14px; color: #888;">
      Ce code expire dans 15 minutes.<br>
      Si vous n'avez pas créé de compte, ignorez cet email.
    </p>
  </div>
</body>
</html>`;
}
