import { ImageResponse } from 'next/og';

// Next.js 15 — dynamic Open Graph image for the landing page.
// File-based: serves at /opengraph-image and is referenced automatically in
// <meta property="og:image"> for the root route.

export const alt = 'Civique — Préparation à l\'examen civique français';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Tisserand palette
const AUBERGINE = '#2D1B2E';
const BONE = '#F4ECDD';
const TERRACOTTA = '#C75A3E';
const SAFFRON = '#E8B14A';

// Tricolor (French flag — bottom accent bar)
const BLEU = '#0055A4';
const BLANC = '#FFFFFF';
const ROUGE = '#EF4135';

export default async function OpengraphImage() {
  // We deliberately do NOT load remote fonts here: a transient network
  // failure or a full disk (e.g. when building offline) would crash the
  // image generation. System serif/sans fallbacks render acceptably in
  // og previews and we keep the route bulletproof.
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: AUBERGINE,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          padding: '80px 120px',
          fontFamily: '"Times New Roman", Georgia, serif',
        }}
      >
        {/* Subtle texture: large translucent blob top-right */}
        <div
          style={{
            position: 'absolute',
            top: -180,
            right: -180,
            width: 520,
            height: 520,
            borderRadius: '50%',
            background: TERRACOTTA,
            opacity: 0.15,
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -120,
            left: -120,
            width: 360,
            height: 360,
            borderRadius: '50%',
            background: SAFFRON,
            opacity: 0.12,
            display: 'flex',
          }}
        />

        {/* Eyebrow */}
        <div
          style={{
            color: SAFFRON,
            fontSize: 28,
            letterSpacing: 6,
            textTransform: 'uppercase',
            marginBottom: 24,
            fontWeight: 600,
            display: 'flex',
          }}
        >
          — Civique
        </div>

        {/* Wordmark — large serif */}
        <div
          style={{
            fontSize: 220,
            color: BONE,
            lineHeight: 1,
            fontWeight: 500,
            letterSpacing: -6,
            marginBottom: 28,
            display: 'flex',
          }}
        >
          Civique
        </div>

        {/* Italic subtitle in terracotta */}
        <div
          style={{
            fontSize: 44,
            color: TERRACOTTA,
            fontStyle: 'italic',
            textAlign: 'center',
            maxWidth: 900,
            lineHeight: 1.2,
            marginBottom: 56,
            display: 'flex',
          }}
        >
          Préparation à l'examen civique français
        </div>

        {/* Three pills */}
        <div
          style={{
            display: 'flex',
            gap: 20,
            marginBottom: 16,
          }}
        >
          {['CSP', 'CR', 'NAT'].map((label) => (
            <div
              key={label}
              style={{
                padding: '14px 32px',
                borderRadius: 999,
                border: `2px solid ${BONE}`,
                color: BONE,
                fontSize: 28,
                fontWeight: 600,
                fontFamily: 'Helvetica, Arial, sans-serif',
                letterSpacing: 2,
                display: 'flex',
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Tricolor bar at the bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 12,
            display: 'flex',
          }}
        >
          <div style={{ flex: 1, background: BLEU }} />
          <div style={{ flex: 1, background: BLANC }} />
          <div style={{ flex: 1, background: ROUGE }} />
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
