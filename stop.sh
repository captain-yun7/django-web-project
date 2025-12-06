#!/bin/bash
# 서버 종료 스크립트
# Usage: ./stop.sh

GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${GREEN}서버 종료 중...${NC}"

# Django 백엔드 종료
pkill -f "manage.py runserver" 2>/dev/null && echo "  백엔드 종료됨" || echo "  백엔드 이미 종료됨"

# React 프론트엔드 종료
pkill -f "react-scripts start" 2>/dev/null && echo "  프론트엔드 종료됨" || echo "  프론트엔드 이미 종료됨"

echo -e "${GREEN}완료${NC}"
