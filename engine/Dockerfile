FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Install Playwright
RUN playwright install --with-deps chromium

# Copy the engine folder as a package
COPY . ./engine

# Expose port
EXPOSE 8080
ENV PORT=8080
ENV PYTHONUNBUFFERED=1

# Run as a module to handle imports correctly
CMD ["python", "-m", "engine.main"]
