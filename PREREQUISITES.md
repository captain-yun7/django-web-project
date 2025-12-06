# Ubuntu 초기 설치 가이드

Ubuntu 24.04 처음 설치 후 이 프로젝트를 실행하기 위해 필요한 패키지들입니다.

---

## 한 줄 설치 (권장)

```bash
sudo apt update && sudo apt install -y python3 python3-pip python3-venv nodejs npm mysql-server git
```

---

## 개별 설치

### 1. 시스템 업데이트

```bash
sudo apt update
sudo apt upgrade -y
```

### 2. Python (Django 백엔드용)

```bash
sudo apt install -y python3 python3-pip python3-venv
```

### 3. Node.js (React 프론트엔드용)

```bash
sudo apt install -y nodejs npm
```

### 4. MySQL (데이터베이스)

```bash
# MySQL
sudo apt install -y mysql-server

# 또는 MariaDB
sudo apt install -y mariadb-server
```

### 5. Git (소스코드 관리)

```bash
sudo apt install -y git
```

---

## 설치 확인

```bash
python3 --version    # Python 3.12+
node --version       # v18+
npm --version        # 10+
mysql --version      # 8.0+
git --version        # 2.43+
```

---

## 다음 단계

패키지 설치 완료 후:

1. 프로젝트 클론
   ```bash
   git clone <repository-url> django-web-project
   cd django-web-project
   ```

2. 환경 설정
   ```bash
   ./setup.sh
   ```

3. 서버 실행
   ```bash
   ./start.sh
   ```

자세한 설치 방법은 [INSTALL.md](INSTALL.md)를 참고하세요.
