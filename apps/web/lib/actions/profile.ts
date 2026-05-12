'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import type { Language } from '@civique/shared';
import { LANGUAGES } from '@civique/shared';
import { ApiError, fastifyFetch } from '@/lib/server/api';
import { getCurrentUser } from '@/lib/server/me';
import { setCurrentLang } from '@/lib/server/lang';
import { clearSessionCookies } from '@/lib/server/session';
import { clearCurrentExamType } from '@/lib/server/examType';
import type { FormState } from '@/lib/auth-types';

const VALID_LANG_CODES = new Set<Language>(LANGUAGES.map((l) => l.code));

// Simple RFC-5322-ish email validation — same shape the API also enforces.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ── Update profile (display name + lang) ─────────────────

export async function updateProfileAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const displayNameRaw = formData.get('displayName');
  const preferredLangRaw = formData.get('preferredLang');
  const emailRaw = formData.get('email');

  const payload: {
    displayName?: string;
    preferredLang?: Language;
    email?: string;
  } = {};

  if (typeof displayNameRaw === 'string') {
    const trimmed = displayNameRaw.trim();
    if (trimmed.length === 0) {
      return { error: 'Le nom d’affichage ne peut pas être vide.' };
    }
    if (trimmed.length > 100) {
      return { error: 'Le nom d’affichage ne doit pas dépasser 100 caractères.' };
    }
    payload.displayName = trimmed;
  }

  if (typeof preferredLangRaw === 'string' && preferredLangRaw.length > 0) {
    if (!VALID_LANG_CODES.has(preferredLangRaw as Language)) {
      return { error: 'Langue non reconnue.' };
    }
    payload.preferredLang = preferredLangRaw as Language;
  }

  // Email: only forward to the API if it actually differs from the current one.
  let emailChanged = false;
  if (typeof emailRaw === 'string') {
    const normalized = emailRaw.trim().toLowerCase();
    if (normalized.length > 0) {
      if (!EMAIL_RE.test(normalized) || normalized.length > 254) {
        return { error: 'Adresse e-mail invalide.' };
      }
      const me = await getCurrentUser();
      const currentEmail = me?.email.trim().toLowerCase() ?? '';
      if (normalized !== currentEmail) {
        payload.email = normalized;
        emailChanged = true;
      }
    }
  }

  if (Object.keys(payload).length === 0) {
    return { error: 'Aucune modification à enregistrer.' };
  }

  try {
    await fastifyFetch(
      '/auth/me',
      { method: 'PATCH', body: JSON.stringify(payload) },
      { auth: true },
    );
  } catch (err) {
    if (err instanceof ApiError) {
      // 409 → email collision. Surface a clear, actionable message.
      if (err.status === 409) {
        return { error: 'Cet email est déjà utilisé par un autre compte.' };
      }
      return { error: err.userMessage };
    }
    return { error: 'Impossible de mettre à jour votre profil.' };
  }

  // If the user changed the translation language from the profile form,
  // mirror that into the cookie so the sidebar picker and translated
  // content stay in sync without a full reload.
  if (payload.preferredLang) {
    try {
      await setCurrentLang(payload.preferredLang);
    } catch {
      // Cookie write is best-effort; the DB is the source of truth.
    }
  }

  revalidatePath('/app/profile');
  revalidatePath('/app');

  if (emailChanged) {
    return {
      message:
        'Email mis à jour. Vérifiez votre boîte de réception pour confirmer la nouvelle adresse.',
      emailChanged: true,
    };
  }
  return { message: 'Profil mis à jour.' };
}

// ── Change password ──────────────────────────────────────

export async function changePasswordAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const currentPassword = formData.get('currentPassword');
  const newPassword = formData.get('newPassword');
  const confirmPassword = formData.get('confirmPassword');

  if (typeof currentPassword !== 'string' || currentPassword.length === 0) {
    return { error: 'Mot de passe actuel requis.' };
  }
  if (typeof newPassword !== 'string' || newPassword.length < 8) {
    return { error: 'Le nouveau mot de passe doit contenir au moins 8 caractères.' };
  }
  if (typeof confirmPassword !== 'string' || newPassword !== confirmPassword) {
    return { error: 'Les nouveaux mots de passe ne correspondent pas.' };
  }
  if (newPassword === currentPassword) {
    return { error: 'Le nouveau mot de passe doit être différent de l’actuel.' };
  }

  try {
    await fastifyFetch(
      '/auth/change-password',
      {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword }),
      },
      { auth: true },
    );
  } catch (err) {
    if (err instanceof ApiError) {
      return { error: err.userMessage };
    }
    return { error: 'Impossible de modifier le mot de passe.' };
  }

  return { message: 'Votre mot de passe a été mis à jour.' };
}

// ── Delete account ───────────────────────────────────────

const DELETE_CONFIRM_PHRASE = 'SUPPRIMER';

export async function deleteAccountAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const confirm = formData.get('confirm');
  if (typeof confirm !== 'string' || confirm.trim() !== DELETE_CONFIRM_PHRASE) {
    return {
      error: `Veuillez saisir exactement « ${DELETE_CONFIRM_PHRASE} » pour confirmer.`,
    };
  }

  try {
    await fastifyFetch(
      '/auth/me',
      { method: 'DELETE' },
      { auth: true },
    );
  } catch (err) {
    if (err instanceof ApiError) {
      return { error: err.userMessage };
    }
    return { error: 'Impossible de supprimer le compte. Réessayez plus tard.' };
  }

  await clearSessionCookies();
  await clearCurrentExamType();
  redirect('/');
}
