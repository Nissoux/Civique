#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────────────────
#  Civique — Lightweight smoke test
#
#  Runs a series of HTTP probes against the public web app and the API.
#  No dependencies beyond curl + a POSIX shell. Intended to be runnable both
#  in CI (against civique.integrafle.fr / api.integrafle.fr) and locally (against the
#  dev server: pnpm --filter web dev + pnpm --filter server dev).
#
#  Usage:
#    bash infra/smoke-test.sh                                       # defaults
#    bash infra/smoke-test.sh http://localhost:3000                  # local web
#    bash infra/smoke-test.sh http://localhost:3000 http://localhost:4000/api
#
#  Environment overrides:
#    WEB_URL — base URL of the web app    (default: https://civique.integrafle.fr)
#    API_URL — base URL of the API + /api (default: https://api.integrafle.fr/api)
#    CURL_TIMEOUT — per-request timeout in seconds (default: 10)
#
#  Exit code: 0 if every test passes, 1 otherwise.
# ──────────────────────────────────────────────────────────────────────────────
set -euo pipefail

# ── Arguments / defaults ──────────────────────────────────────────────────────
WEB_URL="${1:-${WEB_URL:-https://civique.integrafle.fr}}"
API_URL="${2:-${API_URL:-https://api.integrafle.fr/api}}"
CURL_TIMEOUT="${CURL_TIMEOUT:-10}"

# Strip trailing slashes so concatenation always works
WEB_URL="${WEB_URL%/}"
API_URL="${API_URL%/}"

# ── Color helpers (only if stdout is a TTY) ───────────────────────────────────
if [[ -t 1 ]]; then
    GREEN=$'\033[0;32m'
    RED=$'\033[0;31m'
    YELLOW=$'\033[0;33m'
    BLUE=$'\033[0;34m'
    BOLD=$'\033[1m'
    RESET=$'\033[0m'
else
    GREEN=''
    RED=''
    YELLOW=''
    BLUE=''
    BOLD=''
    RESET=''
fi

# ── Counters ──────────────────────────────────────────────────────────────────
PASSED=0
FAILED=0
FAILED_TESTS=()

# ── Logging helpers ───────────────────────────────────────────────────────────
pass() {
    PASSED=$((PASSED + 1))
    printf '  %s✓%s %s\n' "$GREEN" "$RESET" "$1"
}

fail() {
    FAILED=$((FAILED + 1))
    FAILED_TESTS+=("$1")
    printf '  %s✗%s %s\n' "$RED" "$RESET" "$1"
    if [[ -n "${2:-}" ]]; then
        printf '    %s→ %s%s\n' "$YELLOW" "$2" "$RESET"
    fi
}

section() {
    printf '\n%s%s%s\n' "$BOLD" "$1" "$RESET"
}

# ── Probe helpers ─────────────────────────────────────────────────────────────
# Returns the HTTP status code only. curl's -w always emits "000" when the
# connection fails, so we don't need a fallback echo — that would double up.
# `|| true` keeps us friendly to `set -e` inside command substitution.
http_status() {
    local url="$1"
    curl -ks -o /dev/null -w '%{http_code}' --max-time "$CURL_TIMEOUT" "$url" 2>/dev/null || true
}

# Returns the response body only.
http_body() {
    local url="$1"
    curl -ks --max-time "$CURL_TIMEOUT" "$url" 2>/dev/null || true
}

# Returns "status|location" so redirect targets can be inspected.
http_status_and_location() {
    local url="$1"
    # -I would HEAD; some Next.js redirects only respond properly to GET.
    curl -ks -o /dev/null \
        -w '%{http_code}|%{redirect_url}' \
        --max-time "$CURL_TIMEOUT" "$url" 2>/dev/null || true
}

# ── Assertion helpers ─────────────────────────────────────────────────────────
expect_status() {
    local label="$1" url="$2" want="$3"
    local got
    got="$(http_status "$url")"
    if [[ "$got" == "$want" ]]; then
        pass "$label  [$got]"
    else
        fail "$label" "expected HTTP $want, got $got at $url"
    fi
}

expect_status_and_body_contains() {
    local label="$1" url="$2" want="$3" needle="$4"
    local got body
    got="$(http_status "$url")"
    body="$(http_body "$url")"
    if [[ "$got" != "$want" ]]; then
        fail "$label" "expected HTTP $want, got $got at $url"
        return
    fi
    if grep -qF -- "$needle" <<<"$body"; then
        pass "$label  [$got, body contains \"$needle\"]"
    else
        fail "$label" "body did not contain \"$needle\" (HTTP $got)"
    fi
}

expect_redirect_to() {
    local label="$1" url="$2" want_status="$3" want_path_substr="$4"
    local result status location
    result="$(http_status_and_location "$url")"
    status="${result%%|*}"
    location="${result#*|}"
    if [[ "$status" != "$want_status" ]]; then
        fail "$label" "expected HTTP $want_status, got $status at $url"
        return
    fi
    if [[ "$location" == *"$want_path_substr"* ]]; then
        pass "$label  [$status → $location]"
    else
        fail "$label" "Location did not contain \"$want_path_substr\" (was: $location)"
    fi
}

