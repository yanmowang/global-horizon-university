import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
import CertificatesList from './CertificatesList';
import UsersList from './UsersList';
import Statistics from './Statistics';

const AdminDashboard = () => {
  const [currentView, setCurrentView] = useState('overview');
  const [certificates, setCertificates] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalCertificates: 0,
    totalUsers: 0,
    recentCertificates: 0,
    revenue: 0,
  });

  // 添加一个引用来跟踪组件是否已卸载
  const isMounted = useRef(true);

  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // 设置组件加载状态
    isMounted.current = true;
    
    // 确保用户已登录并初始加载数据
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchDashboardData();
    
    // 清理函数，组件卸载时设置标志
    return () => {
      isMounted.current = false;
    };
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // 根据当前视图加载数据
    if (currentView === 'certificates') {
      fetchCertificates();
    } else if (currentView === 'users') {
      fetchUsers();
    }
  }, [currentView]);

  const fetchDashboardData = async () => {
    if (!isMounted.current) return;
    
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get('/api/admin/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // 在设置状态前检查组件是否仍然挂载
      if (isMounted.current) {
        setStats(response.data);
        setLoading(false);
      }
    } catch (error) {
      console.error('Dashboard data fetch error:', error);
      
      // 只有在组件仍然挂载时才更新状态
      if (isMounted.current) {
        // 如果是权限错误，重定向到未授权页面
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          navigate('/unauthorized');
        } else {
          setError('获取仪表板数据时出错');
          // 如果API不可用，使用模拟数据
          setStats({
            totalCertificates: 156,
            totalUsers: 89,
            recentCertificates: 24, 
            revenue: 7850
          });
          setLoading(false);
        }
      }
    }
  };

  const fetchCertificates = async () => {
    if (!isMounted.current) return;
    
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get('/api/admin/certificates', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // 在设置状态前检查组件是否仍然挂载
      if (isMounted.current) {
        setCertificates(response.data);
        setLoading(false);
      }
    } catch (error) {
      console.error('Certificates fetch error:', error);
      
      // 只有在组件仍然挂载时才更新状态
      if (isMounted.current) {
        // 如果是权限错误，重定向到未授权页面
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          navigate('/unauthorized');
        } else {
          setError('获取证书数据时出错');
          // 使用模拟数据
          setCertificates([
            {
              _id: '1',
              certificateNumber: 'SIU-2023-1234',
              recipientName: 'John Doe',
              program: 'MBA',
              issueDate: '2023-06-15',
              status: 'issued',
            },
            {
              _id: '2',
              certificateNumber: 'SIU-2023-5678',
              recipientName: 'Jane Smith',
              program: 'BSc',
              issueDate: '2023-07-22',
              status: 'issued',
            },
            {
              _id: '3',
              certificateNumber: 'SIU-2023-9012',
              recipientName: 'Michael Brown',
              program: 'Certificate',
              issueDate: '2023-08-10',
              status: 'pending',
            },
          ]);
          setLoading(false);
        }
      }
    }
  };

  const fetchUsers = async () => {
    if (!isMounted.current) return;
    
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get('/api/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // 在设置状态前检查组件是否仍然挂载
      if (isMounted.current) {
        setUsers(response.data);
        setLoading(false);
      }
    } catch (error) {
      console.error('Users fetch error:', error);
      
      // 只有在组件仍然挂载时才更新状态
      if (isMounted.current) {
        // 如果是权限错误，重定向到未授权页面
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          navigate('/unauthorized');
        } else {
          setError('获取用户数据时出错');
          // 使用模拟数据
          setUsers([
            {
              _id: '1',
              name: 'Admin User',
              email: 'admin@example.com',
              role: 'admin',
              createdAt: '2023-01-15',
            },
            {
              _id: '2',
              name: 'John Doe',
              email: 'john@example.com',
              role: 'user',
              createdAt: '2023-05-20',
            },
            {
              _id: '3',
              name: 'Jane Smith',
              email: 'jane@example.com',
              role: 'user',
              createdAt: '2023-06-10',
            },
          ]);
          setLoading(false);
        }
      }
    }
  };

  const handleViewChange = view => {
    setCurrentView(view);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'overview':
        return <Statistics stats={stats} />;
      case 'certificates':
        return <CertificatesList certificates={certificates} />;
      case 'users':
        return <UsersList users={users} />;
      default:
        return <Statistics stats={stats} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl font-semibold text-blue-900">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar currentView={currentView} onViewChange={handleViewChange} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminNavbar user={currentUser} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              {currentView === 'overview' && 'Dashboard Overview'}
              {currentView === 'certificates' && 'Certificates Management'}
              {currentView === 'users' && 'Users Management'}
            </h1>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-md">
                {error}
              </div>
            )}

            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
