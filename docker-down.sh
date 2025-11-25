#!/bin/bash
# Convenience script to stop Docker infrastructure services
echo "🛑 Stopping infrastructure services..."
docker compose -f infrastructure/docker-compose.dev.yml down
