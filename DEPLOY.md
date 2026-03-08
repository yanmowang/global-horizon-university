# 部署指南 (Deployment Guide)

本项目可以轻松部署到免费的在线平台。推荐使用 **Render** 或 **Vercel**。

## 方案 1: 部署到 Render (推荐)
Render 非常适合这种 Express + React 的全栈应用。

**方法 A: 使用 Render Blueprint (最简单)**
1. 将代码推送到 GitHub/GitLab。
2. 在 Render Dashboard 点击 **New +** -> **Blueprint**。
3. 连接你的仓库。
4. Render 会自动识别 `render.yaml` 配置文件。
5. 点击 **Apply** 即可自动部署。

**方法 B: 手动配置**
1. 注册并登录 [Render.com](https://render.com)。
2. 点击 **New +** -> **Web Service**。
3. 连接你的 GitHub/GitLab 仓库。
4. 配置如下：
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. 点击 **Deploy**。

**注意**: 
- Render 的免费实例会在闲置 15 分钟后休眠，再次访问时启动需要约 1 分钟。
- 由于使用了内存数据库（如果没有配置 `MONGODB_URI`），每次实例重启数据都会重置。

## 方案 2: 部署到 Vercel
Vercel 更适合前端应用，但也支持 Serverless Function。

1. 安装 Vercel CLI: `npm i -g vercel`
2. 在项目根目录运行: `vercel`
3. 按照提示操作，大部分设置保持默认即可。

## 环境变量
无论使用哪个平台，建议在平台的 Dashboard 中配置以下环境变量（Environment Variables）：
- `MONGODB_URI`: 你的 MongoDB 连接字符串（推荐使用 MongoDB Atlas）。
- `JWT_SECRET`: 用于加密 Token 的随机字符串。
- `NODE_ENV`: `production`

## 关于数据库
当前项目配置了**内存数据库**作为备用。这意味着如果你不配置 `MONGODB_URI`，网站也能运行，但**所有数据（注册用户、证书等）在网站重启或重新部署后都会消失**。
建议去 [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) 申请一个免费的数据库集群。
