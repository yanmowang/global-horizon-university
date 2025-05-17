# 项目样式指南

## 文本颜色规范

为确保最佳可读性和可访问性，请遵循以下文本颜色使用规则：

### 浅色背景上的文本

- 主要文本: `text-gray-900` (#111827)
- 次要文本: `text-gray-700` (#374151)
- 辅助文本: `text-gray-600` (#4B5563)
- 禁用/提示文本: `text-gray-500` (#6B7280)

### 深色背景上的文本

- 主要文本: `text-gray-50` (#F9FAFB)
- 次要文本: `text-gray-100` (#F3F4F6)
- 辅助文本: `text-gray-200` (#E5E7EB)
- 禁用/提示文本: `text-gray-300` (#D1D5DB)

### 颜色对比度要求

所有文本必须符合WCAG 2.1 AA级别的对比度要求:

- 正文文本至少4.5:1
- 大号文本(18pt以上或14pt粗体以上)至少3:1

## 全局样式修复

项目添加了全局样式修复，自动将白色背景上的浅色文本调整为更深的颜色：

```css
/* 在白色背景上的文本颜色修复 */
.bg-white .text-gray-400,
.bg-white .text-gray-500 {
  color: #374151 !important; /* text-gray-700 */
}
```

## 颜色常量

请使用 `src/utils/colors.js` 中定义的颜色常量，而不是直接在组件中使用颜色代码：

```javascript
import colors from '../utils/colors';

// 使用方式
<div style={{ color: colors.text.secondary }}>次要文本</div>;
```

## 图片处理

所有图片应使用 `ImageWithFallback` 组件，以确保在图片加载失败时有适当的后备方案：

```jsx
import ImageWithFallback from '../components/shared/ImageWithFallback';

// 使用方式
<ImageWithFallback
  src="/path/to/image.jpg"
  alt="图片描述"
  className="your-classes"
  fallbackSrc="/images/fallback-image.svg"
/>;
```

## TailwindCSS 提示

- 使用响应式前缀 (`sm:`, `md:`, `lg:`, `xl:`) 构建适应不同屏幕尺寸的界面
- 使用 `hover:`, `focus:`, `active:` 等状态变体添加交互效果
- 使用 `dark:` 变体支持暗色模式

## 可访问性提示

- 确保所有交互元素有足够大的点击区域 (至少44x44px)
- 为所有图片提供有意义的 alt 文本
- 使用语义化HTML元素 (`<button>`, `<a>`, `<h1>-<h6>`, `<nav>`, 等)
- 确保表单元素有关联的标签

提高可访问性不仅帮助残障用户，也提升了所有用户的体验和SEO效果。
