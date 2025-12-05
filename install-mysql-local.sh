#!/bin/bash

# ========================================
# MySQL 로컬 설치 안내
# ========================================

echo "========================================="
echo "MySQL 설치 안내"
echo "========================================="

# 색상 코드
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "\n${YELLOW}이 스크립트는 sudo 권한이 필요하여 자동 설치할 수 없습니다.${NC}"
echo ""
echo -e "${GREEN}대신 다음 방법을 사용하세요:${NC}"
echo ""
echo "1️⃣  Windows에서 MySQL 설치:"
echo "   - MySQL Installer 다운로드: https://dev.mysql.com/downloads/installer/"
echo "   - 설치 후 root 비밀번호를 123123으로 설정"
echo ""
echo "2️⃣  WSL에서 Windows MySQL 사용:"
echo "   - Windows에 MySQL 설치 후"
echo "   - WSL에서 Windows MySQL에 연결 가능"
echo ""
echo "3️⃣  이미 MySQL이 설치되어 있다면:"
echo "   - MySQL이 실행 중인지 확인"
echo "   - ./setup-database.sh 실행하여 데이터베이스 생성"
echo ""
echo "========================================="
echo "MySQL 실행 확인:"
echo "  mysql -u root -p123123 -e \"SELECT VERSION();\""
echo "========================================="
