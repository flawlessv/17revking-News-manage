const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function(app) {
  app.use(
    '/mmdb',
    createProxyMiddleware({
      target: 'https://p0.pipi.cn',
      changeOrigin: true,
    })
  );
};