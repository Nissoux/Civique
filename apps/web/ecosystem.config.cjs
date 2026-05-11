// PM2 config for the Civique web app.
// Run from the monorepo root on the production server:
//   pm2 start apps/web/ecosystem.config.cjs
//
// After the initial registration, redeploys only need:
//   pm2 restart civique-web
//
// CommonJS on purpose: PM2's config loader treats `.config.cjs` as
// CommonJS regardless of the package "type" of the surrounding package.
module.exports = {
  apps: [
    {
      name: 'civique-web',
      // Run pnpm from the monorepo root so workspace deps resolve.
      cwd: '/root/Civique',
      script: 'pnpm',
      args: '--filter web start',
      env: {
        NODE_ENV: 'production',
        // PORT is read by Next.js. The "start" script already passes
        // -p 3001, but PORT acts as belt-and-braces in case the script
        // changes.
        PORT: '3001',
        // The web reads this to know where to talk to the backend.
        // Falls back to https://api.integrafle.fr/api in lib/env.ts,
        // but it's safer to be explicit at the process level.
        NEXT_PUBLIC_API_BASE_URL: 'https://api.integrafle.fr/api',
      },
      instances: 1,
      autorestart: true,
      // Restart if the process climbs past ~600 MB. Next.js prod
      // typically idles at 150-300 MB; a leak would show up here.
      max_memory_restart: '600M',
      // Don't watch — we restart manually after deploy.
      watch: false,
      // PM2 logs land at ~/.pm2/logs/civique-web-{out,error}.log
      merge_logs: true,
      time: true,
    },
  ],
};
