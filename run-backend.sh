#!/bin/bash

# ========================================
# 백엔드 실행 스크립트 (포트 8218)
# ========================================

set -e

cd backend

# 가상환경 활성화
if [ ! -d "venv" ]; then
    echo "❌ 가상환경이 없습니다. 먼저 ./run-local.sh를 실행하세요."
    exit 1
fi

source venv/bin/activate

echo "========================================="
echo "백엔드 서버 시작 (포트 8218)"
echo "========================================="
echo ""
echo "접속 URL: http://localhost:8218/api/"
echo "관리자 페이지: http://localhost:8218/admin/"
echo ""
echo "종료하려면 Ctrl+C를 누르세요."
echo "========================================="

# Django 개발 서버 실행
python3 manage.py runserver 8218
