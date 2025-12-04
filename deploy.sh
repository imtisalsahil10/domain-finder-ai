# ...existing code...
#!/usr/bin/env bash
set -euo pipefail

# Work from the script directory (repo root)
cd "$(dirname "$0")"
REPO_DIR="$(pwd)"
echo "Deploy: updating repo in $REPO_DIR"

# Ensure latest from remote for current branch
git fetch --all --prune
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "Current branch: $CURRENT_BRANCH"
git reset --hard "origin/$CURRENT_BRANCH"

# Install dependencies (prefer npm ci when lockfile present)
if [ -f package-lock.json ]; then
  echo "Installing dependencies with: npm ci"
  npm ci
else
  echo "Installing dependencies with: npm install"
  npm install
fi

# Build production (Vite)
export NODE_ENV=production
echo "Running production build: npm run build"
npm run build

echo "Production build finished. Output directory: $(pwd)/dist"
# ...existing code...