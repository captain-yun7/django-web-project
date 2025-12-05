#!/bin/bash

# ========================================
# MySQL 로컬 설치 스크립트
# Docker 없이 MySQL을 직접 설치합니다
# ========================================

set -e

echo "========================================="
echo "MySQL 로컬 설치 시작"
echo "========================================="

# 색상 코드
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. MySQL 설치
echo -e "\n${YELLOW}[1/5] MySQL 서버 설치 중...${NC}"
sudo apt update
sudo apt install -y mysql-server mysql-client

# 2. MySQL 서비스 시작
echo -e "\n${YELLOW}[2/5] MySQL 서비스 시작 중...${NC}"
sudo service mysql start

# 3. MySQL 상태 확인
echo -e "\n${YELLOW}[3/5] MySQL 상태 확인 중...${NC}"
sudo service mysql status

# 4. 데이터베이스 및 사용자 생성
echo -e "\n${YELLOW}[4/5] 데이터베이스 설정 중...${NC}"
sudo mysql <<EOF
-- 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS webapp_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 사용자 생성 및 권한 부여
CREATE USER IF NOT EXISTS 'webapp_user'@'localhost' IDENTIFIED BY '123123';
GRANT ALL PRIVILEGES ON webapp_db.* TO 'webapp_user'@'localhost';

-- root 비밀번호 설정 (선택)
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '123123';

FLUSH PRIVILEGES;

-- 생성된 데이터베이스 확인
SHOW DATABASES;
EOF

echo -e "${GREEN}데이터베이스 설정 완료!${NC}"

# 5. 연결 테스트
echo -e "\n${YELLOW}[5/5] 연결 테스트 중...${NC}"
if mysql -u webapp_user -p123123 -e "USE webapp_db; SELECT 'Connection successful!' as status;"; then
    echo -e "${GREEN}MySQL 연결 성공!${NC}"
else
    echo -e "${RED}MySQL 연결 실패${NC}"
    exit 1
fi

echo -e "\n${GREEN}========================================="
echo "MySQL 로컬 설치 완료!"
echo "=========================================${NC}"
echo ""
echo "데이터베이스 정보:"
echo "  - 데이터베이스: webapp_db"
echo "  - 사용자: webapp_user"
echo "  - 비밀번호: 123123"
echo "  - 호스트: localhost"
echo "  - 포트: 3306"
echo ""
echo "접속 방법:"
echo "  mysql -u webapp_user -p123123 webapp_db"
echo ""
echo "서비스 관리:"
echo "  시작: sudo service mysql start"
echo "  중지: sudo service mysql stop"
echo "  재시작: sudo service mysql restart"
echo "  상태: sudo service mysql status"
echo "========================================="
