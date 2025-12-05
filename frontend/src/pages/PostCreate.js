import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const PostCreate = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. 게시글 생성
      const post = await postAPI.create(formData);

      // 2. 파일 업로드 (있는 경우)
      if (files.length > 0) {
        for (const file of files) {
          try {
            await postAPI.uploadFile(post.id, file);
          } catch (uploadErr) {
            console.error('파일 업로드 실패:', uploadErr);
            // 파일 업로드 실패해도 게시글은 생성되었으므로 계속 진행
          }
        }
      }

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
    <div className="write-form">
      <div className="write-form-header">글쓰기</div>
      
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

          <div className="form-row">
            <label>파일 첨부</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.zip"
            />
            {files.length > 0 && (
              <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
                선택된 파일: {files.map(f => f.name).join(', ')}
              </div>
            )}
          </div>
        </form>
      </div>

      <div className="write-form-actions">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          onClick={handleSubmit}
        >
          {loading ? '등록중...' : '등록'}
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => navigate('/posts')}
        >
          취소
        </button>
      </div>
    </div>
  );
};

export default PostCreate;
