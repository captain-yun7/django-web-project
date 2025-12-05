#!/bin/bash

# ========================================
# 기존 MySQL에 데이터베이스만 생성
# ========================================

set -e

echo "========================================="
echo "데이터베이스 설정"
echo "========================================="

# 색상 코드
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "\n${YELLOW}기존 MySQL에 데이터베이스를 생성합니다.${NC}"
echo -e "${YELLOW}MySQL root 비밀번호를 입력하세요:${NC}"

# MySQL에 데이터베이스 생성
mysql -u root -p <<EOF
-- 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS webapp_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 사용자 생성 및 권한 부여 (이미 있다면 무시됨)
CREATE USER IF NOT EXISTS 'root'@'localhost' IDENTIFIED BY '123123';
GRANT ALL PRIVILEGES ON webapp_db.* TO 'root'@'localhost';

FLUSH PRIVILEGES;

-- 확인
SHOW DATABASES LIKE 'webapp_db';
USE webapp_db;
SHOW TABLES;
EOF

echo -e "\n${GREEN}========================================="
echo "데이터베이스 설정 완료!"
echo "=========================================${NC}"
echo ""
echo "데이터베이스 정보:"
echo "  - 호스트: localhost"
echo "  - 포트: 3306"
echo "  - 데이터베이스: webapp_db"
echo "  - 사용자: root"
echo "  - 비밀번호: 123123"
echo ""
echo "이제 다음 명령어로 프로젝트를 실행하세요:"
echo "  1. ./run-local-no-docker.sh  (환경 준비)"
echo "  2. ./run-backend.sh          (백엔드 실행)"
echo "  3. ./run-frontend.sh         (프론트엔드 실행)"
echo "========================================="
