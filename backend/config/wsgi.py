"""
WSGI 설정 파일
- 프로덕션 서버(Gunicorn)에서 Django 앱을 실행할 때 사용됩니다.
"""

import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

application = get_wsgi_application()
