/**
 * 生成图片占位符的脚本
 *
 * 这个脚本使用canvas-node或类似库来生成临时占位图像
 * 注意：这需要安装依赖 npm install canvas fs-extra
 */

const fs = require('fs-extra');
const { createCanvas } = require('canvas');
const path = require('path');

// 确保目录存在
const ensureDirSync = dirPath => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// 图片生成配置
const images = [
  // Logo
  {
    path: 'logo/logo.png',
    width: 200,
    height: 80,
    text: 'Logo',
    bgColor: '#003087',
    textColor: '#D4A017',
  },
  {
    path: 'logo/logo-white.png',
    width: 200,
    height: 80,
    text: 'Logo',
    bgColor: '#003087',
    textColor: '#FFFFFF',
  },

  // 课程图片
  {
    path: 'courses/course-mba.jpg',
    width: 400,
    height: 300,
    text: 'MBA 课程',
    bgColor: '#004a99',
    textColor: '#FFFFFF',
  },
  {
    path: 'courses/course-ai.jpg',
    width: 400,
    height: 300,
    text: 'AI 课程',
    bgColor: '#005dba',
    textColor: '#FFFFFF',
  },
  {
    path: 'courses/course-health.jpg',
    width: 400,
    height: 300,
    text: '健康课程',
    bgColor: '#0070db',
    textColor: '#FFFFFF',
  },
  {
    path: 'courses/course-finance.jpg',
    width: 400,
    height: 300,
    text: '金融课程',
    bgColor: '#0084fc',
    textColor: '#FFFFFF',
  },
  {
    path: 'courses/course-sustainability.jpg',
    width: 400,
    height: 300,
    text: '可持续发展课程',
    bgColor: '#0096fd',
    textColor: '#FFFFFF',
  },
  {
    path: 'courses/course-cultural.jpg',
    width: 400,
    height: 300,
    text: '文化遗产课程',
    bgColor: '#0a5592',
    textColor: '#FFFFFF',
  },

  // 证书样本
  {
    path: 'certificates/certificate-sample.jpg',
    width: 800,
    height: 600,
    text: '证书样本',
    bgColor: '#d4b037',
    textColor: '#000000',
  },
  {
    path: 'certificates/certificate-1.jpg',
    width: 400,
    height: 300,
    text: '证书 1',
    bgColor: '#c4a027',
    textColor: '#000000',
  },
  {
    path: 'certificates/certificate-2.jpg',
    width: 400,
    height: 300,
    text: '证书 2',
    bgColor: '#c4a027',
    textColor: '#000000',
  },
  {
    path: 'certificates/certificate-3.jpg',
    width: 400,
    height: 300,
    text: '证书 3',
    bgColor: '#c4a027',
    textColor: '#000000',
  },
  {
    path: 'certificates/certificate-4.jpg',
    width: 400,
    height: 300,
    text: '证书 4',
    bgColor: '#c4a027',
    textColor: '#000000',
  },
  {
    path: 'certificates/certificate-5.jpg',
    width: 400,
    height: 300,
    text: '证书 5',
    bgColor: '#c4a027',
    textColor: '#000000',
  },
  {
    path: 'certificates/certificate-6.jpg',
    width: 400,
    height: 300,
    text: '证书 6',
    bgColor: '#c4a027',
    textColor: '#000000',
  },
  {
    path: 'certificates/certificate-verification.png',
    width: 128,
    height: 128,
    text: '验证',
    bgColor: '#D4A017',
    textColor: '#000000',
  },

  // 通用图片
  {
    path: 'general/campus.jpg',
    width: 1200,
    height: 800,
    text: '校园',
    bgColor: '#002266',
    textColor: '#FFFFFF',
  },
  {
    path: 'general/contact-us.png',
    width: 800,
    height: 600,
    text: '联系我们',
    bgColor: '#003087',
    textColor: '#FFFFFF',
  },
  {
    path: 'general/application.png',
    width: 800,
    height: 600,
    text: '申请流程',
    bgColor: '#003087',
    textColor: '#FFFFFF',
  },
  {
    path: 'general/hero-background.jpg',
    width: 1920,
    height: 1080,
    text: '首页背景',
    bgColor: '#001a4d',
    textColor: '#FFFFFF',
  },
  {
    path: 'general/about-us.jpg',
    width: 1200,
    height: 800,
    text: '关于我们',
    bgColor: '#002a7a',
    textColor: '#FFFFFF',
  },
  {
    path: 'general/faq.jpg',
    width: 800,
    height: 600,
    text: '常见问题',
    bgColor: '#003087',
    textColor: '#FFFFFF',
  },

  // 历史图片
  {
    path: 'general/founding.jpg',
    width: 600,
    height: 400,
    text: '学校成立',
    bgColor: '#001f5c',
    textColor: '#FFFFFF',
  },
  {
    path: 'general/expansion.jpg',
    width: 600,
    height: 400,
    text: '学校扩张',
    bgColor: '#00265c',
    textColor: '#FFFFFF',
  },
  {
    path: 'general/online.jpg',
    width: 600,
    height: 400,
    text: '在线教育',
    bgColor: '#002d5c',
    textColor: '#FFFFFF',
  },
  {
    path: 'general/today.jpg',
    width: 600,
    height: 400,
    text: '今日郑树',
    bgColor: '#00345c',
    textColor: '#FFFFFF',
  },
];

// 生成图片函数
function generatePlaceholder(config) {
  const { path: imgPath, width, height, text, bgColor, textColor } = config;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // 绘制背景
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // 添加文字
  ctx.fillStyle = textColor;
  ctx.font = `bold ${Math.min(width, height) / 10}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);

  // 添加尺寸文字
  ctx.font = `${Math.min(width, height) / 20}px Arial`;
  ctx.fillText(`${width}x${height}`, width / 2, height / 2 + Math.min(width, height) / 8);

  // 保存图片
  const outputPath = path.join(__dirname, '../public/images', imgPath);
  const dir = path.dirname(outputPath);
  ensureDirSync(dir);

  const buffer = canvas.toBuffer('image/jpeg');
  fs.writeFileSync(outputPath, buffer);
  console.log(`Generated: ${outputPath}`);
}

// 主函数
function main() {
  console.log('开始生成占位图像...');
  images.forEach(generatePlaceholder);
  console.log('占位图像生成完成！');
}

main();