# Counts how many top-level entries an array has in JSON. Uses grep instead
# of jq to keep the dependency footprint zero. Works because each theme
# object contains an "id" field; counting "id" occurrences inside a 5-item
# array is a safe heuristic.
expect_json_array_size() {
    local label="$1" url="$2" want_status="$3" min_items="$4"
    local got body count
    got="$(http_status "$url")"
    body="$(http_body "$url")"
    if [[ "$got" != "$want_status" ]]; then
        fail "$label" "expected HTTP $want_status, got $got at $url"
        return
    fi
    # Quick JSON sanity check: must start with { or [
    if [[ ! "$body" =~ ^[[:space:]]*[\{\[] ]]; then
        fail "$label" "response did not look like JSON"
        return
    fi
    # Count top-level objects by counting unique "id" keys.
    count="$(grep -oE '"id"[[:space:]]*:' <<<"$body" | wc -l | tr -d ' ')"
    if (( count >= min_items )); then
        pass "$label  [$got, $count items detected]"
    else
        fail "$label" "expected at least $min_items items, found $count"
    fi
}

# ── Header ────────────────────────────────────────────────────────────────────
printf '%s%sCivique smoke test%s\n' "$BOLD" "$BLUE" "$RESET"
printf '  WEB_URL = %s\n' "$WEB_URL"
printf '  API_URL = %s\n' "$API_URL"
printf '  timeout = %ss per request\n' "$CURL_TIMEOUT"

# ── Test suite — public web ───────────────────────────────────────────────────
section "Public web — pages publiques"

expect_status_and_body_contains \
    "GET /  (landing)" \
    "${WEB_URL}/" 200 "Civique"

expect_status_and_body_contains \
    "GET /login" \
    "${WEB_URL}/login" 200 "Bon retour"

expect_status_and_body_contains \
    "GET /register" \
    "${WEB_URL}/register" 200 "Créez votre compte"

expect_status \
    "GET /privacy" \
    "${WEB_URL}/privacy" 200

expect_status \
    "GET /terms" \
    "${WEB_URL}/terms" 200

expect_status \
    "GET /mentions-legales" \
    "${WEB_URL}/mentions-legales" 200

# ── Test suite — SEO / discovery ──────────────────────────────────────────────
section "SEO / discovery"

expect_status \
    "GET /robots.txt" \
    "${WEB_URL}/robots.txt" 200

expect_status \
    "GET /sitemap.xml" \
    "${WEB_URL}/sitemap.xml" 200

# ── Test suite — error handling ───────────────────────────────────────────────
section "Error handling"

expect_status_and_body_contains \
    "GET /route-nexistante-test  (404 custom)" \
    "${WEB_URL}/route-nexistante-test" 404 "introuvable"

# ── Test suite — middleware redirects ─────────────────────────────────────────
section "Middleware & route handlers"

# /app is protected by middleware → 307 to /login when no session.
expect_redirect_to \
    "GET /app  (unauthenticated)" \
    "${WEB_URL}/app" 307 "/login"

# /api/auth/expire is a route handler that clears cookies then redirects.
# It points to /login?expired=1 in production; the only invariant we assert
# here is "a 307 redirect lands somewhere in the public area" — accept either
# / or /login as the target.
expire_result="$(http_status_and_location "${WEB_URL}/api/auth/expire")"
expire_status="${expire_result%%|*}"
expire_location="${expire_result#*|}"
if [[ "$expire_status" == "307" ]] && \
   { [[ "$expire_location" == *"/login"* ]] || [[ "$expire_location" == *"://"*/* && ! "$expire_location" == *"/app"* ]]; }; then
    pass "GET /api/auth/expire  [307 → ${expire_location}]"
else
    fail "GET /api/auth/expire" "expected 307 to a public page, got ${expire_status} → ${expire_location}"
fi

# ── Test suite — API ──────────────────────────────────────────────────────────
section "API — apps/server"

# /health is mounted at the server root (no /api prefix), so strip any trailing
# /api from API_URL before probing. Returns { status: "ok", timestamp: "..." }.
API_ROOT="${API_URL%/api}"
expect_status_and_body_contains \
    "GET /health  (server up)" \
    "${API_ROOT}/health" 200 '"status":"ok"'

# /questions/random requires auth (authGuard hook). 401 confirms the guard.
expect_status \
    "GET /questions/random?count=1  (auth-required)" \
    "${API_URL}/questions/random?count=1" 401

# ── Summary ───────────────────────────────────────────────────────────────────
TOTAL=$((PASSED + FAILED))
printf '\n%s───────────────────────────────────────────────%s\n' "$BOLD" "$RESET"
printf '%sSummary:%s %s%d passed%s · %s%d failed%s · %d total\n' \
    "$BOLD" "$RESET" \
    "$GREEN" "$PASSED" "$RESET" \
    "$RED" "$FAILED" "$RESET" \
    "$TOTAL"

if (( FAILED > 0 )); then
    printf '\n%sFailed tests:%s\n' "$RED" "$RESET"
    for t in "${FAILED_TESTS[@]}"; do
        printf '  · %s\n' "$t"
    done
    exit 1
fi

printf '%sAll smoke tests passed.%s\n' "$GREEN" "$RESET"
exit 0
