#!/usr/bin/env bash
# Tuhfat Al-Ilm Academy - Persistent Git Synchronization Engine
# Automatically initializes git if stripped by container restarts,
# sets up credentials, stages changes, and pushes to GitHub.

set -e

REPO_URL="https://github.com/AneesAttari/Tuhfat-Al-Ilm-Academy-.git"
GITHUB_USER="AneesAttari"
GITHUB_EMAIL="aneesattari67@gmail.com"
GITHUB_TOKEN="${GITHUB_TOKEN:-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}"

echo "=== Tuhfat Al-Ilm Git Sync Engine ==="

# 1. Ensure git repository is initialized
if [ ! -d ".git" ]; then
  echo "Initializing git repository..."
  git init -b main
  git remote add origin "$REPO_URL" 2>/dev/null || git remote set-url origin "$REPO_URL"
fi

# 2. Configure user identity
git config user.name "$GITHUB_USER"
git config user.email "$GITHUB_EMAIL"

# 3. Configure credentials persistence
echo "https://${GITHUB_USER}:${GITHUB_TOKEN}@github.com" > ~/.git-credentials
chmod 600 ~/.git-credentials
git config --global credential.helper store

# 4. Fetch latest refs from remote
echo "Fetching remote refs from GitHub..."
git fetch origin main master Domain || true

# 5. Ensure tracking branch is main
git branch -M main

# If HEAD is detached or has no commits, reset to origin/main
if ! git rev-parse --verify HEAD >/dev/null 2>&1; then
  echo "Attaching HEAD to origin/main..."
  git reset origin/main
fi

# 6. Stage all changes
git add -A

# 7. Check if there are changes to commit
if ! git diff-index --quiet HEAD --; then
  COMMIT_MSG="${1:-feat: sync latest changes and verified fixes}"
  echo "Committing changes: $COMMIT_MSG"
  git commit -m "$COMMIT_MSG"
else
  echo "Working tree is clean. No new changes to commit."
fi

# 8. Push to main, master, and Domain
echo "Pushing to GitHub (main, master, Domain)..."
git push origin main
git push origin main:master
git push origin main:Domain

echo "=== Git synchronization completed successfully! ==="
