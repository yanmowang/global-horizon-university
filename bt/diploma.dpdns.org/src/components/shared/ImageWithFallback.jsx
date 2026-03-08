import React, { useState, useEffect } from 'react';

/**
 * 带错误处理的图片组件
 * @param {Object} props 组件属性
 * @param {string} props.src 图片源URL
 * @param {string} props.alt 图片替代文本
 * @param {string} props.fallbackSrc 图片加载失败时的替代图片
 * @param {string} props.className 额外的CSS类
 * @param {Function} props.onError 图片加载错误时的回调函数
 * @returns {JSX.Element} 图片组件
 */
const ImageWithFallback = ({
  src,
  alt,
  fallbackSrc = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" fill="#f8f9fa" stroke="#e9ecef" stroke-width="2"/>
  <text x="100" y="100" font-family="Arial, sans-serif" font-size="14" text-anchor="middle" fill="#adb5bd">Image not available</text>
</svg>
`)}`,
  className = '',
  onError,
  ...rest
}) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState(src);

  // 当src改变时重置状态
  useEffect(() => {
    setImgSrc(src);
    setError(false);
    setLoaded(false);
  }, [src]);

  const handleError = e => {
    console.error(`Failed to load image: ${imgSrc}`);
    setError(true);

    // 阻止无限循环
    e.target.onerror = null;

    // 应用fallback图片，如果fallback也失败，则使用系统默认fallback
    if (fallbackSrc && imgSrc !== fallbackSrc) {
      console.log(`Attempting to load fallback image: ${fallbackSrc}`);
      setImgSrc(fallbackSrc);
      // fallback图片已经在setImgSrc和useEffect中处理，不需要这里设置
    } else if (imgSrc === fallbackSrc) {
      // 如果fallback图片也失败了，显示纯色背景和错误文本
      console.error(`Fallback image also failed to load: ${fallbackSrc}`);
    }

    // 调用外部错误处理函数
    if (onError) onError(e);
  };

  const handleLoad = () => {
    setLoaded(true);
  };

  return (
    <div className={`image-container ${!loaded && !error ? 'image-loading' : ''}`}>
      {!loaded && !error && (
        <div className="loading-placeholder flex items-center justify-center w-full h-full bg-gray-100 min-h-[100px]">
          <svg
            className="animate-spin h-8 w-8 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      )}

      {error && imgSrc === fallbackSrc && (
        <div className="error-placeholder flex items-center justify-center w-full h-full bg-gray-100 min-h-[100px]">
          <div className="text-center p-4">
            <svg
              className="mx-auto h-10 w-10 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-700">{alt || '图片加载失败'}</p>
          </div>
        </div>
      )}

      <img
        src={imgSrc}
        alt={alt}
        className={`${className} ${error && imgSrc === fallbackSrc ? 'hidden' : ''}`}
        onError={handleError}
        onLoad={handleLoad}
        style={{ display: loaded || (error && imgSrc !== fallbackSrc) ? 'block' : 'none' }}
        {...rest}
      />
    </div>
  );
};

export default ImageWithFallback;
