/**
 * API 서비스
 * - 백엔드 API와 통신하는 함수들을 정의합니다.
 * - axios를 사용하여 HTTP 요청을 보냅니다.
 * - JWT 토큰을 자동으로 헤더에 포함시킵니다.
 */

import axios from 'axios';

// API 기본 URL 설정
// Docker 환경: REACT_APP_API_URL 환경 변수 사용
// 로컬 개발: 프록시 사용 (/api/)
const API_URL = process.env.REACT_APP_API_URL || '/api/';

// axios 인스턴스 생성
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: 토큰을 헤더에 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 토큰 만료 시 갱신
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(`${API_URL}/token/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        localStorage.setItem('access_token', access);

        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// =====================================
// 인증 관련 API
// =====================================

export const authAPI = {
  // 로그인
  login: async (email, password) => {
    const response = await api.post('token/', { email, password });
    return response.data;
  },

  // 회원가입
  register: async (userData) => {
    const response = await api.post('accounts/register/', userData);
    return response.data;
  },

  // 프로필 조회
  getProfile: async () => {
    const response = await api.get('accounts/profile/');
    return response.data;
  },

  // 프로필 수정
  updateProfile: async (data) => {
    const response = await api.patch('accounts/profile/', data);
    return response.data;
  },

  // 비밀번호 변경
  changePassword: async (oldPassword, newPassword) => {
    const response = await api.post('accounts/change-password/', {
      old_password: oldPassword,
      new_password: newPassword,
    });
    return response.data;
  },
};

// =====================================
// 게시글 관련 API
// =====================================

export const postAPI = {
  // 게시글 목록
  getList: async (params = {}) => {
    const response = await api.get('posts/', { params });
    return response.data;
  },

  // 게시글 상세
  getDetail: async (id) => {
    const response = await api.get(`posts/${id}/`);
    return response.data;
  },

  // 게시글 생성
  create: async (data) => {
    const response = await api.post('posts/', data);
    return response.data;
  },

  // 게시글 수정
  update: async (id, data) => {
    const response = await api.patch(`posts/${id}/`, data);
    return response.data;
  },

  // 게시글 삭제
  delete: async (id) => {
    const response = await api.delete(`posts/${id}/`);
    return response.data;
  },

  // 파일 업로드
  uploadFile: async (postId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`posts/${postId}/upload_file/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // 검색
  search: async (query) => {
    const response = await api.get('search/', { params: { q: query } });
    return response.data;
  },
};

// =====================================
// 카테고리 관련 API
// =====================================

export const categoryAPI = {
  getList: async () => {
    const response = await api.get('categories/');
    return response.data;
  },
};

// =====================================
// 댓글 관련 API
// =====================================

export const commentAPI = {
  getList: async (postId) => {
    const response = await api.get(`posts/${postId}/comments/`);
    return response.data;
  },

  create: async (postId, content) => {
    const response = await api.post(`posts/${postId}/comments/`, { content });
    return response.data;
  },

  delete: async (postId, commentId) => {
    const response = await api.delete(`posts/${postId}/comments/${commentId}/`);
    return response.data;
  },
};

export default api;
