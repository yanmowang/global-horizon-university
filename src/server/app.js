const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

// 导入路由
const authRoutes = require('./routes/authRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const adminRoutes = require('./routes/adminRoutes');

// 初始化express应用
const app = express();

// 中间件
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3001',
      'https://diploma.dpdns.org',  // 添加您的新域名
      'http://diploma.dpdns.org',   // 同时添加HTTP版本
      'https://leafy-swan-1b3792.netlify.app' // 添加Netlify默认域名
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  })
);
app.use(morgan('dev')); // 日志记录
app.use(bodyParser.json()); // 解析JSON请求体
app.use(bodyParser.urlencoded({ extended: true })); // 解析URL编码的请求体
app.use(cookieParser()); // 解析cookies

// 静态文件夹
app.use(
  express.static(path.join(__dirname, '../../build'), {
    maxAge: '1d', // 设置缓存时间为1天
    etag: true,
    lastModified: true,
  })
);

// 提供证书PDF文件
app.use(
  '/certificates',
  express.static(path.join(__dirname, '../../public/certificates'), {
    maxAge: '1h',
    etag: true,
  })
);

// 提供签名和其他图片
app.use(
  '/images',
  express.static(path.join(__dirname, '../../public/images'), {
    maxAge: '1d',
    etag: true,
  })
);

// API路由
app.use('/api/auth', authRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/admin', adminRoutes);

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: '服务器错误',
    error: process.env.NODE_ENV === 'production' ? null : err.message,
  });
});

// 提供React应用程序的任何其他路由
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../build', 'index.html'));
});

// 导出app对象，但不启动服务器
// 服务器将在server.js中启动
module.exports = app;
