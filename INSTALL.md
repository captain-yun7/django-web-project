# 설치 가이드 (Ubuntu 24.04)

## 사전 요구사항

- Ubuntu 24.04
- Python 3.12+
- Node.js 18+
- MySQL 8.0 또는 MariaDB 10.5+

---

## 1. 시스템 패키지 설치

```bash
# 패키지 업데이트
sudo apt update

# Python 관련
sudo apt install -y python3 python3-pip python3-venv

# Node.js (Ubuntu 24.04 기본 제공)
sudo apt install -y nodejs npm

# MySQL (또는 MariaDB)
sudo apt install -y mysql-server
# 또는
sudo apt install -y mariadb-server
```

---

## 2. 데이터베이스 설정

```bash
# MySQL 접속
sudo mysql -u root

# 데이터베이스 및 사용자 생성
CREATE DATABASE webapp_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '123123';
FLUSH PRIVILEGES;
EXIT;
```

---

## 3. 프로젝트 클론

```bash
git clone <repository-url> django-web-project
cd django-web-project
```

---

## 4. 백엔드 설정

```bash
# backend 폴더로 이동
cd backend

# Python 가상환경 생성
python3 -m venv venv

# 가상환경 활성화
source venv/bin/activate

# 패키지 설치
pip install --upgrade pip
pip install -r requirements.txt

# 데이터베이스 마이그레이션
python3 manage.py migrate

# 관리자 계정 생성 (선택)
python3 manage.py createsuperuser

# 프로젝트 루트로 복귀
cd ..
```

---

## 5. 프론트엔드 설정

```bash
# frontend 폴더로 이동
cd frontend

# npm 패키지 설치
npm install

# 프로젝트 루트로 복귀
cd ..
```

---

## 6. 서버 실행

### 방법 1: 스크립트 사용

```bash
# 서버 시작
./start.sh

# 서버 종료
./stop.sh
```

### 방법 2: 직접 실행

**터미널 1 - 백엔드:**
```bash
cd backend
source venv/bin/activate
python3 manage.py runserver 0.0.0.0:8218
```

**터미널 2 - 프론트엔드:**
```bash
cd frontend
npm start
```

---

## 7. 접속 확인

| 서비스 | URL |
|--------|-----|
| 프론트엔드 | http://localhost:1218 |
| 백엔드 API | http://localhost:8218/api/ |
| 관리자 페이지 | http://localhost:8218/admin/ |

---

## 8. 포트 정보

| 서비스 | 포트 |
|--------|------|
| 프론트엔드 (React) | 1218 |
| 백엔드 (Django) | 8218 |
| 데이터베이스 (MySQL) | 3306 |

---

## 문제 해결

### pip install 에러 (mysqlclient)
이 프로젝트는 PyMySQL을 사용하므로 mysqlclient 설치 불필요

### ModuleNotFoundError: No module named 'config'
manage.py에 이미 경로 설정이 되어있음. venv 활성화 확인:
```bash
source venv/bin/activate
```

### ALLOWED_HOSTS 에러
외부 IP로 접속 시 `backend/config/settings.py`에 IP 추가:
```python
ALLOWED_HOSTS = [..., 'your-ip-address']
```

### 프록시 연결 실패 (504 에러)
백엔드를 0.0.0.0으로 실행해야 외부 접속 가능:
```bash
python3 manage.py runserver 0.0.0.0:8218
```

---

## Docker 사용 (선택)

Docker를 사용하려면:

```bash
docker compose up -d
```

접속: http://localhost:3000
