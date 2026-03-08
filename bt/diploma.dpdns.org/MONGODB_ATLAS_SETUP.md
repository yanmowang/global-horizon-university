# MongoDB Atlas 连接指南

## 简介

本指南将帮助您将应用程序连接到MongoDB Atlas云数据库服务。MongoDB Atlas是一个完全托管的云数据库服务，它提供了强大的功能和可扩展性，无需自行管理数据库基础设施。

## 步骤1：创建MongoDB Atlas账户

1. 访问[MongoDB Atlas官网](https://www.mongodb.com/cloud/atlas)并注册一个账户
2. 登录后，创建一个新的组织和项目
3. 点击"Build a Database"创建一个新的集群

## 步骤2：配置数据库集群

1. 选择免费层级(Free Tier)或根据您的需求选择付费方案
2. 选择云服务提供商(AWS, Azure, Google Cloud)和地区(选择离您用户最近的地区)
3. 配置集群设置并点击"Create Cluster"创建集群

## 步骤3：设置数据库访问

1. 在左侧导航栏中，点击"Database Access"创建一个数据库用户

   - 点击"Add New Database User"
   - 选择认证方法(通常是用户名和密码)
   - 设置用户名和密码
   - 设置适当的数据库权限(通常为Atlas admin)
   - 点击"Add User"保存

2. 在左侧导航栏中，点击"Network Access"配置IP访问权限
   - 点击"Add IP Address"
   - 对于开发环境，您可以添加`0.0.0.0/0`允许所有IP访问(不推荐用于生产环境)
   - 对于生产环境，添加您的应用服务器的IP地址
   - 点击"Confirm"保存

## 步骤4：获取连接字符串

1. 在集群视图中，点击"Connect"按钮
2. 选择"Connect your application"
3. 选择"Node.js"作为驱动程序和版本
4. 复制提供的连接字符串，它看起来类似于：
   ```
   mongodb+srv://<username>:<password>@<cluster-address>/<database-name>?retryWrites=true&w=majority
   ```

## 步骤5：配置应用程序

1. 打开项目根目录下的`.env`文件
2. 将连接字符串粘贴到`MONGODB_URI`环境变量中，替换以下内容：

   - `<username>`: 您创建的数据库用户名
   - `<password>`: 您设置的数据库密码
   - `<cluster-address>`: Atlas提供的集群地址
   - `<database-name>`: 您想使用的数据库名称(例如：global-horizon-university)

   最终的连接字符串应该类似于：

   ```
   MONGODB_URI=mongodb+srv://myuser:mypassword@cluster0.abcde.mongodb.net/global-horizon-university?retryWrites=true&w=majority
   ```

## 注意事项

1. **不要将包含真实密码的`.env`文件提交到版本控制系统**
2. 确保您的应用程序中的所有MongoDB连接都使用`MONGODB_URI`环境变量
3. 在生产环境中，确保限制IP访问并使用强密码
4. 定期备份您的数据

## 验证连接

启动应用程序后，检查控制台日志。如果连接成功，您应该看到以下消息：

```
MongoDB connected successfully
```

如果出现连接错误，请检查：

1. 连接字符串是否正确
2. 用户名和密码是否正确
3. IP访问限制是否正确配置
4. 网络连接是否正常

## 故障排除

如果遇到`MongoNetworkError`，可能是由于：

- IP访问限制未正确配置
- 网络连接问题
- 防火墙阻止了连接

如果遇到`MongoError: Authentication failed`，可能是由于：

- 用户名或密码不正确
- 数据库用户没有适当的权限

## 其他资源

- [MongoDB Atlas官方文档](https://docs.atlas.mongodb.com/)
- [Mongoose文档](https://mongoosejs.com/docs/)
- [Node.js MongoDB驱动文档](https://mongodb.github.io/node-mongodb-native/)

# .env.example

PORT=5000
CLIENT_PORT=3000
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=30d
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-address>/<database-name>?retryWrites=true&w=majority
NODE_ENV=development
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@example.com
EMAIL_PASSWORD=your_email_password
EMAIL_FROM_NAME=Global Horizon University
EMAIL_FROM_ADDRESS=noreply@globalhorizonuniversity.com
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret
FRONTEND_URL=http://localhost:3000

# DEPLOYMENT.md

# Global Horizon University - Deployment Guide

This guide provides instructions for deploying the Global Horizon University platform to a production environment.

## Prerequisites

- Node.js (v14 or newer)
- MongoDB Atlas account (see MONGODB_ATLAS_SETUP.md)
- Stripe account for payment processing
- SMTP server for email notifications
- Domain name and hosting provider

## Backend Deployment

### 1. Prepare Environment Variables

Create a `.env` file in the root directory of your backend project with the following variables:

```
REACT_APP_API_URL=https://api.yourdomain.com/api/v1
REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

### 2. Build the Backend

```bash
# Install dependencies
npm install

# Start the server
npm start
```

### 3. Deploy to Hosting Service

You can deploy the backend to services like:

- **Heroku**:

  ```bash
  heroku create your-app-name
  git push heroku main
  ```

- **DigitalOcean App Platform**:

  - Create a new app in DigitalOcean App Platform
  - Connect your GitHub repository
  - Configure environment variables
  - Deploy

- **AWS Elastic Beanstalk**:
  - Install EB CLI
  - Initialize EB environment
  - Deploy application

### 4. Set Up a Process Manager

For Linux/Unix servers, set up PM2:

```bash
# Install PM2
npm install -g pm2

# Start the application
pm2 start server.js --name "global-horizon"

# Ensure PM2 restarts on system reboot
pm2 startup
pm2 save
```

## Frontend Deployment

### 1. Prepare Environment Variables

Create a `.env` file in the root directory of your frontend project:

```
REACT_APP_API_URL=https://api.yourdomain.com/api/v1
REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

### 2. Build the Frontend

```bash
# Install dependencies
npm install

# Create production build
npm run build
```

### 3. Deploy the Frontend

You can deploy the frontend to services like:

- **Netlify**:

  - Connect your GitHub repository
  - Build command: `npm run build`
  - Publish directory: `build`

- **Vercel**:

  - Connect your GitHub repository
  - Configure build settings
  - Deploy

- **AWS S3 + CloudFront**:
  - Create an S3 bucket
  - Upload build files
  - Set up CloudFront distribution

## Domain and SSL Setup

1. **Register Domain**: Purchase a domain through services like Namecheap, GoDaddy, or Google Domains.

2. **Configure DNS**:

   - Point your domain to your hosting provider
   - Set up any required subdomains (e.g., api.yourdomain.com)

3. **Set Up SSL**:
   - Use Let's Encrypt for free SSL certificates
   - Set up SSL certificates on your hosting provider
   - Ensure all traffic is redirected from HTTP to HTTPS

## Monitoring and Maintenance

1. **Set up Monitoring**:

   - Implement services like New Relic, Datadog, or Sentry
   - Set up uptime monitoring

2. **Regular Backups**:

   - Configure automatic MongoDB backups
   - Set up regular application backups

3. **Update Dependencies**:
   - Regularly check for security updates
   - Update dependencies with `npm audit fix`

## Post-Deployment Checklist

- [ ] Verify all API endpoints are working
- [ ] Test user registration and login
- [ ] Test course enrollment
- [ ] Test payment processing
- [ ] Test certificate generation
- [ ] Verify email notifications
- [ ] Check mobile responsiveness
- [ ] Run performance audits using Lighthouse

## Scaling Considerations

- Consider implementing a CDN for static assets
- Set up database indexing for frequently queried fields
- Implement caching strategies for frequently accessed data
- Consider containerization with Docker for easier scaling

## Troubleshooting

If you encounter issues during deployment, check:

1. Application logs
2. MongoDB connection
3. Environment variables
4. Network/firewall settings
5. Domain DNS configuration

For additional support, please refer to the project documentation or contact the development team.

#!/bin/bash

# deploy.sh - Deployment script for Global Horizon University platform

# Exit on error

set -e

echo "Starting deployment process for Global Horizon University..."

# 1. Build the application

echo "Building application..."
npm run build

# 2. Run tests

echo "Running tests..."
npm test

# 3. Check for security vulnerabilities

echo "Checking for security vulnerabilities..."
npm audit

# 4. Deploy to production

echo "Deploying to production..."

# Check which deployment method to use based on arguments

if [ "$1" == "heroku" ]; then
echo "Deploying to Heroku..."
git push heroku main
elif [ "$1" == "digitalocean" ]; then
echo "Deploying to DigitalOcean App Platform..."
doctl apps create-deployment $DIGITALOCEAN_APP_ID
elif [ "$1" == "aws" ]; then
    echo "Deploying to AWS Elastic Beanstalk..."
    eb deploy
else
    echo "Deploying to default server..."
    # Add your custom deployment script here
    # For example, using rsync to upload files to a server
    rsync -avz --exclude 'node_modules' --exclude '.git' -e "ssh -i $SSH_KEY_PATH" ./build/ $SSH_USER@$SSH_HOST:$DEPLOY_PATH
fi

echo "Deployment completed successfully!"

# 运行所有测试

npm test

# 监视模式运行测试

npm run test:watch

# 生成测试覆盖率报告

npm run test:coverage

# 运行端到端测试

npm run test:e2e

# 运行代码检查

npm run lint

# 格式化代码

npm run format
