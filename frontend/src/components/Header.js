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
          <Link to="/posts">자유게시판</Link>
        </h1>
        <nav>
          <Link to="/posts">글목록</Link>
          {isAuthenticated ? (
            <>
              <Link to="/posts/create">글쓰기</Link>
              <span style={{ color: '#fff', fontSize: '12px' }}>{user?.username}</span>
              <button onClick={handleLogout}>로그아웃</button>
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
