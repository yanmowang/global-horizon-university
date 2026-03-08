const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

// Import routes
const certificateRoutes = require('./routes/certificateRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const authRoutes = require('./routes/authRoutes');
const verificationRoutes = require('./routes/verificationRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// 连接到MongoDB
const connectDB = async () => {
  try {
    // 检查环境变量是否存在
    if (!process.env.MONGODB_URI) {
      console.warn('警告: 未设置MONGODB_URI环境变量，将尝试使用内存数据库');
    } else {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('MongoDB连接成功');
      return;
    }
  } catch (error) {
    console.error('MongoDB连接错误:', error.message);
    console.log('尝试启动内存数据库作为备用...');
  }

  // Fallback to in-memory database
  try {
    // Dynamic import to handle environments where it might not be installed
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    console.log('内存数据库已启动:', uri);
    
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('已成功连接到内存数据库');
  } catch (err) {
    console.error('无法启动内存数据库:', err.message);
    process.exit(1);
  }
};

// Middleware
app.use(
  cors({
    origin: [
      'http://localhost:3000', 
      'http://127.0.0.1:3000', 
      'http://localhost:3001', 
      'http://127.0.0.1:3001',
      'https://diploma.dpdns.org',
      'http://diploma.dpdns.org',
      'https://leafy-swan-1b3792.netlify.app'  // Netlify域名
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  })
);
app.use(morgan('dev')); // 日志记录
app.use(cookieParser()); // 解析cookies

// 特殊处理Stripe webhook
app.use('/api/payment/webhook', (req, res, next) => {
  if (req.originalUrl === '/api/payment/webhook') {
    next();
  } else {
    bodyParser.json()(req, res, next);
  }
});

// 解析请求体
app.use(bodyParser.json()); // 解析JSON请求体
app.use(bodyParser.urlencoded({ extended: true })); // 解析URL编码的请求体

// 静态文件服务
// 从React应用提供静态文件
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
app.use('/api/certificates', certificateRoutes);
app.use('/api/verify', verificationRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// 健康检查端点
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: '服务器正在运行' });
});

// 处理React路由，将所有请求返回到React应用
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../build', 'index.html'));
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: '发生了意外错误',
    error: process.env.NODE_ENV === 'production' ? null : err.message,
  });
});

// 启动服务器函数
const startServer = async () => {
  await connectDB();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`服务器运行在端口 ${PORT}`);
  });
};

// 仅在直接运行时启动服务器
if (require.main === module) {
  startServer();
}

module.exports = app;
