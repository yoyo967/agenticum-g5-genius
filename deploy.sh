#!/bin/bash
set -e

# ==============================================================================
# 🛰️ AGENTICUM G5 - FULL STACK LOCAL DEPLOYMENT SCRIPT 
# ==============================================================================
# This script automates the deployment of the entire Agenticum G5 ecosystem 
# to Google Cloud Run (Node.js + Python) and Firebase Hosting (Frontend),
# satisfying the "Automation Script" requirement for Hackathon Bonus Points (+0.2).
# ==============================================================================

# Variables (Customize these if deploying to a different GCP Project)
PROJECT_ID="online-marketing-manager"
REGION="europe-west1"
NODE_IMAGE="europe-west1-docker.pkg.dev/$PROJECT_ID/cloud-run-source-deploy/genius-backend"
PYTHON_IMAGE="europe-west1-docker.pkg.dev/$PROJECT_ID/cloud-run-source-deploy/agenticum-g5-backend"

echo "🚀 INITIATING AGENTICUM G5 FULL PLATFORM DEPLOYMENT..."
echo "Target Project: $PROJECT_ID | Region: $REGION"
echo "----------------------------------------------------------------------"

# 1️⃣ DEPLOY NODE.JS ORCHESTRATOR FRONT-API (genius-backend)
echo "📦 1/3: Building and Deploying Node.js Target (genius-backend)..."
gcloud builds submit backend/ --tag=$NODE_IMAGE --project=$PROJECT_ID
gcloud run deploy genius-backend \
  --image=$NODE_IMAGE \
  --region=$REGION \
  --project=$PROJECT_ID \
  --platform=managed \
  --allow-unauthenticated \
  --set-secrets=GEMINI_API_KEY=GEMINI_API_KEY:latest \
  --set-env-vars=BACKEND_URL=https://genius-backend-697051612685.europe-west1.run.app,ENGINE_URL=https://agenticum-g5-backend-697051612685.europe-west1.run.app

echo "✅ Node.js Orchestrator Deployed Successfully."
echo "----------------------------------------------------------------------"

# 2️⃣ DEPLOY PYTHON INTELLIGENCE ENGINE (agenticum-g5-backend)
echo "🧠 2/3: Building and Deploying Python Engine (agenticum-g5-backend)..."
gcloud builds submit engine/ --tag=$PYTHON_IMAGE --project=$PROJECT_ID
gcloud run deploy agenticum-g5-backend \
  --image=$PYTHON_IMAGE \
  --region=$REGION \
  --project=$PROJECT_ID \
  --platform=managed \
  --allow-unauthenticated \
  --memory=4Gi \
  --cpu=2 \
  --timeout=300 \
  --set-secrets=GEMINI_API_KEY=GEMINI_API_KEY:latest,BROWSERBASE_API_KEY=BROWSERBASE_API_KEY:latest \
  --set-env-vars=BACKEND_URL=https://genius-backend-697051612685.europe-west1.run.app,BA07_HEADLESS=true,BA07_SCREEN_WIDTH=1280,BA07_SCREEN_HEIGHT=936

echo "✅ Python Intelligence Engine Deployed Successfully."
echo "----------------------------------------------------------------------"

# 3️⃣ DEPLOY THE NEURAL OS FRONTEND (Firebase Hosting)
echo "🌐 3/3: Building and Deploying React OS Frontend..."
cd landing

# Ensure clean build
echo "Running Vite Production Build..."
npm run build

echo "Pushing static assets to Firebase Hosting..."
firebase deploy --only hosting --project $PROJECT_ID

cd ..

echo "----------------------------------------------------------------------"
echo "🎉 DEPLOYMENT COMPLETE & OPERATIONAL."
echo "🌍 Live OS Portal: https://${PROJECT_ID}.web.app"
echo "======================================================================"
exit 0
