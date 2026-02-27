#!/bin/bash
set -e

echo "=================================================="
echo "    AGENTICUM G5 - STRICT PROVENANCE DEPLOYMENT   "
echo "=================================================="

# 1. Enforce Clean Working Tree (Gate 1)
if [[ -n $(git status -s) ]]; then
  echo "❌ ERROR: Working tree is dirty. Deploy aborted."
  echo "You must commit all changes (git add/commit) to generate a valid Deployment SHA."
  exit 1
fi

export VITE_BUILD_SHA=$(git rev-parse --short HEAD)
echo "✅ Git Provenance Verified: SHA [$VITE_BUILD_SHA]"

# 2. Re-compile Frontend with the exact Git SHA
echo "=================================================="
echo "    COMPILING FRONTEND WITH PROVENANCE TAG        "
echo "=================================================="
cd landing
npm run build
cd ..

# 3. Compile Backend
echo "=================================================="
echo "    COMPILING BACKEND                             "
echo "=================================================="
cd backend
npm run build
cd ..

# 4. Push to Firebase Hosting & Rules
echo "=================================================="
echo "    DEPLOYING TO FIREBASE                         "
echo "=================================================="
npx firebase-tools deploy --only "hosting,firestore:rules" --project online-marketing-manager

echo "=================================================="
echo "✅ DEPLOY COMPLETE FOR COMMIT: $VITE_BUILD_SHA"
echo "=================================================="
