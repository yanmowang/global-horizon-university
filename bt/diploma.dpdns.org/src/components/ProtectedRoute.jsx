import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, currentUser } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const [localAuth, setLocalAuth] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // 检查本地存储的令牌状态
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        // 尝试解析用户数据
        const userData = JSON.parse(userStr);
        if (userData && userData._id) {
          setLocalAuth(true);
        }
      } catch (e) {
        console.error('解析用户数据出错:', e);
      }
    }
    
    setIsChecking(false);
  }, []);

  // 等待认证状态加载完成和本地检查完成
  if (loading || isChecking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-semibold text-blue-900">
          正在验证身份...
        </div>
      </div>
    );
  }

  // 1. 如果认证已通过，直接显示子组件
  if (isAuthenticated && currentUser) {
    return children;
  }
  
  // 2. 如果认证未通过但本地有令牌和用户数据，可能是状态不同步
  if (!isAuthenticated && localAuth) {
    // 不要使用window.location.reload()来避免刷新循环
    // 相反，尝试使用React状态来处理
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-xl font-semibold text-blue-900 mb-4">
          登录状态已过期，请重新登录
        </div>
        <button 
          onClick={() => window.location.href = '/login'} 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          返回登录页面
        </button>
      </div>
    );
  }
  
  // 3. 如果既没有认证也没有本地令牌，重定向到登录页面
  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute; 