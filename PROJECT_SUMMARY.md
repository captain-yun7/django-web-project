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
├── auto-setup.sh              # 자동 설치 스크립트 (Ubuntu)
└── auto-setup-wsl.sh          # 자동 설치 스크립트 (WSL)
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
// Docker 환경에서는 환경 변수 사용, 로컬에서는 프록시 사용
const API_URL = process.env.REACT_APP_API_URL || '/api/';

const api = axios.create({
    baseURL: API_URL,
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

### 4.5 게시글 Serializer (`backend/apps/core/serializers.py`)

```python
class PostCreateSerializer(serializers.ModelSerializer):
    """게시글 생성용 시리얼라이저 - 응답에 id 포함"""
    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'category', 'is_public']
        read_only_fields = ['id']  # 생성 후 id 반환
```

---

## 5. 실행 방법

### 방법 1: 자동 스크립트 (권장)

**Ubuntu/WSL 환경에서 Docker 자동 설치 및 실행:**

```bash
# WSL 환경
./auto-setup-wsl.sh

# 일반 Ubuntu 환경
./auto-setup.sh
```

스크립트가 자동으로 다음을 수행합니다:
- Docker 설치 (미설치 시)
- 환경 변수 설정 (.env 파일 생성)
- 컨테이너 빌드 및 실행
- 데이터베이스 마이그레이션

### 방법 2: 수동 실행

**이미 Docker가 설치된 환경:**

```bash
# Docker 컨테이너 시작
docker compose up --build -d

# 관리자 계정 생성 (선택)
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

### 6.3 게시글 작성 (파일 첨부 포함)

1. 로그인 후 "글쓰기" 버튼 클릭
2. 제목, 내용 입력
3. **파일 첨부** (선택): "파일 첨부" 버튼으로 여러 파일 선택 가능
   - 허용 형식: `.pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .jpg, .jpeg, .png, .gif, .zip`
   - 최대 크기: 10MB
4. "등록" 버튼 클릭
5. 게시글 생성 후 파일 자동 업로드

### 6.4 첨부파일 다운로드

1. 게시글 상세 페이지 하단 "첨부파일" 섹션 확인
2. 파일 링크 클릭하여 다운로드

### 6.5 검색

1. 게시글 목록 상단 검색창에 검색어 입력
2. 제목과 내용에서 통합 검색
3. 검색 결과 즉시 표시

### 6.6 댓글 작성 및 삭제

1. 게시글 상세 페이지 하단 댓글 섹션
2. 댓글 내용 입력 후 "등록" 버튼 클릭
3. 본인 댓글은 "삭제" 버튼으로 삭제 가능

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
| Frontend | React 18, Axios, React Router |
| Database | MySQL 8.0 |
| Authentication | JWT (Simple JWT) |
| Security | django-axes (로그인 제한) |
| Container | Docker, Docker Compose |
| Server | Gunicorn (WSGI) |

---

## 10. 주요 수정 사항 (최근 업데이트)

### 10.1 Docker 환경 자동 설치 스크립트

**파일**: `auto-setup.sh`, `auto-setup-wsl.sh`

- Ubuntu/WSL 환경에서 Docker 자동 설치
- 환경 변수 자동 설정
- 컨테이너 빌드 및 실행 자동화
- WSL/일반 Ubuntu 환경 자동 감지 및 대응

### 10.2 프론트엔드 API 통신 개선

**파일**: `frontend/src/services/api.js`

```javascript
// Docker 환경과 로컬 환경 모두 지원
const API_URL = process.env.REACT_APP_API_URL || '/api/';
```

- Docker Compose 환경에서 환경 변수 사용
- 로컬 개발 환경에서 프록시 사용
- 양쪽 환경에서 원활한 작동 보장

### 10.3 게시글 생성 후 리다이렉션 수정

**파일**: `backend/apps/core/serializers.py`

```python
class PostCreateSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ['id', 'title', 'content', 'category', 'is_public']
        read_only_fields = ['id']  # 생성 후 id 반환
```

- 게시글 생성 API 응답에 `id` 필드 추가
- 프론트엔드에서 생성된 게시글로 정상 리다이렉션

### 10.4 파일 업로드 기능 UI 추가

**파일**: `frontend/src/pages/PostCreate.js`

- 게시글 작성 폼에 파일 첨부 input 추가
- 다중 파일 선택 지원
- 선택된 파일 목록 미리보기
- 게시글 생성 후 파일 자동 업로드

**파일**: `frontend/src/pages/PostDetail.js`

- 첨부파일 목록 표시
- 파일 다운로드 링크 제공
- 파일 크기 표시

**파일**: `frontend/src/App.css`

```css
.post-view-attachments {
  padding: 16px 20px;
  border-top: 1px solid #f0f0f0;
  background: #f8f9fa;
}

.post-view-attachments a {
  display: inline-flex;
  padding: 8px 12px;
  background: #fff;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  word-break: break-all;
  max-width: 100%;
}
```

- 첨부파일 섹션 스타일 추가
- 컨테이너를 넘어가지 않도록 최대 너비 제한
- 긴 파일명 자동 줄바꿈
- 클립 아이콘 자동 표시
