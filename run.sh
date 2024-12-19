#!/bin/bash

set -e

COMPOSE_PROJECT_NAME="resource-api"
ENV_FILE=".env"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

if ! docker info > /dev/null 2>&1; then
    error "Docker is not running. Please start Docker and try again."
fi

if [ ! -f "$ENV_FILE" ]; then
    error ".env file not found. Please create one from .env.example"
fi

log "Stopping any existing containers..."
docker-compose down

log "Building and starting services..."
docker-compose up -d --build --force-recreate || error "Failed to build and start services"

log "Waiting for database to be ready..."
docker-compose ps | grep -q "db" || error "Database service is not running"

log "Waiting for the API to be ready..."
HEALTH_CHECK_URL="http://localhost:${PORT:-3001}/health"
MAX_RETRIES=12
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
log "API is available at http://localhost:${PORT:-3001}"
log "Database is available at localhost:${DB_PORT:-5432}"
log ""
log "You can check logs with: docker-compose logs -f"
log "To stop services run: docker-compose down"
