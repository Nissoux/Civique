'use client';

// global-error catches errors thrown in the root layout itself. It MUST
// define <html> and <body> because it replaces the entire React tree on
// failure. We deliberately keep this file dependency-free (no Tailwind
// classes that need a stylesheet load, no Context-using components) so
// that even if the design system fails to mount, the error page still
// renders during static prerender of /500.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fr">
      <body
        style={{
          fontFamily: 'Georgia, "Times New Roman", serif',
          background: '#F4ECDD',
          color: '#2D1B2E',
          margin: 0,
          padding: '4rem 1.5rem',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ maxWidth: 480, textAlign: 'center' }}>
          <p
            style={{
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#C7522A',
              marginBottom: '1rem',
            }}
          >
            — Erreur 500
          </p>
          <h1
            style={{
              fontSize: '3rem',
              lineHeight: 1.05,
              fontWeight: 500,
              margin: '0 0 1.5rem',
            }}
          >
            Une erreur{' '}
            <em style={{ fontStyle: 'italic', color: '#C7522A' }}>inattendue</em>.
          </h1>
          <p style={{ color: '#6E5B5F', lineHeight: 1.6, marginBottom: '2rem' }}>
            Le serveur a rencontré un problème. Réessayez dans un instant ou
            revenez à l'accueil.
          </p>
          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <button
              type="button"
              onClick={reset}
              style={{
                background: '#C7522A',
                color: '#F4ECDD',
                border: 'none',
                borderRadius: 999,
                padding: '0.85rem 1.75rem',
                fontWeight: 600,
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 3px 0 #2D1B2E',
              }}
            >
              Réessayer
            </button>
            <a
              href="/"
              style={{
                background: 'transparent',
                color: '#2D1B2E',
                border: '1.5px solid #2D1B2E',
                borderRadius: 999,
                padding: '0.85rem 1.75rem',
                fontWeight: 600,
                fontSize: '1rem',
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              Accueil
            </a>
          </div>
          {error?.digest ? (
            <p
              style={{
                marginTop: '2rem',
                color: '#9C8982',
                fontSize: '0.75rem',
                fontFamily: 'monospace',
              }}
            >
              Réf. : {error.digest}
            </p>
          ) : null}
        </div>
      </body>
    </html>
  );
}
