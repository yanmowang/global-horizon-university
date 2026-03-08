FROM node:16

# 创建应用目录
WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制应用代码
COPY . .

# 暴露3000端口
EXPOSE 3000

# 启动应用
CMD ["node", "server.js"] 