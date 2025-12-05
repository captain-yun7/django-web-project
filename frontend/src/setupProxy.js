const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // 로컬 개발 환경: 백엔드 포트 8218
  const target = process.env.REACT_APP_BACKEND_URL || 'http://127.0.0.1:8218';

  app.use(
    '/api',
    createProxyMiddleware({
      target: target,
      changeOrigin: true,
    })
  );
};
