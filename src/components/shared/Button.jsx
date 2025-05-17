import React from 'react';
import { Link } from 'react-router-dom';

/**
 * 通用按钮组件 - 支持普通按钮和链接按钮
 * @param {Object} props
 * @param {string} props.variant - 按钮样式变体 (primary, secondary, outline, link)
 * @param {string} props.size - 按钮大小 (sm, md, lg)
 * @param {string} props.href - 链接URL (如果提供，则渲染为Link组件)
 * @param {string} props.to - React Router路径 (如果提供，则渲染为Link组件)
 * @param {boolean} props.fullWidth - 是否占满父元素宽度
 * @param {string} props.className - 额外的CSS类
 * @returns {JSX.Element}
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  href,
  to,
  fullWidth = false,
  className = '',
  ...props
}) => {
  // 按钮基础样式
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-md shadow-sm focus:outline-none transition-colors duration-300';

  // 尺寸样式
  const sizeStyles = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  // 变体样式
  const variantStyles = {
    primary:
      'text-white bg-[#003087] hover:bg-blue-900 focus:ring-2 focus:ring-offset-2 focus:ring-blue-600',
    secondary:
      'text-white bg-[#D4A017] hover:bg-yellow-700 focus:ring-2 focus:ring-offset-2 focus:ring-yellow-600',
    outline:
      'text-[#003087] bg-white border border-[#003087] hover:bg-blue-50 focus:ring-2 focus:ring-offset-2 focus:ring-blue-600',
    link: 'text-[#003087] bg-transparent hover:bg-blue-50 underline',
  };

  // 宽度样式
  const widthStyles = fullWidth ? 'w-full' : '';

  // 组合所有样式
  const buttonStyles = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyles} ${className}`;

  // 如果提供了href，渲染为普通链接
  if (href) {
    return (
      <a href={href} className={buttonStyles} {...props}>
        {children}
      </a>
    );
  }

  // 如果提供了to，渲染为React Router链接
  if (to) {
    return (
      <Link to={to} className={buttonStyles} {...props}>
        {children}
      </Link>
    );
  }

  // 否则渲染为普通按钮
  return (
    <button className={buttonStyles} {...props}>
      {children}
    </button>
  );
};

export default Button;
