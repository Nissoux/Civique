// PM2 config for the Civique web app.
//
// Strategy:
// - We rely on `output: 'standalone'` in next.config.ts, which produces a
//   self-contained server bundle at apps/web/.next/standalone/apps/web/server.js
//   plus a copy of the node_modules it needs.
// - PM2 runs that server.js directly with Node in fork mode (not cluster) —
//   no pnpm wrapper, no recursive run failure.
// - The static files (public/, .next/static) are NOT copied into the
//   standalone output by Next.js. The post-build script below copies them.
//
// Run from the monorepo root on the production server:
//   pm2 start apps/web/ecosystem.config.cjs
//   pm2 save
//
// After redeploys:
//   pm2 restart civique-web
//
// CommonJS on purpose: PM2's config loader treats `.config.cjs` as
// CommonJS regardless of the package "type" of the surrounding package.
module.exports = {
  apps: [
    {
      name: 'civique-web',
      // Standalone server bundle (Next.js 15 output: 'standalone')
      script: '/root/Civique/apps/web/.next/standalone/apps/web/server.js',
      // Important: run from the standalone subtree so Node resolves
      // node_modules and the Next.js runtime correctly.
      cwd: '/root/Civique/apps/web/.next/standalone',
      // fork mode (not cluster) — server.js binds the port itself.
      exec_mode: 'fork',
      instances: 1,
      // No interpreter args: use the system node directly.
      interpreter: 'node',
      env: {
        NODE_ENV: 'production',
        // 3001 is taken by the existing IntégraFLE Next.js app on the
        // same VPS. Use 3005 for civique-web. Nginx fronts both via
        // separate vhosts (civique.fr → 3005, integrafle.fr → 3001).
        PORT: '3005',
        HOSTNAME: '127.0.0.1',
        NEXT_PUBLIC_API_BASE_URL: 'https://api.integrafle.fr/api',
      },
      autorestart: true,
      // Restart if the process climbs past ~600 MB. Next.js prod
      // typically idles at 150-300 MB; a leak would show up here.
      max_memory_restart: '600M',
      // Don't watch files — we restart manually after deploy.
      watch: false,
      // Brief delay so PM2 doesn't infinite-loop a failing process.
      restart_delay: 2000,
      // Cap rapid restarts.
      max_restarts: 10,
      min_uptime: '10s',
      merge_logs: true,
      time: true,
    },
  ],
};
