# Dockerfile — Agenticum G5 Backend + BA-07 Chromium Layer
FROM python:3.11-slim

# === System Dependencies für Playwright/Chromium ===
RUN apt-get update && apt-get install -y \
    # Chromium Core
    chromium \
    chromium-driver \
    # Playwright System Deps
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    # Build Tools
    curl \
    wget \
    gnupg \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# === Python Dependencies ===
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# === Playwright Chromium Installation ===
# WICHTIG: Nach pip install playwright, VOR COPY . .
RUN playwright install-deps chromium && playwright install chromium

# === Application Code ===
COPY . ./engine

# === Cloud Run: Port 8080 zwingend ===
EXPOSE 8080

# === Startup ===
# BA07_HEADLESS=true ist mandatory für Cloud Run (kein Display)
ENV BA07_HEADLESS=true
ENV BA07_SCREEN_WIDTH=1280
ENV BA07_SCREEN_HEIGHT=936
ENV PORT=8080
ENV PYTHONUNBUFFERED=1

CMD ["python", "-m", "engine.main"]
