import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // 비밀번호 변경 폼
  const [passwordForm, setPasswordForm] = useState({
    old_password: '',
    new_password: '',
    new_password2: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    fetchProfile();
  }, [isAuthenticated, navigate]);

  const fetchProfile = async () => {
    try {
      const data = await authAPI.getProfile();
      setProfile(data);
    } catch (error) {
      console.error('프로필 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({ ...passwordForm, [name]: value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    // 새 비밀번호 확인
    if (passwordForm.new_password !== passwordForm.new_password2) {
      setPasswordError('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    if (passwordForm.new_password.length < 8) {
      setPasswordError('비밀번호는 8자 이상이어야 합니다.');
      return;
    }

    setChangingPassword(true);
    try {
      await authAPI.changePassword(passwordForm.old_password, passwordForm.new_password);
      setPasswordSuccess('비밀번호가 변경되었습니다.');
      setPasswordForm({
        old_password: '',
        new_password: '',
        new_password2: '',
      });
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData) {
        const messages = Object.values(errorData).flat().join(' ');
        setPasswordError(messages);
      } else {
        setPasswordError('비밀번호 변경에 실패했습니다.');
      }
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  return (
    <div className="profile-container">
      {/* 프로필 정보 */}
      <div className="write-form">
        <div className="write-form-header">내 프로필</div>
        <div className="write-form-body">
          <div className="profile-info">
            <div className="profile-row">
              <span className="profile-label">이메일</span>
              <span className="profile-value">{profile?.email}</span>
            </div>
            <div className="profile-row">
              <span className="profile-label">이름</span>
              <span className="profile-value">{profile?.name || '-'}</span>
            </div>
            <div className="profile-row">
              <span className="profile-label">가입일</span>
              <span className="profile-value">
                {profile?.date_joined ? new Date(profile.date_joined).toLocaleDateString('ko-KR') : '-'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 비밀번호 변경 */}
      <div className="write-form" style={{ marginTop: '20px' }}>
        <div className="write-form-header">비밀번호 변경</div>
        <div className="write-form-body">
          {passwordError && <div className="error-message">{passwordError}</div>}
          {passwordSuccess && <div className="success-message">{passwordSuccess}</div>}

          <form onSubmit={handlePasswordSubmit}>
            <div className="form-row">
              <label>현재 비밀번호</label>
              <input
                type="password"
                name="old_password"
                value={passwordForm.old_password}
                onChange={handlePasswordChange}
                required
                placeholder="현재 비밀번호를 입력하세요"
              />
            </div>

            <div className="form-row">
              <label>새 비밀번호</label>
              <input
                type="password"
                name="new_password"
                value={passwordForm.new_password}
                onChange={handlePasswordChange}
                required
                placeholder="새 비밀번호를 입력하세요 (8자 이상)"
              />
            </div>

            <div className="form-row">
              <label>새 비밀번호 확인</label>
              <input
                type="password"
                name="new_password2"
                value={passwordForm.new_password2}
                onChange={handlePasswordChange}
                required
                placeholder="새 비밀번호를 다시 입력하세요"
              />
            </div>
          </form>
        </div>

        <div className="write-form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={changingPassword}
            onClick={handlePasswordSubmit}
          >
            {changingPassword ? '변경중...' : '비밀번호 변경'}
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => navigate('/posts')}
          >
            돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
