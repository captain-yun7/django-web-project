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
      fetchPost();
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

  const handleLike = async () => {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      return;
    }
    try {
      const result = await postAPI.like(id);
      setPost({ ...post, likes_count: result.likes_count, is_liked: result.liked });
    } catch (error) {
      alert('좋아요 처리에 실패했습니다.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  if (!post) {
    return <div className="empty-list">게시글을 찾을 수 없습니다.</div>;
  }

  const isAuthor = user && user.id === post.author;

  return (
    <>
      <div className="post-view">
        <div className="post-view-header">
          <h2>{post.title}</h2>
          <div className="post-view-info">
            <span>{post.author_name}</span>
            <span>{formatDate(post.created_at)}</span>
            <span>조회 {post.views}</span>
            <span>좋아요 {post.likes_count || 0}</span>
          </div>
        </div>

        <div className="post-view-content">
          {post.content}
        </div>

        {post.attachments && post.attachments.length > 0 && (
          <div className="post-view-attachments">
            <h4>첨부파일</h4>
            <ul>
              {post.attachments.map((file) => (
                <li key={file.id}>
                  <a href={file.file} download target="_blank" rel="noopener noreferrer">
                    {file.original_name} ({(file.file_size / 1024).toFixed(1)} KB)
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="post-view-actions">
          <Link to="/posts" className="btn">목록</Link>
          <div>
            <button
              onClick={handleLike}
              className={`btn ${post.is_liked ? 'btn-liked' : 'btn-like'}`}
            >
              {post.is_liked ? '♥ 좋아요 취소' : '♡ 좋아요'}
            </button>
            {isAuthor && (
              <>
                <Link to={`/posts/${id}/edit`} className="btn btn-primary">수정</Link>
                <button onClick={handleDelete} className="btn btn-danger">삭제</button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 댓글 */}
      <div className="comment-section">
        <div className="comment-header">
          댓글 {post.comments?.length || 0}개
        </div>

        {isAuthenticated ? (
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="댓글을 입력하세요"
            />
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? '등록중' : '등록'}
            </button>
          </form>
        ) : (
          <div className="login-notice">
            댓글을 작성하려면 <Link to="/login">로그인</Link>하세요.
          </div>
        )}

        {post.comments && post.comments.length > 0 ? (
          <ul className="comment-list">
            {post.comments.map((comment) => (
              <li key={comment.id} className="comment-item">
                <div className="comment-meta">
                  <span className="comment-author">{comment.author_name}</span>
                  <span className="comment-date">{formatDate(comment.created_at)}</span>
                </div>
                <div className="comment-content">{comment.content}</div>
                {user && user.id === comment.author && (
                  <button
                    onClick={() => handleCommentDelete(comment.id)}
                    className="comment-delete"
                  >
                    삭제
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="no-comment">댓글이 없습니다.</div>
        )}
      </div>
    </>
  );
};

export default PostDetail;
