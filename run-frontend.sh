#!/bin/bash

# ========================================
# 프론트엔드 실행 스크립트 (포트 1218)
# ========================================

set -e

cd frontend

# node_modules 확인
if [ ! -d "node_modules" ]; then
    echo "❌ node_modules가 없습니다. 먼저 ./run-local.sh를 실행하세요."
    exit 1
fi

echo "========================================="
echo "프론트엔드 서버 시작 (포트 1218)"
echo "========================================="
echo ""
echo "접속 URL: http://localhost:1218"
echo ""
echo "종료하려면 Ctrl+C를 누르세요."
echo "========================================="

# React 개발 서버 실행
npm start
