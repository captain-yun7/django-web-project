#!/bin/bash
# Django + React + MySQL Docker Setup Script (Development)
# Usage: ./setup.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}  Development Setup Script${NC}"
echo -e "${GREEN}================================${NC}"
echo ""

# Check Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed${NC}"
    exit 1
fi

# Docker Compose command
if docker compose version &> /dev/null; then
    DC="docker compose"
else
    DC="docker-compose"
fi

# Create .env if not exists
echo -e "${YELLOW}[1/2] Checking environment...${NC}"
if [ ! -f .env ]; then
    cat > .env << 'EOF'
MYSQL_ROOT_PASSWORD=123123
MYSQL_DATABASE=webapp_db
MYSQL_USER=webapp_user
MYSQL_PASSWORD=123123
DEBUG=True
SECRET_KEY=dev-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1,backend
EOF
    echo -e "${GREEN}  .env created${NC}"
else
    echo -e "${GREEN}  .env exists${NC}"
fi

# Start containers (without nginx)
echo -e "${YELLOW}[2/2] Starting containers...${NC}"
$DC up -d db backend frontend

# Wait and show status
sleep 5
echo ""
$DC ps

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}  Setup Complete!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo -e "  Frontend: ${GREEN}http://localhost:3000${NC}"
echo -e "  Backend:  ${GREEN}http://localhost:8000${NC}"
echo -e "  API:      ${GREEN}http://localhost:8000/api/${NC}"
echo ""
echo -e "Commands:"
echo -e "  Stop:        ${GREEN}$DC down${NC}"
echo -e "  Logs:        ${GREEN}$DC logs -f${NC}"
echo -e "  Create user: ${GREEN}$DC exec backend python manage.py createsuperuser${NC}"
