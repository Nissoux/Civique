import 'server-only';
import { cookies } from 'next/headers';
import type { ExamTypeCode } from '../examType.types';

export type { ExamTypeCode } from '../examType.types';
export {
  EXAM_TYPES,
  getExamTypeDefinition,
  type ExamTypeDefinition,
} from '../examType.types';

const COOKIE_KEY = 'civique_exam_type';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export async function getCurrentExamType(): Promise<ExamTypeCode | null> {
  const c = await cookies();
  const raw = c.get(COOKIE_KEY)?.value;
  if (raw === 'csp' || raw === 'cr' || raw === 'nat') return raw;
  return null;
}

export async function setCurrentExamType(code: ExamTypeCode): Promise<void> {
  const c = await cookies();
  c.set(COOKIE_KEY, code, {
    httpOnly: false,
    sameSite: 'lax',
    path: '/',
    maxAge: COOKIE_MAX_AGE,
    secure: process.env.NODE_ENV === 'production',
  });
}

export async function clearCurrentExamType(): Promise<void> {
  const c = await cookies();
  c.delete(COOKIE_KEY);
}
