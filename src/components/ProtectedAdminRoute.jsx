import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const ProtectedAdminRoute = ({ children }) => {
  const { currentUser, isAuthenticated, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [localAuth, setLocalAuth] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const location = useLocation();

  // 检查本地存储的令牌和管理员状态
  useEffect(() => {
    const checkLocalAuth = () => {
      const token = localStorage.getItem('auth_token');
      const userStr = localStorage.getItem('user');
      const isAdminStr = localStorage.getItem('isAdmin');
      
      if (token && userStr && isAdminStr === 'true') {
        try {
          const userData = JSON.parse(userStr);
          if (userData && userData._id && userData.role === 'admin') {
            setLocalAuth(true);
          }
        } catch (e) {
          console.error('解析用户数据出错:', e);
        }
      }
    };
    
    checkLocalAuth();
  }, []);

  // 检查管理员权限
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!isAuthenticated && !localAuth) {
        setCheckingAdmin(false);
        return;
      }

      try {
        // 获取令牌
        const token = localStorage.getItem('auth_token');
        
        if (!token) {
          setIsAdmin(false);
          setCheckingAdmin(false);
          return;
        }
        
        const response = await axios.get('/api/admin/check-admin', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.isAdmin) {
          setIsAdmin(true);
          // 更新本地存储
          localStorage.setItem('isAdmin', 'true');
        } else {
          setIsAdmin(false);
          localStorage.setItem('isAdmin', 'false');
        }
      } catch (error) {
        console.error('检查管理员权限失败:', error);
        setIsAdmin(false);
        setErrorMessage('无法验证管理员权限，请重新登录');
      } finally {
        setCheckingAdmin(false);
      }
    };

    checkAdminStatus();
  }, [isAuthenticated, localAuth]);

  // 加载状态
  if (loading || checkingAdmin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-semibold text-blue-900">
          正在验证管理员权限...
        </div>
      </div>
    );
  }

  // 处理认证错误
  if (errorMessage) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-xl font-semibold text-red-600 mb-4">
          {errorMessage}
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

  // 如果未登录，重定向到登录页面
  if (!isAuthenticated && !localAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 如果不是管理员，重定向到未授权页面
  if (!isAdmin) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // 通过所有验证，显示子组件
  return children;
};

export default ProtectedAdminRoute; 