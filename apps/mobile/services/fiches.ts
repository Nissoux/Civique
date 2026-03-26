import api from './api';
import type { Fiche } from '@civique/shared';
import type { Language } from '@civique/shared';

export async function getFiches(themeId?: number, lang?: Language): Promise<Fiche[]> {
  const params: Record<string, string | number> = {};
  if (themeId) params.themeId = themeId;
  if (lang) params.lang = lang;
  const { data } = await api.get('/fiches', { params });
  return data.data;
}

export async function getFiche(id: number, lang?: Language): Promise<Fiche> {
  const params: Record<string, string> = {};
  if (lang) params.lang = lang;
  const { data } = await api.get(`/fiches/${id}`, { params });
  return data.data;
}
