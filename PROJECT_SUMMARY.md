# Django 웹 프로젝트 최종 요약

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 프레임워크 | Django 4.2 (REST Framework) |
| 프론트엔드 | React 18 |
| 데이터베이스 | MySQL 8.0 |
| 인증 방식 | JWT (JSON Web Token) |
| 실행 환경 | Docker (Ubuntu 서버) |

---

## 2. 구현된 기능 목록 (총 9개)

### 웹 기능 (8개)

| # | 기능 | API 엔드포인트 | 설명 |
|---|------|---------------|------|
| 1 | 회원가입 | `POST /api/accounts/register/` | 이메일, 비밀번호로 회원가입 |
| 2 | 로그인 | `POST /api/token/` | JWT 토큰 발급 |
| 3 | 게시글 목록/상세 | `GET /api/posts/` | 게시글 조회, 페이징 지원 |
| 4 | 게시글 작성 | `POST /api/posts/` | 제목, 내용, 카테고리 입력 |
| 5 | 게시글 수정/삭제 | `PATCH/DELETE /api/posts/{id}/` | 본인 글만 수정/삭제 가능 |
| 6 | 파일 업로드 | `POST /api/posts/{id}/upload_file/` | 게시글에 파일 첨부 |
| 7 | 검색 | `GET /api/search/?q=검색어` | 제목/내용 통합 검색 |
| 8 | 댓글 | `POST /api/posts/{id}/comments/` | 게시글에 댓글 작성 |

### 보안 기능 (1개)

| # | 기능 | 설명 |
|---|------|------|
| 9 | 로그인 시도 제한 | 5회 실패 시 30분 계정 잠금 (Brute Force 공격 방지) |

---

## 3. 파일 구조 및 설명

```
django-web-project/
├── backend/                    # Django 백엔드
│   ├── config/
│   │   ├── settings.py        # 전체 설정 (DB, 보안, JWT 등)
│   │   ├── urls.py            # URL 라우팅 설정
│   │   └── wsgi.py            # 웹 서버 인터페이스
│   ├── apps/
│   │   ├── accounts/          # 사용자 관리 앱
│   │   │   ├── models.py      # User 모델 (이메일 기반 인증)
│   │   │   ├── views.py       # 회원가입, 로그인, 프로필 API
│   │   │   ├── serializers.py # 데이터 직렬화
│   │   │   └── urls.py        # accounts URL 설정
│   │   └── core/              # 핵심 기능 앱
│   │       ├── models.py      # Post, Comment, Attachment 모델
│   │       ├── views.py       # 게시글 CRUD, 검색, 파일업로드 API
│   │       ├── serializers.py # 데이터 직렬화
│   │       └── urls.py        # core URL 설정
│   ├── Dockerfile             # 백엔드 Docker 이미지
│   └── requirements.txt       # Python 패키지 목록
│
├── frontend/                   # React 프론트엔드
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.js       # 로그인 페이지
│   │   │   ├── Register.js    # 회원가입 페이지
│   │   │   ├── PostList.js    # 게시글 목록 페이지
│   │   │   ├── PostDetail.js  # 게시글 상세 페이지
│   │   │   └── PostCreate.js  # 게시글 작성 페이지
│   │   ├── services/
│   │   │   └── api.js         # API 호출 함수 (axios)
│   │   ├── contexts/
│   │   │   └── AuthContext.js # 인증 상태 관리
│   │   └── App.js             # 라우팅 설정
│   ├── Dockerfile             # 프론트엔드 Docker 이미지
│   └── package.json           # npm 패키지 목록
│
├── db/
│   └── init.sql               # DB 초기화 SQL
│
├── docker-compose.yml         # Docker 컨테이너 구성
└── setup.sh                   # 자동 설치 스크립트
```

---

## 4. 주요 파일별 코드 설명

### 4.1 백엔드 설정 (`backend/config/settings.py`)

```python
# 데이터베이스 설정 (MySQL)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'webapp_db',
        'USER': 'root',
        'PASSWORD': '123123',  # 기본 비밀번호
        'HOST': 'db',
        'PORT': '3306',
    }
}

# 보안: 로그인 시도 제한 (django-axes)
AXES_FAILURE_LIMIT = 5          # 5회 실패 시 잠금
AXES_COOLOFF_TIME = 30분        # 30분 후 잠금 해제

# JWT 토큰 설정
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': 60분,
    'REFRESH_TOKEN_LIFETIME': 7일,
}
```

### 4.2 사용자 모델 (`backend/apps/accounts/models.py`)

```python
class User(AbstractUser):
    """
    커스텀 사용자 모델
    - 이메일을 아이디로 사용
    - username 대신 email로 로그인
    """
    email = models.EmailField(unique=True)
    USERNAME_FIELD = 'email'  # 로그인 시 이메일 사용
```

