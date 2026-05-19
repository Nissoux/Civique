#!/usr/bin/env python3
"""
Idempotently patches the live Nginx vhost at
/etc/nginx/sites-available/civique.integrafle.fr to add:
  - Strict-Transport-Security (HSTS)
  - Content-Security-Policy (CSP)
  - proxy_hide_header X-Powered-By

Inserted right after the existing Permissions-Policy header so it sits
in the same security-headers block. Safe to re-run (no-op if already
patched).
"""
import re
import sys
from pathlib import Path

FILE = Path("/etc/nginx/sites-available/civique.integrafle.fr")
if not FILE.exists():
    sys.exit(f"Config not found at {FILE}")

content = FILE.read_text()
if "Strict-Transport-Security" in content:
    print("Already patched, skipping.")
    sys.exit(0)

# CSP is one long string — keep it on a single line so Nginx parses it
# without needing line continuations.
CSP = (
    "default-src 'self'; "
    "script-src 'self' 'unsafe-inline' https://accounts.google.com https://appleid.cdn-apple.com; "
    "style-src 'self' 'unsafe-inline'; "
    "img-src 'self' data: https:; "
    "font-src 'self' data:; "
    "connect-src 'self' https://api.integrafle.fr https://accounts.google.com; "
    "frame-src https://accounts.google.com https://appleid.apple.com; "
    "form-action 'self' https://checkout.stripe.com; "
    "base-uri 'self'; "
    "frame-ancestors 'none'; "
    "object-src 'none'"
)

INJECT = (
    '\n    # HSTS — force HTTPS 2y. Add `preload` only after hstspreload.org submission (irreversible).\n'
    '    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains" always;\n'
    '\n'
    f'    add_header Content-Security-Policy "{CSP}" always;\n'
    '\n'
    '    proxy_hide_header X-Powered-By;\n'
)

pattern = re.compile(
    r'(add_header Permissions-Policy "geolocation=\(\), microphone=\(\), camera=\(\)" always;\n)'
)
new, n = pattern.subn(r'\1' + INJECT, content, count=1)
if n != 1:
    sys.exit("Failed to locate Permissions-Policy anchor — manual edit required.")

FILE.write_text(new)
print("Patched OK.")
