#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
USER_LOGIN=$(gh api user -q .login)
REPO="rotta"
gh repo view "$USER_LOGIN/$REPO" >/dev/null 2>&1 || gh repo create "$REPO" --public --description "Rotta — desk acquisto auto Europa" --confirm
git checkout -B main
git remote remove origin 2>/dev/null || true
git remote add origin "https://github.com/$USER_LOGIN/$REPO.git"
git add -A
git -c user.email="${USER_LOGIN}@users.noreply.github.com" -c user.name="$USER_LOGIN" commit -m "Publish Rotta purchase desk with GitHub Pages" || true
git push -u origin main --force
gh api -X POST "repos/$USER_LOGIN/$REPO/pages" -f build_type=workflow || true
echo "FIXED_URL=https://$USER_LOGIN.github.io/rotta/"
