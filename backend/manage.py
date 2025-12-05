#!/usr/bin/env python
"""
Django 관리 스크립트
- 이 파일은 Django 프로젝트 관리 명령어를 실행하는 진입점입니다.
- 예: python manage.py runserver, python manage.py migrate 등
"""

import os
import sys
from pathlib import Path

# 현재 디렉토리를 Python 경로에 추가
sys.path.insert(0, str(Path(__file__).resolve().parent))


def main():
    """Django 관리 명령어 실행"""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Django를 가져올 수 없습니다. "
            "가상환경이 활성화되어 있고 Django가 설치되어 있는지 확인하세요."
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
