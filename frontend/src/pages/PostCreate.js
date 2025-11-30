/**
 * PostCreate 페이지
 * - 새 게시글 작성 폼을 표시합니다.
 * - 파일 업로드 기능을 제공합니다.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postAPI, categoryAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const PostCreate = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    is_public: true,
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    fetchCategories();
  }, [isAuthenticated, navigate]);

  const fetchCategories = async () => {
    try {
      const data = await categoryAPI.getList();
      setCategories(data.results || data);
    } catch (error) {
      console.error('카테고리 로드 실패:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 게시글 생성
      const postData = { ...formData };
      if (!postData.category) delete postData.category;

      const post = await postAPI.create(postData);

      // 파일 업로드
      for (const file of files) {
        try {
          await postAPI.uploadFile(post.id, file);
        } catch (fileError) {
          console.error('파일 업로드 실패:', fileError);
        }
      }

      alert('게시글이 작성되었습니다.');
      navigate(`/posts/${post.id}`);
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData) {
        const messages = Object.values(errorData).flat().join(' ');
        setError(messages);
      } else {
        setError('게시글 작성에 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-create-page">
      <div className="card">
        <h2 style={{ marginBottom: '20px' }}>새 글 작성</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">제목 *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="제목을 입력하세요"
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">카테고리</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">카테고리 선택</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="content">내용 *</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              placeholder="내용을 입력하세요"
            />
          </div>

          <div className="form-group">
            <label htmlFor="files">첨부파일</label>
            <input
              type="file"
              id="files"
              onChange={handleFileChange}
              multiple
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif"
            />
            <small style={{ color: '#666' }}>
              허용 형식: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, JPG, PNG, GIF (최대 10MB)
            </small>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="is_public"
                checked={formData.is_public}
                onChange={handleChange}
              />
              {' '}공개 게시글
            </label>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? '작성 중...' : '작성하기'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/posts')}
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostCreate;
