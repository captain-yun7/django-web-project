/**
 * Header 컴포넌트
 * - 네비게이션 바를 표시합니다.
 * - 로그인 상태에 따라 다른 메뉴를 보여줍니다.
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-content">
        <h1>
          <Link to="/" style={{ color: 'white' }}>웹 애플리케이션</Link>
        </h1>
        <nav>
          <Link to="/">홈</Link>
          <Link to="/posts">게시판</Link>
          {isAuthenticated ? (
            <>
              <Link to="/posts/create">글쓰기</Link>
              <Link to="/profile">{user?.username}</Link>
              <button onClick={handleLogout} style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer'
              }}>
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link to="/login">로그인</Link>
              <Link to="/register">회원가입</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
