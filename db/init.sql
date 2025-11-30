-- MySQL 초기화 스크립트
-- 이 파일은 데이터베이스가 처음 생성될 때 실행됩니다.

-- 데이터베이스 문자셋 설정
ALTER DATABASE webapp_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 초기 카테고리 데이터 (선택사항 - Django migrate 후 실행됨)
-- 테이블이 존재하는 경우에만 실행
-- INSERT INTO core_category (name, description, created_at) VALUES
-- ('공지사항', '공지사항 게시판', NOW()),
-- ('자유게시판', '자유롭게 글을 작성하세요', NOW()),
-- ('질문/답변', '질문과 답변을 주고받는 게시판', NOW())
-- ON DUPLICATE KEY UPDATE name=name;
