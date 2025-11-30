/**
 * PostList 페이지
 * - 게시글 목록을 표시합니다.
 * - 검색 기능을 제공합니다.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postAPI } from '../services/api';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await postAPI.getList({ page });
      setPosts(data.results || data);
      if (data.count) {
        setTotalPages(Math.ceil(data.count / 10));
      }
    } catch (error) {
      console.error('게시글 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchPosts();
      return;
    }
    setLoading(true);
    try {
      const data = await postAPI.search(searchQuery);
      setPosts(data.results || data);
    } catch (error) {
      console.error('검색 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
  };

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  return (
    <div className="post-list-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>게시판</h2>
        <Link to="/posts/create" className="btn btn-primary">글쓰기</Link>
      </div>

      {/* 검색 폼 */}
      <form onSubmit={handleSearch} className="search-box">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="검색어를 입력하세요"
        />
        <button type="submit" className="btn btn-primary">검색</button>
      </form>

      {/* 게시글 목록 */}
      {posts.length === 0 ? (
        <div className="card">
          <p style={{ textAlign: 'center' }}>게시글이 없습니다.</p>
        </div>
      ) : (
        <ul className="post-list">
          {posts.map((post) => (
            <li key={post.id} className="post-item">
              <Link to={`/posts/${post.id}`}>
                <h3>{post.title}</h3>
              </Link>
              <div className="post-meta">
                <span>작성자: {post.author_name}</span>
                <span style={{ margin: '0 10px' }}>|</span>
                <span>조회수: {post.views}</span>
                <span style={{ margin: '0 10px' }}>|</span>
                <span>댓글: {post.comment_count}</span>
                <span style={{ margin: '0 10px' }}>|</span>
                <span>{formatDate(post.created_at)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            이전
          </button>
          <span>{page} / {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
};

export default PostList;
