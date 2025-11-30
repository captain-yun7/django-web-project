/**
 * Home 페이지
 * - 메인 페이지를 표시합니다.
 */

import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home">
      <div className="card">
        <h2>웹 애플리케이션에 오신 것을 환영합니다</h2>
        <p style={{ marginTop: '15px', marginBottom: '20px' }}>
          Django + React + MySQL 기반의 3티어 웹 애플리케이션입니다.
        </p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/posts" className="btn btn-primary">게시판 바로가기</Link>
          <Link to="/register" className="btn btn-secondary">회원가입</Link>
        </div>
      </div>

      <h3 style={{ marginBottom: '15px' }}>주요 기능</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
        <div className="card">
          <h4>회원 관리</h4>
          <p>회원가입, 로그인, 프로필 관리</p>
        </div>
        <div className="card">
          <h4>게시판</h4>
          <p>게시글 작성, 수정, 삭제, 조회</p>
        </div>
        <div className="card">
          <h4>파일 업로드</h4>
          <p>게시글에 파일 첨부 기능</p>
        </div>
        <div className="card">
          <h4>검색 기능</h4>
          <p>제목과 내용으로 검색</p>
        </div>
        <div className="card">
          <h4>댓글 기능</h4>
          <p>게시글에 댓글 작성</p>
        </div>
        <div className="card">
          <h4>보안 기능</h4>
          <p>JWT 인증, 로그인 시도 제한</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