### 4.3 게시글 모델 (`backend/apps/core/models.py`)

```python
class Post(models.Model):
    """게시글 모델"""
    title = models.CharField(max_length=200)      # 제목
    content = models.TextField()                   # 내용
    author = models.ForeignKey(User)               # 작성자
    category = models.ForeignKey(Category)         # 카테고리
    views = models.PositiveIntegerField(default=0) # 조회수
    is_public = models.BooleanField(default=True)  # 공개여부
    created_at = models.DateTimeField(auto_now_add=True)

class Attachment(models.Model):
    """첨부파일 모델"""
    post = models.ForeignKey(Post)
    file = models.FileField(upload_to='attachments/')
    original_name = models.CharField(max_length=255)
```

### 4.4 API 서비스 (`frontend/src/services/api.js`)

```javascript
// axios를 사용한 API 호출
const api = axios.create({
    baseURL: '/api/',
    headers: { 'Content-Type': 'application/json' }
});

// 자동으로 JWT 토큰을 헤더에 추가
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
```

---

## 5. 실행 방법

### 방법 1: 자동 스크립트 (권장)

```bash
# 프로젝트 폴더에서
./setup.sh
```

### 방법 2: 수동 실행

```bash
# Docker 컨테이너 시작
docker compose up -d

# 관리자 계정 생성
docker compose exec backend python manage.py createsuperuser
```

### 접속 주소

| 서비스 | URL |
|--------|-----|
| 프론트엔드 | http://localhost:3000 |
| 백엔드 API | http://localhost:8000/api/ |
| Django Admin | http://localhost:8000/admin/ |

---

## 6. 기능별 사용법

### 6.1 회원가입

1. http://localhost:3000/register 접속
2. 이메일, 비밀번호 입력
3. "회원가입" 버튼 클릭

### 6.2 로그인

1. http://localhost:3000/login 접속
2. 가입한 이메일, 비밀번호 입력
3. "로그인" 버튼 클릭
4. JWT 토큰이 자동 저장됨

### 6.3 게시글 작성

1. 로그인 후 "글쓰기" 버튼 클릭
2. 제목, 내용 입력
3. "등록" 버튼 클릭

### 6.4 파일 업로드

1. 게시글 상세 페이지에서 "파일 첨부" 클릭
2. 파일 선택 (허용: pdf, doc, docx, xls, xlsx, jpg, png 등)
3. 최대 10MB까지 업로드 가능

### 6.5 검색

1. 상단 검색창에 검색어 입력
2. 제목과 내용에서 검색됨

### 6.6 댓글

1. 게시글 상세 페이지 하단
2. 댓글 내용 입력 후 "등록" 클릭

---

## 7. 보안 기능 상세

### 7.1 로그인 시도 제한 (Brute Force 방지)

- **라이브러리**: django-axes
- **설정 위치**: `backend/config/settings.py`
- **동작 방식**:
  - 5회 연속 로그인 실패 시 계정 잠금
  - 30분 후 자동 잠금 해제
  - 성공 시 실패 횟수 초기화

```python
AXES_FAILURE_LIMIT = 5              # 5회 실패 시 잠금
AXES_COOLOFF_TIME = timedelta(minutes=30)  # 30분 후 해제
AXES_RESET_ON_SUCCESS = True        # 성공 시 초기화
```

### 7.2 기타 보안 조치

- JWT 토큰 인증 (세션 탈취 방지)
- 파일 확장자 검증 (악성 파일 업로드 방지)
- 파일 크기 제한 (서버 과부하 방지)
- 비밀번호 복잡도 검증

---

## 8. 데이터베이스 정보

| 항목 | 값 |
|------|-----|
| DB 종류 | MySQL 8.0 |
| 호스트 | localhost (Docker: db) |
| 포트 | 3306 |
| 데이터베이스명 | webapp_db |
| 사용자 | root |
| 비밀번호 | 123123 |

### 테이블 구조

```
accounts_user        # 사용자 정보
core_category        # 카테고리
core_post            # 게시글
core_attachment      # 첨부파일
core_comment         # 댓글
axes_accessattempt   # 로그인 시도 기록 (보안)
```

---

## 9. 기술 스택 요약

| 분류 | 기술 |
|------|------|
| Backend | Django 4.2, Django REST Framework |
| Frontend | React 18, Axios |
| Database | MySQL 8.0 |
| Authentication | JWT (Simple JWT) |
| Security | django-axes (로그인 제한) |
| Container | Docker, Docker Compose |
| Server | Gunicorn (WSGI) |
