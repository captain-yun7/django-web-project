#!/bin/bash
# Ubuntu 24.04 환경 설정 스크립트 (도커 없이 직접 설치)
# Usage: ./setup.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# 색상
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}  환경 설정 스크립트${NC}"
echo -e "${GREEN}  Ubuntu 24.04 / 직접 설치${NC}"
echo -e "${GREEN}================================${NC}"
echo ""

# 1. Python 가상환경 설정
echo -e "${YELLOW}[1/4] Python 가상환경 설정...${NC}"
cd backend
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo -e "${GREEN}  venv 생성 완료${NC}"
fi
source venv/bin/activate
pip install -q --upgrade pip
pip install -q -r requirements.txt
echo -e "${GREEN}  Python 패키지 설치 완료${NC}"

# 2. 데이터베이스 설정
echo -e "${YELLOW}[2/4] 데이터베이스 설정...${NC}"
echo "MySQL/MariaDB에 webapp_db 데이터베이스가 필요합니다."
echo "없으면 아래 명령으로 생성하세요:"
echo ""
echo -e "${GREEN}  mysql -u root -p -e \"CREATE DATABASE IF NOT EXISTS webapp_db CHARACTER SET utf8mb4;\"${NC}"
echo ""

# 3. Django 마이그레이션
echo -e "${YELLOW}[3/4] Django 마이그레이션...${NC}"
python3 manage.py migrate --run-syncdb 2>/dev/null || echo -e "${RED}  DB 연결 실패 - DB 설정 확인 필요${NC}"
cd ..

# 4. 프론트엔드 설정
echo -e "${YELLOW}[4/4] 프론트엔드 설정...${NC}"
cd frontend
if [ ! -d "node_modules" ]; then
    npm install
    echo -e "${GREEN}  npm 패키지 설치 완료${NC}"
else
    echo -e "${GREEN}  node_modules 이미 존재${NC}"
fi
cd ..

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}  설정 완료!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo "실행 방법:"
echo -e "  ${GREEN}./start.sh${NC}  - 백엔드 + 프론트엔드 동시 실행"
echo ""
echo "또는 각각 실행:"
echo -e "  백엔드:   ${GREEN}cd backend && source venv/bin/activate && python3 manage.py runserver 0.0.0.0:8218${NC}"
echo -e "  프론트:   ${GREEN}cd frontend && npm start${NC}"
echo ""
echo "접속 주소:"
echo -e "  프론트엔드: ${GREEN}http://localhost:1218${NC}"
echo -e "  백엔드 API: ${GREEN}http://localhost:8218/api/${NC}"
echo ""
