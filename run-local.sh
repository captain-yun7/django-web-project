#!/bin/bash

# ========================================
# 로컬 개발 환경 실행 스크립트
# - MySQL만 Docker로 실행
# - 백엔드(8218), 프론트엔드(1218) 로컬 실행
# ========================================

set -e

echo "========================================="
echo "로컬 개발 환경 시작"
echo "========================================="

# 색상 코드
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. MySQL Docker 컨테이너 시작
echo -e "\n${YELLOW}[1/4] MySQL Docker 컨테이너 시작 중...${NC}"
if ! docker compose up -d db; then
    echo -e "${RED}MySQL 컨테이너 시작 실패${NC}"
    exit 1
fi

# MySQL 준비 대기
echo -e "${YELLOW}MySQL 준비 대기 중...${NC}"
sleep 5
until docker compose exec -T db mysqladmin ping -h localhost -u root -p123123 --silent; do
    echo "MySQL 연결 대기 중..."
    sleep 2
done
echo -e "${GREEN}MySQL 준비 완료!${NC}"

# 2. 백엔드 실행 확인
echo -e "\n${YELLOW}[2/4] 백엔드 환경 확인 중...${NC}"
cd backend

if [ ! -d "venv" ]; then
    echo -e "${YELLOW}가상환경이 없습니다. 생성 중...${NC}"
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
else
    source venv/bin/activate
fi

# 데이터베이스 마이그레이션
echo -e "${YELLOW}데이터베이스 마이그레이션 실행 중...${NC}"
python3 manage.py migrate

echo -e "${GREEN}백엔드 환경 준비 완료!${NC}"

# 3. 프론트엔드 실행 확인
cd ../frontend
echo -e "\n${YELLOW}[3/4] 프론트엔드 환경 확인 중...${NC}"

if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}node_modules가 없습니다. 설치 중...${NC}"
    npm install
fi

echo -e "${GREEN}프론트엔드 환경 준비 완료!${NC}"

# 4. 실행 안내
echo -e "\n${GREEN}========================================="
echo "로컬 개발 환경 준비 완료!"
echo "=========================================${NC}"
echo ""
echo -e "${YELLOW}다음 명령어로 서버를 실행하세요:${NC}"
echo ""
echo "1️⃣  백엔드 실행 (포트 8218):"
echo -e "   ${GREEN}cd backend && source venv/bin/activate && python3 manage.py runserver 8218${NC}"
echo ""
echo "2️⃣  프론트엔드 실행 (포트 1218):"
echo -e "   ${GREEN}cd frontend && npm start${NC}"
echo ""
echo -e "${YELLOW}또는 별도 스크립트 사용:${NC}"
echo -e "   ${GREEN}./run-backend.sh${NC}"
echo -e "   ${GREEN}./run-frontend.sh${NC}"
echo ""
echo "========================================="
echo "접속 URL:"
echo "  - 프론트엔드: http://localhost:1218"
echo "  - 백엔드 API: http://localhost:8218/api/"
echo "========================================="
