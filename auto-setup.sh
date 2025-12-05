#!/bin/bash
# Django + React + MySQL 프로젝트 완전 자동 설치 스크립트 (Ubuntu)
# Usage: ./auto-setup.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Django Web Project Auto Setup${NC}"
echo -e "${BLUE}  Ubuntu + Docker 자동 설치${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# 1. 시스템 업데이트
echo -e "${YELLOW}[1/6] 시스템 업데이트 중...${NC}"
sudo apt-get update -qq
echo -e "${GREEN}  ✓ 완료${NC}"
echo ""

# 2. Docker 설치 확인 및 설치
echo -e "${YELLOW}[2/6] Docker 설치 확인...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "  Docker가 설치되지 않았습니다. 설치를 시작합니다..."

    # 기존 Docker 관련 패키지 제거
    sudo apt-get remove -y docker docker-engine docker.io containerd runc 2>/dev/null || true

    # 필수 패키지 설치
    sudo apt-get install -y \
        ca-certificates \
        curl \
        gnupg \
        lsb-release

    # Docker 공식 GPG 키 추가
    sudo install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    sudo chmod a+r /etc/apt/keyrings/docker.gpg

    # Docker 저장소 추가
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
      sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

    # Docker 설치
    sudo apt-get update -qq
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

    # 현재 사용자를 docker 그룹에 추가
    sudo usermod -aG docker $USER

    echo -e "${GREEN}  ✓ Docker 설치 완료${NC}"
else
    echo -e "${GREEN}  ✓ Docker가 이미 설치되어 있습니다 ($(docker --version))${NC}"
fi
echo ""

# 3. Docker 서비스 시작
echo -e "${YELLOW}[3/6] Docker 서비스 시작...${NC}"
sudo systemctl start docker
sudo systemctl enable docker
echo -e "${GREEN}  ✓ Docker 서비스 실행 중${NC}"
echo ""

# 4. Docker Compose 명령어 확인
if docker compose version &> /dev/null; then
    DC="docker compose"
elif command -v docker-compose &> /dev/null; then
    DC="docker-compose"
else
    echo -e "${RED}Error: Docker Compose를 찾을 수 없습니다${NC}"
    exit 1
fi
echo -e "${GREEN}  ✓ Docker Compose: $DC${NC}"
echo ""

# 5. 환경 파일 생성
echo -e "${YELLOW}[4/6] 환경 설정 파일 생성...${NC}"
if [ ! -f .env ]; then
    cat > .env << 'EOF'
# MySQL 설정
MYSQL_ROOT_PASSWORD=123123
MYSQL_DATABASE=webapp_db
MYSQL_USER=webapp_user
MYSQL_PASSWORD=123123

# Django 설정
DEBUG=True
SECRET_KEY=django-insecure-dev-key-change-in-production
ALLOWED_HOSTS=localhost,127.0.0.1,backend

# React 설정
REACT_APP_API_URL=http://localhost:8000/api
EOF
    echo -e "${GREEN}  ✓ .env 파일 생성 완료${NC}"
else
    echo -e "${GREEN}  ✓ .env 파일이 이미 존재합니다${NC}"
fi
echo ""

# 6. 이전 컨테이너 정리 (있는 경우)
echo -e "${YELLOW}[5/6] 이전 컨테이너 정리...${NC}"
sudo $DC down -v 2>/dev/null || true
echo -e "${GREEN}  ✓ 정리 완료${NC}"
echo ""

# 7. Docker 컨테이너 빌드 및 실행
echo -e "${YELLOW}[6/6] Docker 컨테이너 빌드 및 실행...${NC}"
echo -e "  이 작업은 몇 분 정도 걸릴 수 있습니다..."
echo ""

# Docker 이미지 빌드 및 컨테이너 시작
sudo $DC build --no-cache
sudo $DC up -d

# MySQL이 준비될 때까지 대기
echo -e "${YELLOW}  MySQL 데이터베이스 초기화 대기 중...${NC}"
sleep 10

# 백엔드가 준비될 때까지 대기
echo -e "${YELLOW}  Django 백엔드 초기화 대기 중...${NC}"
for i in {1..30}; do
    if sudo $DC logs backend 2>&1 | grep -q "Booting worker"; then
        break
    fi
    sleep 2
    echo -n "."
done
echo ""
echo -e "${GREEN}  ✓ 모든 컨테이너 실행 완료${NC}"
echo ""

# 컨테이너 상태 확인
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  컨테이너 상태${NC}"
echo -e "${BLUE}========================================${NC}"
sudo $DC ps
echo ""

# 로그 확인 (백엔드)
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  백엔드 초기화 로그 (최근 15줄)${NC}"
echo -e "${BLUE}========================================${NC}"
sudo $DC logs --tail=15 backend
echo ""

# 완료 메시지
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  🎉 설치 완료!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}접속 주소:${NC}"
echo -e "  • 프론트엔드: ${GREEN}http://localhost:3000${NC}"
echo -e "  • 백엔드 API: ${GREEN}http://localhost:8000/api/${NC}"
echo -e "  • Django Admin: ${GREEN}http://localhost:8000/admin/${NC}"
echo ""
echo -e "${BLUE}관리자 계정 생성 (선택):${NC}"
echo -e "  ${YELLOW}sudo $DC exec backend python manage.py createsuperuser${NC}"
echo ""
echo -e "${BLUE}유용한 명령어:${NC}"
echo -e "  • 로그 보기:      ${YELLOW}sudo $DC logs -f${NC}"
echo -e "  • 중지:           ${YELLOW}sudo $DC stop${NC}"
echo -e "  • 시작:           ${YELLOW}sudo $DC start${NC}"
echo -e "  • 완전 삭제:      ${YELLOW}sudo $DC down -v${NC}"
echo -e "  • 재시작:         ${YELLOW}sudo $DC restart${NC}"
echo ""
echo -e "${YELLOW}⚠️  주의사항:${NC}"
echo -e "  현재 터미널에서는 Docker 그룹 권한이 적용되지 않았을 수 있습니다."
echo -e "  sudo 없이 docker 명령을 사용하려면 다음 중 하나를 실행하세요:"
echo -e "    1) ${YELLOW}newgrp docker${NC}  (현재 세션에 즉시 적용)"
echo -e "    2) ${YELLOW}재로그인${NC}  (완전히 적용)"
echo ""
