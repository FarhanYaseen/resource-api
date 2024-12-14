#!/bin/bash

# Ensure script stops on error
set -e

# Configuration
COMPOSE_PROJECT_NAME="rest-api-oppizi"
ENV_FILE=".env"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Function to log messages
log() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

# Function to log errors
error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    error "Docker is not running. Please start Docker and try again."
fi

# Check if .env file exists
if [ ! -f "$ENV_FILE" ]; then
    error ".env file not found. Please create one from .env.example"
fi

# Stop and remove existing containers
log "Stopping any existing containers..."
docker-compose down

# Build and start services
log "Building and starting services..."
docker-compose up --build -d || error "Failed to build and start services"

# Wait for database to be ready
log "Waiting for database to be ready..."
sleep 10

# Check if containers are running
if ! docker-compose ps | grep -q "Up"; then
    error "Containers failed to start properly"
fi

log "Checking API health..."
HEALTH_CHECK_URL="http://localhost:${PORT:-3000}/health"
MAX_RETRIES=6
RETRY_COUNT=0

until curl -s -f "$HEALTH_CHECK_URL" > /dev/null || [ $RETRY_COUNT -eq $MAX_RETRIES ]; do
    log "Waiting for API to be ready... ($(( MAX_RETRIES - RETRY_COUNT )) attempts remaining)"
    sleep 5
    RETRY_COUNT=$((RETRY_COUNT + 1))
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    error "API failed to become ready in time"
fi

log "Services are up and running!"
log "API is available at http://localhost:${PORT:-3000}"
log "Database is available at localhost:${DB_PORT:-5432}"
log ""
log "You can check logs with: docker-compose logs -f"
log "To stop services run: docker-compose down"