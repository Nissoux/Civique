'use server';

import { redirect } from 'next/navigation';
import { setCurrentExamType, type ExamTypeCode } from '@/lib/server/examType';

export async function selectExamTypeAction(code: ExamTypeCode): Promise<void> {
  if (code !== 'csp' && code !== 'cr' && code !== 'nat') {
    throw new Error('Invalid exam type');
  }
  await setCurrentExamType(code);
  redirect('/app');
}
