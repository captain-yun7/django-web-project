/**
 * PostDetail 페이지
 * - 게시글 상세 내용을 표시합니다.
 * - 댓글 목록과 작성 기능을 제공합니다.
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postAPI, commentAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const data = await postAPI.getDetail(id);
      setPost(data);
    } catch (error) {
      console.error('게시글 로드 실패:', error);
      alert('게시글을 찾을 수 없습니다.');
      navigate('/posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      await postAPI.delete(id);
      alert('삭제되었습니다.');
      navigate('/posts');
    } catch (error) {
      alert('삭제에 실패했습니다.');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    setSubmitting(true);
    try {
      await commentAPI.create(id, commentContent);
      setCommentContent('');
      fetchPost(); // 댓글 목록 갱신
    } catch (error) {
      alert('댓글 작성에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCommentDelete = async (commentId) => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return;

    try {
      await commentAPI.delete(id, commentId);
      fetchPost();
    } catch (error) {
      alert('댓글 삭제에 실패했습니다.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR');
  };

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  if (!post) {
    return <div className="card">게시글을 찾을 수 없습니다.</div>;
  }

  const isAuthor = user && user.id === post.author;

  return (
    <div className="post-detail-page">
      <div className="card">
        <h2>{post.title}</h2>
        <div className="post-meta" style={{ marginTop: '10px', paddingBottom: '15px', borderBottom: '1px solid #eee' }}>
          <span>작성자: {post.author_name}</span>
          <span style={{ margin: '0 10px' }}>|</span>
          <span>조회수: {post.views}</span>
          <span style={{ margin: '0 10px' }}>|</span>
          <span>{formatDate(post.created_at)}</span>
        </div>

        <div style={{ marginTop: '20px', minHeight: '200px', whiteSpace: 'pre-wrap' }}>
          {post.content}
        </div>

        {/* 첨부파일 */}
        {post.attachments && post.attachments.length > 0 && (
          <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #eee' }}>
            <h4>첨부파일</h4>
            <ul>
              {post.attachments.map((file) => (
                <li key={file.id}>
                  <a href={file.file} download>{file.original_name}</a>
                  <span style={{ color: '#666', marginLeft: '10px' }}>
                    ({Math.round(file.file_size / 1024)}KB)
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 버튼 */}
        <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
          <Link to="/posts" className="btn btn-secondary">목록</Link>
          {isAuthor && (
            <>
              <button onClick={handleDelete} className="btn btn-danger">삭제</button>
            </>
          )}
        </div>
      </div>

      {/* 댓글 섹션 */}
      <div className="card" style={{ marginTop: '20px' }}>
        <h3>댓글 ({post.comments?.length || 0})</h3>

        {/* 댓글 작성 폼 */}
        {isAuthenticated ? (
          <form onSubmit={handleCommentSubmit} style={{ marginTop: '15px' }}>
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="댓글을 입력하세요"
              style={{ width: '100%', padding: '10px', minHeight: '80px', marginBottom: '10px' }}
            />
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? '작성 중...' : '댓글 작성'}
            </button>
          </form>
        ) : (
          <p style={{ marginTop: '15px', color: '#666' }}>
            댓글을 작성하려면 <Link to="/login">로그인</Link>하세요.
          </p>
        )}

        {/* 댓글 목록 */}
        <div style={{ marginTop: '20px' }}>
          {post.comments && post.comments.length > 0 ? (
            post.comments.map((comment) => (
              <div key={comment.id} style={{ padding: '15px 0', borderTop: '1px solid #eee' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{comment.author_name}</strong>
                  <span style={{ color: '#666', fontSize: '0.9rem' }}>
                    {formatDate(comment.created_at)}
                  </span>
                </div>
                <p style={{ marginTop: '5px' }}>{comment.content}</p>
                {user && user.id === comment.author && (
                  <button
                    onClick={() => handleCommentDelete(comment.id)}
                    style={{ marginTop: '5px', fontSize: '0.8rem', color: '#dc3545', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    삭제
                  </button>
                )}
              </div>
            ))
          ) : (
            <p style={{ color: '#666', marginTop: '15px' }}>댓글이 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
