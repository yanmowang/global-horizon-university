# 郑树网站辅助脚本

本目录包含用于网站开发和维护的辅助脚本。

## 图片资源生成脚本

### 1. 占位图片生成 (generate-placeholders.js)

生成临时占位图片，用于网站开发阶段。

**使用方法:**

```bash
# 安装依赖
npm install canvas fs-extra

# 运行脚本
node scripts/generate-placeholders.js
```

### 2. 从Unsplash下载图片 (download-images.js)

从Unsplash API下载免费图片作为网站素材。

**使用方法:**

```bash
# 安装依赖
npm install axios fs-extra

# 编辑脚本，添加Unsplash API密钥
# 替换 YOUR_UNSPLASH_ACCESS_KEY 为您的API密钥

# 运行脚本
node scripts/download-images.js
```

**注意:** 要使用此脚本，您需要:

1. 在 [Unsplash开发者平台](https://unsplash.com/developers) 注册
2. 创建一个应用并获取API密钥
3. 遵守Unsplash的API使用条款

## 图片资源管理

- 所有图片资源应存放在 `public/images` 目录及其子目录中
- 参考 `public/images/README.md` 了解所需图片的详细信息和要求
- 图片格式应为JPEG(照片)或PNG(需要透明背景的图标和标志)
- 请确保您使用的图片有正确的授权或许可
