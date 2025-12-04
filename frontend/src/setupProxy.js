const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Docker 환경이면 backend, 로컬이면 127.0.0.1
  const target = process.env.REACT_APP_BACKEND_URL || 'http://127.0.0.1:8000';

  app.use(
    '/api',
    createProxyMiddleware({
      target: target,
      changeOrigin: true,
    })
  );
};
