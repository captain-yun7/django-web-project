# Django + React + MySQL 웹 애플리케이션

Django REST Framework 백엔드, React 프론트엔드, MySQL 데이터베이스를 사용하는 3-tier 웹 애플리케이션입니다.

## 프로젝트 구조

```
django-web-project/
├── backend/                 # Django 백엔드
│   ├── apps/
│   │   ├── accounts/        # 사용자 인증/계정 관리
│   │   └── core/            # 핵심 기능 (게시판 등)
│   ├── config/              # Django 설정
│   └── requirements.txt     # Python 의존성
├── frontend/                # React 프론트엔드
│   ├── src/
│   │   ├── components/      # 재사용 컴포넌트
│   │   ├── contexts/        # React Context (인증 등)
│   │   ├── pages/           # 페이지 컴포넌트
│   │   └── services/        # API 서비스
│   └── package.json         # Node.js 의존성
├── db/                      # 데이터베이스 초기화 스크립트
├── nginx/                   # Nginx 리버스 프록시 설정
└── docker-compose.yml       # Docker 구성 파일
```

## 기술 스택

- **Backend**: Django 4.2, Django REST Framework, JWT 인증
- **Frontend**: React 18, React Router, Axios
- **Database**: MySQL 8.0
- **Server**: Gunicorn, Nginx
- **Container**: Docker, Docker Compose

## 빠른 시작 (로컬 개발)

### 권장: 로컬 개발 환경 (MySQL만 Docker 사용)

**MySQL은 Docker로, 백엔드/프론트엔드는 로컬에서 실행:**

```bash
# 저장소 클론
git clone <repository-url>
cd django-web-project

# 로컬 환경 준비 (MySQL Docker + 의존성 설치)
./run-local.sh

# 백엔드 실행 (포트 8218) - 새 터미널
./run-backend.sh

# 프론트엔드 실행 (포트 1218) - 새 터미널
./run-frontend.sh
```

### 접속 URL

| 서비스 | URL | 설명 |
|--------|-----|------|
| React 프론트엔드 | http://localhost:1218 | 메인 웹 애플리케이션 |
| Django API | http://localhost:8218/api/ | 백엔드 REST API |
| Django Admin | http://localhost:8218/admin/ | 관리자 페이지 |

### 선택: 전체 Docker 환경 (레거시)

**전체 서비스를 Docker로 실행 (개발 시 권장하지 않음):**

```bash
# WSL 환경
./auto-setup-wsl.sh

# 일반 Ubuntu 환경
./auto-setup.sh
```

## 환경 변수 설정

`.env` 파일을 프로젝트 루트에 생성하여 환경 변수를 설정할 수 있습니다:

```env
# MySQL 설정
MYSQL_ROOT_PASSWORD=your_root_password
MYSQL_DATABASE=webapp_db
MYSQL_USER=webapp_user
MYSQL_PASSWORD=your_password

# Django 설정
DEBUG=False
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1

# React 설정
REACT_APP_API_URL=http://localhost:8000/api
```

> **참고**: 환경 변수를 설정하지 않으면 기본값이 사용됩니다.

## API 엔드포인트

### 인증
- `POST /api/token/` - JWT 토큰 발급
- `POST /api/token/refresh/` - JWT 토큰 갱신
- `POST /api/accounts/register/` - 회원가입

### 사용자
- `GET /api/accounts/profile/` - 프로필 조회
- `PUT /api/accounts/profile/` - 프로필 수정

### 게시판
- `GET /api/posts/` - 게시글 목록 (페이징, 검색 지원)
- `POST /api/posts/` - 게시글 작성
- `GET /api/posts/{id}/` - 게시글 상세
- `PATCH /api/posts/{id}/` - 게시글 수정
- `DELETE /api/posts/{id}/` - 게시글 삭제
- `POST /api/posts/{id}/upload_file/` - 파일 업로드
- `GET /api/search/?q=검색어` - 통합 검색

### 댓글
- `GET /api/posts/{id}/comments/` - 댓글 목록
- `POST /api/posts/{id}/comments/` - 댓글 작성
- `DELETE /api/posts/{id}/comments/{comment_id}/` - 댓글 삭제

## 개발 가이드

### 시스템 요구사항

```bash
# 시스템 의존성 설치 (Ubuntu/Debian)
sudo apt update && sudo apt install -y pkg-config python3-dev default-libmysqlclient-dev build-essential
```

### 로컬 개발 환경 구성

로컬 개발 시에는 `run-local.sh` 스크립트를 먼저 실행하여 환경을 준비합니다:

```bash
# 1. MySQL Docker 시작 + 의존성 설치
./run-local.sh

# 2. 백엔드 실행 (포트 8218)
./run-backend.sh

# 3. 프론트엔드 실행 (포트 1218)
./run-frontend.sh
```

### 수동 실행 (고급 사용자)

```bash
# 백엔드 (포트 8218)
cd backend
source venv/bin/activate
python3 manage.py runserver 8218

# 프론트엔드 (포트 1218)
cd frontend
npm start  # PORT=1218이 package.json에 설정됨
```

## Docker 명령어

```bash
# 백그라운드 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f

# 특정 서비스 로그 확인
docker-compose logs -f backend

# 컨테이너 중지
docker-compose down

# 컨테이너 및 볼륨 삭제 (데이터 초기화)
docker-compose down -v

# 특정 서비스 재빌드
docker-compose up --build backend
```

## 주의사항

- 프로덕션 환경에서는 반드시 `SECRET_KEY`를 변경하세요.
- 프로덕션 환경에서는 `DEBUG=False`로 설정하세요.
- 데이터베이스 비밀번호는 안전한 값으로 변경하세요.
