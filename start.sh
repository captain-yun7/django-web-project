#!/bin/bash
# 백엔드 + 프론트엔드 동시 실행 스크립트
# Usage: ./start.sh

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# 색상
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}  서버 시작${NC}"
echo -e "${GREEN}================================${NC}"
echo ""

# 백엔드 실행 (백그라운드)
echo -e "${YELLOW}[1/2] 백엔드 시작 (포트 8218)...${NC}"
cd backend
source venv/bin/activate
nohup python3 manage.py runserver 0.0.0.0:8218 > ../backend.log 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}  백엔드 PID: $BACKEND_PID${NC}"
cd ..

# 프론트엔드 실행 (백그라운드)
echo -e "${YELLOW}[2/2] 프론트엔드 시작 (포트 1218)...${NC}"
cd frontend
nohup npm start > ../frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}  프론트엔드 PID: $FRONTEND_PID${NC}"
cd ..

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}  서버 실행 완료!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo "접속 주소:"
echo -e "  프론트엔드: ${GREEN}http://localhost:1218${NC}"
echo -e "  백엔드 API: ${GREEN}http://localhost:8218/api/${NC}"
echo ""
echo "로그 확인:"
echo -e "  ${GREEN}tail -f backend.log${NC}"
echo -e "  ${GREEN}tail -f frontend.log${NC}"
echo ""
echo "서버 종료:"
echo -e "  ${GREEN}./stop.sh${NC}"
echo ""
