/**
 * 全局颜色常量
 * 提供统一的颜色管理，确保UI一致性
 */

// 主色调
export const PRIMARY = {
  light: '#2563eb', // 蓝色 - 600
  main: '#1d4ed8', // 蓝色 - 700
  dark: '#1e40af', // 蓝色 - 800
  contrastText: '#ffffff',
};

// 次要色调
export const SECONDARY = {
  light: '#d4a017', // 金色 - 500
  main: '#b78614', // 金色 - 600
  dark: '#9a7012', // 金色 - 700
  contrastText: '#ffffff',
};

// 文本颜色
export const TEXT = {
  primary: '#111827', // gray-900
  secondary: '#374151', // gray-700
  disabled: '#6b7280', // gray-500
  hint: '#4b5563', // gray-600
};

// 白底页面文本
export const LIGHT_TEXT = {
  primary: TEXT.primary,
  secondary: TEXT.secondary,
  disabled: '#6b7280', // gray-500
  hint: '#4b5563', // gray-600
};

// 深色页面文本
export const DARK_TEXT = {
  primary: '#f9fafb', // gray-50
  secondary: '#f3f4f6', // gray-100
  disabled: '#d1d5db', // gray-300
  hint: '#e5e7eb', // gray-200
};

// 背景色
export const BACKGROUND = {
  paper: '#ffffff',
  default: '#f3f4f6', // gray-100
  light: '#f9fafb', // gray-50
};

// 状态提示色
export const STATUS = {
  success: '#10b981', // green-500
  error: '#ef4444', // red-500
  warning: '#f59e0b', // amber-500
  info: '#3b82f6', // blue-500
};

// 边框颜色
export const BORDER = {
  light: '#e5e7eb', // gray-200
  main: '#d1d5db', // gray-300
  dark: '#9ca3af', // gray-400
};

// 导出默认调色板
export default {
  primary: PRIMARY,
  secondary: SECONDARY,
  text: TEXT,
  lightText: LIGHT_TEXT,
  darkText: DARK_TEXT,
  background: BACKGROUND,
  status: STATUS,
  border: BORDER,
};
