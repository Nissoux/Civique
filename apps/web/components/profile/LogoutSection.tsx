'use client';

import { useFormStatus } from 'react-dom';
import { logoutAction } from '@/app/app/actions';

export function LogoutSection() {
  return (
    <form action={logoutAction}>
      <LogoutButton />
    </form>
  );
}

function LogoutButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="
        inline-flex items-center gap-2 rounded-full
        border-[1.5px] border-aubergine text-aubergine font-semibold
        px-5 py-2.5 text-sm transition-all
        hover:bg-aubergine hover:text-bone
        disabled:opacity-60 disabled:cursor-not-allowed
      "
    >
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
      {pending ? 'Déconnexion…' : 'Se déconnecter'}
    </button>
  );
}
