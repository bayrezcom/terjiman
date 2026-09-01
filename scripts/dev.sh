#!/usr/bin/env bash
#
# Starts the backend and the app together, for looking at Terjiman on your own
# machine. Ctrl+C stops both.
#
#   ./scripts/dev.sh              translations return "[mock] …", no API key needed
#   AI_API_KEY=sk-... ./scripts/dev.sh    real translations
#
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$root"

say() { printf '\033[36m▸\033[0m %s\n' "$1"; }
die() { printf '\033[31m✗\033[0m %s\n' "$1" >&2; exit 1; }

command -v node >/dev/null 2>&1 || die "Node.js is not installed. On a Mac: brew install node"

major="$(node -p 'process.versions.node.split(".")[0]')"
[ "$major" -ge 20 ] || die "Node 20 or newer is required; this is $(node -v). On a Mac: brew install node"

# Without a key the mock provider answers, so the whole app can be exercised
# offline — every screen, every state, just with placeholder translation text.
if [ -n "${AI_API_KEY:-}" ]; then
  provider="${AI_PROVIDER:-openai}"
  say "Using the $provider provider with your API key."
else
  provider="mock"
  say "No AI_API_KEY set — starting in mock mode. Translations come back as \"[mock] …\"."
  say "For real translations: AI_API_KEY=sk-... ./scripts/dev.sh"
fi

pids=""
cleanup() {
  printf '\n'
  say "Stopping."
  # shellcheck disable=SC2086
  [ -n "$pids" ] && kill $pids 2>/dev/null || true
  wait 2>/dev/null || true
}
trap cleanup INT TERM EXIT

say "Installing backend dependencies…"
(cd backend && npm install --silent)

say "Starting the backend on http://localhost:3000"
(cd backend && AI_PROVIDER="$provider" AI_API_KEY="${AI_API_KEY:-}" PORT=3000 LOG_LEVEL=warn npm run dev) &
pids="$pids $!"

# Wait for the backend to answer before starting the app, so the first screen
# does not open against a port that is not listening yet.
say "Waiting for the backend…"
for _ in $(seq 1 40); do
  if curl -sf http://localhost:3000/api/health >/dev/null 2>&1; then
    say "Backend is up."
    break
  fi
  sleep 1
done

curl -sf http://localhost:3000/api/health >/dev/null 2>&1 \
  || die "The backend did not start. Run 'cd backend && npm run dev' on its own to see why."

say "Installing app dependencies… (first run takes a few minutes)"
(cd mobile && npm install --silent)

say "Starting the app — your browser will open at http://localhost:8081"
printf '\n\033[1mThe app opens in the browser. Voice input, speech and vibration are\n'
printf 'device features and stay unavailable there; everything else works.\033[0m\n\n'
(cd mobile && npm run web) &
pids="$pids $!"

wait
