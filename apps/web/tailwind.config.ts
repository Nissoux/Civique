import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Tisserand palette — warm welcoming
        bone: 'rgb(var(--bone) / <alpha-value>)',
        'bone-deep': 'rgb(var(--bone-deep) / <alpha-value>)',
        'bone-warm': 'rgb(var(--bone-warm) / <alpha-value>)',
        aubergine: 'rgb(var(--aubergine) / <alpha-value>)',
        'aubergine-mid': 'rgb(var(--aubergine-mid) / <alpha-value>)',
        ink: 'rgb(var(--aubergine) / <alpha-value>)', // alias
        'ink-mute': 'rgb(var(--ink-mute) / <alpha-value>)',
        'ink-faded': 'rgb(var(--ink-faded) / <alpha-value>)',

        // Brand officiel République Française
        'fr-blue': 'rgb(var(--fr-blue) / <alpha-value>)',
        'fr-red': 'rgb(var(--fr-red) / <alpha-value>)',
        'fr-gold': '#FFD700',

        // Accents Tisserand
        terracotta: 'rgb(var(--terracotta) / <alpha-value>)',
        'terracotta-deep': 'rgb(var(--terracotta-deep) / <alpha-value>)',
        saffron: 'rgb(var(--saffron) / <alpha-value>)',
        teal: 'rgb(var(--teal) / <alpha-value>)',
        sienna: 'rgb(var(--sienna) / <alpha-value>)',
        indigo: 'rgb(var(--indigo) / <alpha-value>)',

        // Theme colors (matching mobile + on warm bg)
        'theme-1': '#002395',
        'theme-2': '#ED2939',
        'theme-3': '#D4A017',
        'theme-4': '#4A90D9',
        'theme-5': '#2ECC71',

        // Legacy tokens (mapped to Tisserand) — keep existing components working
        background: 'rgb(var(--bone) / <alpha-value>)',
        surface: 'rgb(var(--bone-deep) / <alpha-value>)',
        'surface-elevated': 'rgb(var(--bone) / <alpha-value>)',
        card: 'rgb(var(--bone) / <alpha-value>)',
        'text-primary': 'rgb(var(--aubergine) / <alpha-value>)',
        'text-secondary': 'rgb(var(--ink-mute) / <alpha-value>)',
        'text-tertiary': 'rgb(var(--ink-faded) / <alpha-value>)',
        'text-inverse': 'rgb(var(--bone) / <alpha-value>)',
        primary: 'rgb(var(--fr-blue) / <alpha-value>)',
        'primary-light': 'rgb(var(--bone-warm) / <alpha-value>)',
        secondary: 'rgb(var(--fr-red) / <alpha-value>)',
        accent: 'rgb(var(--terracotta) / <alpha-value>)',
        success: '#2ECC71',
        'success-bg': 'rgb(225 235 220)',
        error: 'rgb(var(--fr-red) / <alpha-value>)',
        'error-bg': 'rgb(248 226 226)',
        warning: 'rgb(var(--saffron) / <alpha-value>)',
        'warning-bg': 'rgb(248 235 210)',
        border: 'rgb(var(--aubergine) / 0.14)',
        divider: 'rgb(var(--aubergine) / 0.10)',
        'input-bg': 'rgb(var(--bone-deep) / <alpha-value>)',
        'progress-bg': 'rgb(var(--bone-warm) / <alpha-value>)',
      },
      fontFamily: {
        display: ['var(--font-newsreader)', 'Georgia', 'serif'],
        sans: ['var(--font-karla)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '12px',
        md: '16px',
        lg: '22px',
        xl: '28px',
        '2xl': '32px',
        '3xl': '40px',
      },
      boxShadow: {
        // Tisserand "stamped paper" shadow — solid offset + soft glow
        clay: '0 3px 0 rgb(var(--aubergine)), 0 8px 24px -8px rgba(45, 27, 46, 0.12)',
        'clay-lg': '0 6px 0 rgb(var(--aubergine)), 0 18px 32px -12px rgba(45, 27, 46, 0.18)',
        'clay-xl': '0 8px 0 rgb(var(--aubergine)), 0 24px 48px -16px rgba(45, 27, 46, 0.22)',
        warm: '0 4px 0 rgb(var(--aubergine-mid)), 0 8px 24px -8px rgba(199, 82, 42, 0.30)',
        'warm-lift': '0 6px 0 rgb(var(--aubergine-mid)), 0 12px 32px -8px rgba(199, 82, 42, 0.40)',
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #002395 0%, #001A6E 100%)',
        'gradient-warm':
          'linear-gradient(135deg, rgb(199 82 42) 0%, rgb(232 163 61) 100%)',
      },
      animation: {
        rise: 'rise 0.85s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
        weave: 'weave 2.4s 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        float: 'float 5s ease-in-out infinite',
        'scroll-strip': 'scroll-strip 32s linear infinite',
      },
      keyframes: {
        rise: {
          from: { opacity: '0', transform: 'translateY(0.8em)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        weave: {
          to: { strokeDashoffset: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'scroll-strip': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
