# 프로젝트 아키텍처 및 주요 코드 설명

Django + React 기반 게시판 웹 애플리케이션

## 프로젝트 구조

```
django-web-project/
├── backend/                 # Django 백엔드
│   ├── apps/
│   │   ├── accounts/        # 사용자 인증
│   │   └── core/            # 게시판 핵심 기능
│   ├── config/              # Django 설정
│   └── manage.py
├── frontend/                # React 프론트엔드
│   └── src/
│       ├── components/      # 공통 컴포넌트
│       ├── contexts/        # 전역 상태 관리
│       ├── pages/           # 페이지 컴포넌트
│       └── services/        # API 통신
├── setup.sh                 # 환경 설정 스크립트
├── start.sh                 # 서버 시작 스크립트
└── stop.sh                  # 서버 종료 스크립트
```

---

## 1. 사용자 인증 (Authentication)

### 백엔드

| 파일 | 설명 |
|------|------|
| `backend/apps/accounts/models.py` | 커스텀 User 모델 (이메일 기반 인증) |
| `backend/apps/accounts/views.py` | 회원가입, 프로필, 비밀번호 변경 API |
| `backend/apps/accounts/serializers.py` | 사용자 데이터 직렬화 |
| `backend/apps/accounts/urls.py` | 인증 관련 URL 라우팅 |

### 프론트엔드

| 파일 | 설명 |
|------|------|
| `frontend/src/contexts/AuthContext.js` | 전역 인증 상태 관리 (로그인/로그아웃) |
| `frontend/src/pages/Login.js` | 로그인 페이지 |
| `frontend/src/pages/Register.js` | 회원가입 페이지 |
| `frontend/src/pages/Profile.js` | 프로필 조회 및 비밀번호 변경 |

### 주요 API

```
POST /api/token/              # JWT 로그인
POST /api/token/refresh/      # 토큰 갱신
POST /api/accounts/register/  # 회원가입
GET  /api/accounts/profile/   # 프로필 조회
POST /api/accounts/change-password/  # 비밀번호 변경
```

---

## 2. 게시글 (Posts)

### 백엔드

| 파일 | 설명 |
|------|------|
| `backend/apps/core/models.py` | Post, Attachment, Comment, Category 모델 |
| `backend/apps/core/views.py` | 게시글 CRUD, 좋아요, 파일 업로드/삭제 API |
| `backend/apps/core/serializers.py` | 게시글 데이터 직렬화 (목록/상세/생성용) |
| `backend/apps/core/urls.py` | 게시글 관련 URL 라우팅 |

### 프론트엔드

| 파일 | 설명 |
|------|------|
| `frontend/src/pages/PostList.js` | 게시글 목록, 검색, 페이지네이션 |
| `frontend/src/pages/PostDetail.js` | 게시글 상세, 좋아요, 댓글 |
| `frontend/src/pages/PostCreate.js` | 게시글 작성 |
| `frontend/src/pages/PostEdit.js` | 게시글 수정, 첨부파일 관리 |

### 주요 API

```
GET    /api/posts/                    # 게시글 목록
POST   /api/posts/                    # 게시글 생성
GET    /api/posts/{id}/               # 게시글 상세
PATCH  /api/posts/{id}/               # 게시글 수정
DELETE /api/posts/{id}/               # 게시글 삭제
POST   /api/posts/{id}/like/          # 좋아요 토글
POST   /api/posts/{id}/upload_file/   # 파일 업로드
DELETE /api/posts/{id}/delete_file/{file_id}/  # 파일 삭제
```

---

## 3. 좋아요 (Likes)

### 백엔드

| 파일 | 수정 내용 |
|------|----------|
| `backend/apps/core/models.py` | Post 모델에 `likes` ManyToManyField 추가 |
| `backend/apps/core/views.py` | `like()` 액션 추가 (토글 방식) |
| `backend/apps/core/serializers.py` | `likes_count`, `is_liked` 필드 추가 |

### 프론트엔드

| 파일 | 수정 내용 |
|------|----------|
| `frontend/src/pages/PostList.js` | 목록에 좋아요 수 표시 (빨간 하트) |
| `frontend/src/pages/PostDetail.js` | 좋아요 버튼 (토글) |
| `frontend/src/services/api.js` | `like()` API 함수 추가 |
| `frontend/src/App.css` | 좋아요 버튼 스타일 |

---

