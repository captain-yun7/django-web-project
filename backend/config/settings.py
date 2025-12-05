"""
Django 설정 파일
- 이 파일은 Django 프로젝트의 모든 설정을 관리합니다.
- 데이터베이스 연결, 보안 설정, 앱 설정 등이 포함됩니다.
"""

import os
from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv

# 프로젝트 기본 경로
BASE_DIR = Path(__file__).resolve().parent.parent

# .env 파일 로드
load_dotenv(BASE_DIR / '.env')

# 보안 키 (환경 변수에서 가져옴)
SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-change-this-in-production')

# 디버그 모드 설정
DEBUG = os.environ.get('DEBUG', 'True').lower() in ('true', '1', 'yes')

# 허용된 호스트
ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')

# =====================================
# 앱 설정
# =====================================
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third-party 앱
    'rest_framework',           # REST API 프레임워크
    'rest_framework_simplejwt', # JWT 인증
    'corsheaders',              # CORS 헤더 처리
    'django_filters',           # 필터링 기능
    'axes',                     # 로그인 시도 제한 (보안)

    # 프로젝트 앱
    'apps.accounts',            # 사용자 계정 관리
    'apps.core',                # 핵심 기능
]

# =====================================
# 미들웨어 설정
# =====================================
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',        # CORS 처리 (맨 위에 위치)
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'axes.middleware.AxesMiddleware',               # 로그인 시도 제한 (보안)
]

# URL 설정
ROOT_URLCONF = 'config.urls'

# 템플릿 설정
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# WSGI 설정
WSGI_APPLICATION = 'config.wsgi.application'

# =====================================
# 데이터베이스 설정 (MySQL)
# =====================================
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.environ.get('DB_NAME', 'webapp_db'),
        'USER': os.environ.get('DB_USER', 'root'),
        'PASSWORD': os.environ.get('DB_PASSWORD', '123123'),
        'HOST': os.environ.get('DB_HOST', 'localhost'),
        'PORT': os.environ.get('DB_PORT', '3306'),
        'OPTIONS': {
            'charset': 'utf8mb4',
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
        },
    }
}

# =====================================
# 인증 백엔드 설정
# =====================================
AUTHENTICATION_BACKENDS = [
    'axes.backends.AxesStandaloneBackend',  # django-axes (보안)
    'django.contrib.auth.backends.ModelBackend',
]

# 커스텀 사용자 모델
AUTH_USER_MODEL = 'accounts.User'

# 비밀번호 검증
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# =====================================
# 국제화 설정
# =====================================
LANGUAGE_CODE = 'ko-kr'
TIME_ZONE = 'Asia/Seoul'
USE_I18N = True
USE_TZ = True

# =====================================
# 정적 파일 및 미디어 설정
# =====================================
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [BASE_DIR / 'static']

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# 기본 Primary Key 타입
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# =====================================
# REST Framework 설정
# =====================================
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10,
}

# =====================================
# JWT 설정
# =====================================
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'AUTH_HEADER_TYPES': ('Bearer',),
}

# =====================================
# CORS 설정 (React 프론트엔드 연동)
# =====================================
CORS_ALLOWED_ORIGINS = [
    "http://localhost:1218",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:3003",
    "http://localhost:3004",
    "http://localhost:3005",
    "http://localhost:3006"
]
CORS_ALLOW_CREDENTIALS = True

# =====================================
# 보안 설정: Django-Axes (로그인 시도 제한)
# - 무차별 대입 공격 방지
# =====================================
AXES_FAILURE_LIMIT = 5              # 5회 실패 시 잠금
AXES_COOLOFF_TIME = timedelta(minutes=30)  # 30분 후 잠금 해제
AXES_LOCKOUT_CALLABLE = None
AXES_RESET_ON_SUCCESS = True        # 성공 시 실패 횟수 초기화

# =====================================
# 파일 업로드 설정
# =====================================
FILE_UPLOAD_MAX_MEMORY_SIZE = 10 * 1024 * 1024  # 10MB
DATA_UPLOAD_MAX_MEMORY_SIZE = 10 * 1024 * 1024  # 10MB

# 허용된 파일 확장자
ALLOWED_FILE_EXTENSIONS = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.jpg', '.jpeg', '.png', '.gif']
