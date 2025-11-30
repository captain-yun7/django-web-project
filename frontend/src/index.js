/**
 * React 앱 진입점
 * - 이 파일은 React 앱의 시작점입니다.
 * - DOM에 App 컴포넌트를 렌더링합니다.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
