import type { NextConfig } from 'next';
import path from 'node:path';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@civique/shared'],
  // Pin workspace root to silence multi-lockfile warning in monorepo
  outputFileTracingRoot: path.join(__dirname, '../../'),
  // ESLint runs separately (CI / pre-commit). Don't block production builds
  // on it — the lint config in the repo references the Next.js plugin via
  // eslint-config-next which is sometimes flaky in monorepo CI.
  eslint: { ignoreDuringBuilds: true },
  env: {
    NEXT_PUBLIC_API_BASE_URL:
      process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://api.integrafle.fr/api',
  },
  async rewrites() {
    return [
      // Pretty URLs for static design exploration prototypes in /public.
      // Without these, Next.js doesn't auto-serve directory/index.html.
      { source: '/design-explorations', destination: '/design-explorations/index.html' },
      { source: '/design-explorations/atelier', destination: '/design-explorations/atelier/index.html' },
      { source: '/design-explorations/hexagone', destination: '/design-explorations/hexagone/index.html' },
      { source: '/design-explorations/tisserand', destination: '/design-explorations/tisserand/index.html' },
    ];
  },
};

export default nextConfig;