## 4. 검색 (Search)

### 백엔드

| 파일 | 설명 |
|------|------|
| `backend/apps/core/views.py` | `SearchView` - 제목 기준 검색 |

### 프론트엔드

| 파일 | 설명 |
|------|------|
| `frontend/src/pages/PostList.js` | 검색창 (Enter 키로 검색) |
| `frontend/src/services/api.js` | `search()` API 함수 |

### API

```
GET /api/search/?q=검색어    # 제목 검색
```

---

## 5. 댓글 (Comments)

### 백엔드

| 파일 | 설명 |
|------|------|
| `backend/apps/core/models.py` | Comment 모델 |
| `backend/apps/core/views.py` | CommentViewSet |
| `backend/apps/core/serializers.py` | CommentSerializer |

### 프론트엔드

| 파일 | 설명 |
|------|------|
| `frontend/src/pages/PostDetail.js` | 댓글 목록, 작성, 삭제 |
| `frontend/src/services/api.js` | commentAPI 객체 |

### API

```
GET    /api/posts/{post_id}/comments/              # 댓글 목록
POST   /api/posts/{post_id}/comments/              # 댓글 작성
DELETE /api/posts/{post_id}/comments/{comment_id}/ # 댓글 삭제
```

---

## 6. 첨부파일 (Attachments)

### 백엔드

| 파일 | 설명 |
|------|------|
| `backend/apps/core/models.py` | Attachment 모델 |
| `backend/apps/core/views.py` | `upload_file()`, `delete_file()` 액션 |
| `backend/config/settings.py` | 허용 확장자, 파일 크기 제한 설정 |

### 프론트엔드

| 파일 | 설명 |
|------|------|
| `frontend/src/pages/PostDetail.js` | 첨부파일 다운로드 링크 |
| `frontend/src/pages/PostEdit.js` | 파일 업로드/삭제 UI |
| `frontend/src/services/api.js` | `uploadFile()`, `deleteFile()` API |

---

## 7. 스타일링 (CSS)

| 파일 | 설명 |
|------|------|
| `frontend/src/App.css` | 전체 스타일 (블라인드 스타일 참고) |
| `frontend/src/index.css` | 기본 리셋 스타일 |

### 주요 CSS 클래스

- `.post-table` - 게시글 목록 테이블
- `.post-view` - 게시글 상세 뷰
- `.write-form` - 글쓰기/수정 폼
- `.auth-box` - 로그인/회원가입 박스
- `.comment-section` - 댓글 영역
- `.btn-like`, `.btn-liked` - 좋아요 버튼

---

## 8. API 통신

| 파일 | 설명 |
|------|------|
| `frontend/src/services/api.js` | axios 인스턴스, API 함수 모음 |
| `frontend/src/setupProxy.js` | 개발 서버 프록시 설정 |

### API 객체 구조

```javascript
authAPI     - 로그인, 회원가입, 프로필, 비밀번호 변경
postAPI     - 게시글 CRUD, 좋아요, 파일 업로드/삭제, 검색
categoryAPI - 카테고리 목록
commentAPI  - 댓글 CRUD
```

---

## 9. 설정 파일

### 백엔드

| 파일 | 설명 |
|------|------|
| `backend/config/settings.py` | Django 설정 (DB, CORS, JWT, 파일 업로드 등) |
| `backend/config/urls.py` | 메인 URL 라우팅 |

### 프론트엔드

| 파일 | 설명 |
|------|------|
| `frontend/package.json` | npm 의존성 |
| `frontend/src/setupProxy.js` | API 프록시 설정 |

---

## 10. 실행 스크립트

| 파일 | 설명 |
|------|------|
| `setup.sh` | Ubuntu 24.04 환경 초기 설정 |
| `start.sh` | 백엔드 + 프론트엔드 동시 실행 |
| `stop.sh` | 실행 중인 서버 종료 |

---

## 환경 설정

### 포트

- 프론트엔드: 1218
- 백엔드: 8218
- MySQL: 3306

### 데이터베이스

- MySQL/MariaDB
- 데이터베이스명: webapp_db
- PyMySQL 드라이버 사용

### 주요 의존성

**백엔드:**
- Django 4.2
- Django REST Framework
- djangorestframework-simplejwt
- django-cors-headers
- PyMySQL

**프론트엔드:**
- React 18
- axios
- react-router-dom
- http-proxy-middleware
