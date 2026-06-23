#!/bin/sh
# One-time developer setup: enable the repo's shared git hooks.
# Idempotent — safe to re-run.
set -e
cd "$(dirname "$0")"

git config core.hooksPath .githooks
echo "Enabled shared git hooks (core.hooksPath=.githooks)."
