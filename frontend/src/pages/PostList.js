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
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' }).replace('. ', '.').replace('.', '');
  };

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  return (
    <div className="board-container">
      <div className="board-header">
        <h2>자유게시판</h2>
        <span style={{ fontSize: '12px', color: '#666' }}>총 {posts.length}개</span>
      </div>

      {posts.length === 0 ? (
        <div className="empty-list">게시글이 없습니다.</div>
      ) : (
        <table className="post-table">
          <thead>
            <tr>
              <th className="num">번호</th>
              <th className="title">제목</th>
              <th className="author">글쓴이</th>
              <th className="date">날짜</th>
              <th className="views">조회</th>
              <th className="likes">좋아요</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td className="num">{post.id}</td>
                <td className="title">
                  <Link to={`/posts/${post.id}`}>
                    {post.title}
                    {post.comment_count > 0 && (
                      <span className="comment-count">[{post.comment_count}]</span>
                    )}
                  </Link>
                </td>
                <td className="author">{post.author_name}</td>
                <td className="date">{formatDate(post.created_at)}</td>
                <td className="views">{post.views}</td>
                <td className="likes">
                  <span className={`like-indicator ${post.likes_count > 0 ? 'has-likes' : ''}`}>
                    ♥ {post.likes_count || 0}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* 검색 */}
      <form onSubmit={handleSearch} className="search-box">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="검색어 입력"
        />
        <button type="submit" className="btn">검색</button>
      </form>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => setPage(1)} disabled={page === 1}>{'<<'}</button>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>{'<'}</button>
          <span className="current">{page}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>{'>'}</button>
          <button onClick={() => setPage(totalPages)} disabled={page === totalPages}>{'>>'}</button>
        </div>
      )}

      {/* 글쓰기 버튼 (플로팅) */}
      <div className="board-actions">
        <Link to="/posts/create" className="btn btn-primary">+</Link>
      </div>
    </div>
  );
};

export default PostList;
