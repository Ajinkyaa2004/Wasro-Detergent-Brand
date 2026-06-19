#!/usr/bin/env bash
# Run the Wasro Selenium suite.
#
# Usage:
#   ./run.sh               # default: localhost:3000, headless
#   WASRO_HEADED=1 ./run.sh  # show browser windows
#   WASRO_BASE_URL=https://wasro.vercel.app ./run.sh  # against production
#   ./run.sh tests/test_05_admin.py  # single file
#
# Assumes the dev server is already running. If not, start it first:
#   (cd .. && npm run dev)

set -euo pipefail

cd "$(dirname "$0")"

# Use the local venv if it exists; otherwise system python3
if [[ -x ".venv/bin/python" ]]; then
  PY=".venv/bin/python"
else
  PY="python3"
fi

# Quick pre-flight: dev server reachable?
URL="${WASRO_BASE_URL:-http://localhost:3000}"
if ! curl -sI -m 3 "$URL" >/dev/null; then
  echo "[!] $URL is not reachable. Start the dev server first:" >&2
  echo "    (cd .. && npm run dev)" >&2
  exit 2
fi

echo "[+] Running pytest against $URL"
"$PY" -m pytest "$@"
