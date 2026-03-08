#!/bin/bash

# 确保目录存在
mkdir -p data logs

# 停止旧容器
docker-compose down

# 构建新镜像
docker-compose build

# 启动容器
docker-compose up -d

# 查看日志
docker-compose logs -f 