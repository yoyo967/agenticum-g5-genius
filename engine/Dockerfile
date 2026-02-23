FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for Playwright and GCP
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Install Playwright browsers (needed for SP-01 grounding)
RUN playwright install --with-deps chromium

# Copy the engine code into an 'engine' directory to support module imports
COPY . ./engine

# Create empty data directory to avoid errors if settings-service isn't mounted
RUN mkdir -p /app/backend/data

# Expose the Cloud Run port
EXPOSE 8080

# Environment variables
ENV PYTHONUNBUFFERED=1
ENV PORT=8080

# Run uvicorn from the root so 'from engine.main import ...' works
CMD ["uvicorn", "engine.main:app", "--host", "0.0.0.0", "--port", "8080"]
