/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        blue: {
          900: '#3e86cc', // Primary blue - 更浅且饱和度降低的蓝色
        },
        gold: {
          500: '#D4A017', // Accent gold
        },
        gray: {
          900: '#111827', // 确保灰色文本足够深
        },
      },
      fontFamily: {
        sans: ['Noto Sans SC', 'Open Sans', 'sans-serif'],
        serif: ['Lora', 'serif'],
      },
      textColor: {
        DEFAULT: '#111827', // 默认文本颜色设为深色
      },
    },
  },
  plugins: [],
  // 添加重要标记确保优先级
  important: true,
};
