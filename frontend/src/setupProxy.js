const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // 로컬 개발 환경: 백엔드 포트 8218
  // 외부 접속 시에도 동작하도록 같은 호스트 사용
  const target = process.env.REACT_APP_BACKEND_URL || 'http://172.22.147.93:8218';

  app.use(
    '/api',
    createProxyMiddleware({
      target: target,
      changeOrigin: true,
      pathRewrite: { '^/api': '/api' },  // /api 경로 유지
    })
  );
};
