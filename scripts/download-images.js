/**
 * 从Unsplash下载图片的脚本
 *
 * 注意：这需要安装依赖 npm install axios fs-extra
 * 要使用此脚本，您需要在Unsplash开发者平台注册并获取API密钥
 * https://unsplash.com/developers
 */

const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');

// 设置Unsplash API密钥
// 替换为您自己的API密钥
const UNSPLASH_ACCESS_KEY = 'YOUR_UNSPLASH_ACCESS_KEY';

// 要下载的图片配置
const imageConfig = [
  // Logo需要自行设计，不从Unsplash下载

  // 课程图片
  { path: 'courses/course-mba.jpg', query: 'business meeting', width: 400, height: 300 },
  { path: 'courses/course-ai.jpg', query: 'artificial intelligence', width: 400, height: 300 },
  { path: 'courses/course-health.jpg', query: 'healthcare', width: 400, height: 300 },
  { path: 'courses/course-finance.jpg', query: 'finance', width: 400, height: 300 },
  { path: 'courses/course-sustainability.jpg', query: 'sustainability', width: 400, height: 300 },
  { path: 'courses/course-cultural.jpg', query: 'cultural heritage', width: 400, height: 300 },

  // 证书图片需要自行设计，不从Unsplash下载

  // 通用图片
  { path: 'general/campus.jpg', query: 'university campus', width: 1200, height: 800 },
  { path: 'general/contact-us.png', query: 'contact office', width: 800, height: 600 },
  { path: 'general/application.png', query: 'application form', width: 800, height: 600 },
  { path: 'general/hero-background.jpg', query: 'education', width: 1920, height: 1080 },
  { path: 'general/about-us.jpg', query: 'university building', width: 1200, height: 800 },
  { path: 'general/faq.jpg', query: 'question answer', width: 800, height: 600 },

  // 历史图片
  { path: 'general/founding.jpg', query: 'vintage university', width: 600, height: 400 },
  { path: 'general/expansion.jpg', query: 'university growth', width: 600, height: 400 },
  { path: 'general/online.jpg', query: 'online education', width: 600, height: 400 },
  { path: 'general/today.jpg', query: 'modern university', width: 600, height: 400 },
];

// 确保目录存在
const ensureDirSync = dirPath => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// 从Unsplash下载图片
async function downloadImage(config) {
  const { path: imgPath, query, width, height } = config;
  const outputPath = path.join(__dirname, '../public/images', imgPath);
  const dir = path.dirname(outputPath);
  ensureDirSync(dir);

  try {
    // 搜索Unsplash图片
    const searchResponse = await axios.get('https://api.unsplash.com/search/photos', {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
      params: {
        query,
        per_page: 1,
        orientation: width > height ? 'landscape' : 'portrait',
      },
    });

    if (searchResponse.data.results.length === 0) {
      console.log(`No images found for query: ${query}`);
      return;
    }

    // 获取图片URL
    const imageUrl = searchResponse.data.results[0].urls.raw + `&w=${width}&h=${height}&fit=crop`;

    // 下载图片
    const imageResponse = await axios({
      method: 'GET',
      url: imageUrl,
      responseType: 'stream',
    });

    // 保存图片
    const writer = fs.createWriteStream(outputPath);
    imageResponse.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        console.log(`Downloaded: ${outputPath}`);
        resolve();
      });
      writer.on('error', reject);
    });
  } catch (error) {
    console.error(`Error downloading ${query}:`, error.message);
  }
}

// 主函数
async function main() {
  if (UNSPLASH_ACCESS_KEY === 'YOUR_UNSPLASH_ACCESS_KEY') {
    console.log('请先设置您的Unsplash API密钥');
    return;
  }

  console.log('开始下载图片...');
  for (const config of imageConfig) {
    await downloadImage(config);
    // 避免超出API速率限制
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  console.log('图片下载完成！');
}

main().catch(console.error);
