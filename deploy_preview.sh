#!/bin/bash
set -e

echo "=================================================="
echo "    AGENTICUM G5 - PREVIEW CHANNEL DEPLOYMENT     "
echo "=================================================="

# 1. Enforce Clean Working Tree
if [[ -n $(git status -s) ]]; then
  echo "❌ ERROR: Working tree is dirty. Deploy aborted."
  echo "You must commit all changes to generate a valid Preview SHA."
  exit 1
fi

export VITE_BUILD_SHA=$(git rev-parse --short HEAD)
# Use branch name for friendly URL routing if possible
BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD | sed -e 's/[^a-zA-Z0-9-]/-/g')
CHANNEL_ID="pr-$BRANCH_NAME-$VITE_BUILD_SHA"

echo "✅ Git Provenance Verified: SHA [$VITE_BUILD_SHA]"
echo "🌐 Target Channel: $CHANNEL_ID"

# 2. Re-compile Frontend
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

# 4. Push to Firebase Hosting Channel
echo "=================================================="
echo "    DEPLOYING TO FIREBASE PREVIEW CHANNEL         "
echo "=================================================="
# Note: Rules deployment is separate to avoid polluting prod rules from a dirty branch,
# though emulator tests should catch regressions.
npx firebase-tools hosting:channel:deploy $CHANNEL_ID --expires 7d --project online-marketing-manager

echo "=================================================="
echo "✅ PREVIEW DEPLOY COMPLETE FOR COMMIT: $VITE_BUILD_SHA"
echo "=================================================="
echo ""
echo "🔥 PROMOTION TO PRODUCTION: If this preview is flawless, DO NOT DEPLOY AGAIN."
echo "Execute the following byte-for-byte binary clone to promote directly to Live:"
echo ""
echo "    npx firebase-tools hosting:clone online-marketing-manager:$CHANNEL_ID online-marketing-manager:live"
echo "    npx firebase-tools deploy --only firestore:rules --project online-marketing-manager"
echo ""
echo "=================================================="
