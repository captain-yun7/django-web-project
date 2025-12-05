import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const PostEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    fetchPost();
  }, [id, isAuthenticated, navigate]);

  const fetchPost = async () => {
    try {
      const data = await postAPI.getDetail(id);
      // 작성자 본인인지 확인
      if (user && user.id !== data.author) {
        alert('수정 권한이 없습니다.');
        navigate(`/posts/${id}`);
        return;
      }
      setFormData({
        title: data.title,
        content: data.content,
      });
    } catch (error) {
      console.error('게시글 로드 실패:', error);
      alert('게시글을 찾을 수 없습니다.');
      navigate('/posts');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      await postAPI.update(id, formData);
      alert('수정되었습니다.');
      navigate(`/posts/${id}`);
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData) {
        const messages = Object.values(errorData).flat().join(' ');
        setError(messages);
      } else {
        setError('게시글 수정에 실패했습니다.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  return (
    <div className="write-form">
      <div className="write-form-header">글 수정</div>

      <div className="write-form-body">
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label>제목</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="제목을 입력하세요"
            />
          </div>

          <div className="form-row">
            <label>내용</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              placeholder="내용을 입력하세요"
            />
          </div>
        </form>
      </div>

      <div className="write-form-actions">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={saving}
          onClick={handleSubmit}
        >
          {saving ? '수정중...' : '수정'}
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => navigate(`/posts/${id}`)}
        >
          취소
        </button>
      </div>
    </div>
  );
};

export default PostEdit;
