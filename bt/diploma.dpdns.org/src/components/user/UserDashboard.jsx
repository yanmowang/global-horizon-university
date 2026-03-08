import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../shared/LoadingSpinner';
import AlertMessage from '../shared/AlertMessage';
import CertificateGenerator from '../CertificateGenerator';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useTranslation } from 'react-i18next';

const UserDashboard = ({ activeTabProp }) => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const certificateId = queryParams.get('certificateId');
  const statusFilter = queryParams.get('status');

  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilterState, setStatusFilter] = useState(statusFilter);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    issued: 0,
    revoked: 0,
  });
  const [activeTab, setActiveTab] = useState(activeTabProp || 'dashboard');
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [certificateLoading, setCertificateLoading] = useState(false);
  const [certificateError, setCertificateError] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerUrl, setViewerUrl] = useState('');
  
  // 当组件初始化或路由参数改变时更新标签页
  useEffect(() => {
    if (activeTabProp) {
      setActiveTab(activeTabProp);
    }
  }, [activeTabProp]);

  // 如果有status过滤参数，更新标签页为certificates
  useEffect(() => {
    if (statusFilter) {
      setActiveTab('certificates');
      setStatusFilter(statusFilter);
    }
  }, [statusFilter]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('auth_token');

        if (!token) {
          throw new Error('Authentication required');
        }

        // 获取用户的证书
        const response = await fetch('/api/certificates/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        });

        // 尝试解析响应
        let data;
        try {
          const text = await response.text();
          data = text ? JSON.parse(text) : {};
        } catch (parseError) {
          throw new Error('Error parsing server response');
        }

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch certificates');
        }

        // 检查数据格式是否正确
        if (!data.data || !Array.isArray(data.data)) {
          // 设置为空数组，而不是中断
          setCertificates([]);
          setStats({
            total: 0,
            pending: 0,
            issued: 0,
            revoked: 0,
          });
          return;
        }

        // 更新证书列表
        setCertificates(data.data);

        // 计算统计数据
        const calculatedStats = {
          total: data.data.length,
          pending: data.data.filter(cert => cert.status === 'pending').length,
          issued: data.data.filter(cert => cert.status === 'issued').length,
          revoked: data.data.filter(cert => cert.status === 'revoked').length,
        };

        setStats(calculatedStats);
      } catch (err) {
        setError(err.message || 'Server error');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (certificateId) {
      fetchCertificateDetails(certificateId);
      setActiveTab('certificate-details');
    }
  }, [certificateId]);

  const fetchCertificateDetails = async id => {
    try {
      setCertificateLoading(true);
      setCertificateError(null);

      const token = localStorage.getItem('auth_token');

      if (!token) {
        throw new Error('Authentication required');
      }

      // 获取用户的证书
      const response = await fetch(`/api/certificates/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`获取证书失败: ${response.statusText}`);
      }

      // 解析JSON数据
      const data = await response.json();
      setSelectedCertificate(data.data);
    } catch (err) {
      setCertificateError(err.message || 'Failed to load certificate');
    } finally {
      setCertificateLoading(false);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const handleDownloadCertificate = async id => {
    try {
      setDownloadLoading(true);
      const token = localStorage.getItem('auth_token');

      if (!token) {
        throw new Error('需要身份验证');
      }
      
      // 使用API端点而不是直接构建URL，并添加token作为查询参数
      const downloadUrl = `/api/certificates/${id}/download?token=${encodeURIComponent(token)}`;
      
      // 使用iframe方式下载，避免DOM移除错误
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = downloadUrl;
      
      // 设置下载完成或错误后清除iframe
      iframe.onload = () => {
        // 延迟移除iframe，避免过早移除导致下载中断
        setTimeout(() => {
          try {
            if (document.body.contains(iframe)) {
              document.body.removeChild(iframe);
            }
          } catch (e) {
            console.error('移除iframe时出错:', e);
          }
        }, 1000);
      };
      
      // 处理可能的错误
      iframe.onerror = () => {
        alert('下载证书失败，请重试');
      };
      
      // 添加到文档
      document.body.appendChild(iframe);
      
      // 设置超时，确保iframe最终会被移除
      setTimeout(() => {
        try {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        } catch (e) {
          console.error('移除iframe超时处理时出错:', e);
        }
      }, 10000);
    } catch (err) {
      alert(`下载证书失败: ${err.message}`);
    } finally {
      setTimeout(() => {
        setDownloadLoading(false);
      }, 2000);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const handleViewCertificate = async id => {
    try {
      setViewerOpen(true);
      // Construct the URL for the dedicated certificate viewer page
      const certUrl = `/certificate-embed/${id}/simple-modern`; // Using simple-modern as an example template name
      setViewerUrl(certUrl);

      // No need to use window.history.pushState here as the iframe will handle its own navigation to certUrl
    } catch (error) {
      alert('无法查看证书，请稍后再试');
    }
  };

  // 关闭证书查看器
  const closeViewer = () => {
    setViewerOpen(false);
    setViewerUrl('');
  };

  const formatDate = dateString => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadgeClass = status => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'issued':
        return 'bg-green-100 text-green-800';
      case 'revoked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // 新增：SVG转base64工具
  async function svgUrlToBase64(url) {
    const response = await fetch(url);
    const text = await response.text();
    // encodeURIComponent后替换特殊字符，保证兼容性
    const encoded = encodeURIComponent(text).replace(/'/g, '%27').replace(/"/g, '%22');
    return `data:image/svg+xml;utf8,${encoded}`;
  }

  // 英文日期格式
  function formatDateEn(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  // SVG素材base64
  const sealBase64 = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg width="180" height="180" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="300" cy="300" rx="290" ry="280" fill="#D4A017"/>
  <ellipse cx="320" cy="320" rx="270" ry="260" fill="#D4A017" opacity="0.2"/>
  <defs>
    <path id="sealTextPath" d="M300,300 m-220,0 a220,220 0 1,1 440,0 a220,220 0 1,1 -440,0"/>
  </defs>
  <text font-family="Times New Roman" font-size="32" fill="#D4A017" letter-spacing="2">
    <textPath xlink:href="#sealTextPath" startOffset="0">
      STRATFORD INTERNATIONAL UNIVERSITY
    </textPath>
  </text>
  <g transform="translate(300,300) scale(1.2)">
    <polygon points="0,-80 60,-40 60,60 -60,60 -60,-40" fill="#003087" stroke="#D4A017" stroke-width="8"/>
    <rect x="-25" y="-20" width="50" height="30" fill="#FFF" stroke="#D4A017" stroke-width="3"/>
    <rect x="-10" y="-10" width="20" height="20" fill="#003087"/>
    <rect x="-2" y="-30" width="4" height="20" fill="#D4A017"/>
    <polygon points="0,-40 8,-20 -8,-20" fill="#D4A017"/>
  </g>
</svg>
`)}
`;
  // eslint-disable-next-line no-unused-vars
  const watermarkBase64 = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg width="1200" height="900" viewBox="0 0 1200 900" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
      <rect x="0" y="0" width="50" height="50" fill="none" stroke="#FFF5E1" stroke-width="2" opacity="0.1"/>
    </pattern>
  </defs>
  <rect width="1200" height="900" fill="url(#grid)" />
  <g opacity="0.05">
    <polygon points="600,200 800,350 800,800 400,800 400,350" fill="#003087" stroke="#003087" stroke-width="10"/>
    <rect x="550" y="500" width="100" height="80" fill="#FFF" stroke="#003087" stroke-width="5"/>
    <rect x="580" y="520" width="40" height="40" fill="#003087"/>
    <rect x="595" y="470" width="10" height="50" fill="#D4A017"/>
    <polygon points="600,470 610,500 590,500" fill="#D4A017"/>
  </g>
  <text x="600" y="850" font-size="60" fill="#D4A017" opacity="0.2" text-anchor="middle">SIU</text>
</svg>
`)}
`;
  // eslint-disable-next-line no-unused-vars
  const borderDecorBase64 = '';

  // 生成SVG字符串（签名和校徽都用SVG base64，日期英文）
  async function getCertificateSVG(cert) {
    if (!cert) return '';
    const origin = window.location.origin;
    const presidentSign = await svgUrlToBase64(`${origin}/images/signatures/president.svg`);
    const directorSign = await svgUrlToBase64(`${origin}/images/signatures/director.svg`);
    const logoImg = await svgUrlToBase64(`${origin}/images/logo/logo.svg`);
    let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="900" xmlns="http://www.w3.org/2000/svg">
  <!-- 背景水印 -->
  <image x="570" y="750" width="60" height="60" href="${sealBase64}" />
  <!-- 双层边框 -->
  <rect x="30" y="30" width="1140" height="840" fill="none" stroke="#D4A017" stroke-width="8"/>
  <rect x="50" y="50" width="1100" height="800" fill="none" stroke="#B58A3F" stroke-width="3"/>
  <!-- 顶部校徽 -->
  <image x="500" y="50" width="200" height="200" href="${logoImg}" />
  <text x="600" y="300" font-family="Georgia, serif" font-size="40" font-weight="bold" text-anchor="middle" fill="#000000">${t('certificate.universityName')}</text>
  <text x="600" y="360" font-family="Georgia, serif" font-size="36" font-weight="bold" text-anchor="middle" fill="#003087">${t('certificate.completionTitle')}</text>
  <text x="600" y="410" font-family="Georgia, serif" font-size="22" text-anchor="middle" fill="#000000">${t('certificate.certifiesText')}</text>
  <text x="600" y="460" font-family="Georgia, serif" font-size="28" font-weight="bold" font-style="italic" text-anchor="middle" fill="#000000">${cert.recipientName || cert.name || ''}</text>
  <text x="600" y="500" font-family="Georgia, serif" font-size="22" text-anchor="middle" fill="#000000">${t('certificate.requirementsText')}</text>
  <text x="600" y="540" font-family="Georgia, serif" font-size="26" font-weight="bold" font-style="italic" text-anchor="middle" fill="#B58A3F">${cert.program || cert.course || ''}</text>
  <text x="600" y="580" font-family="Georgia, serif" font-size="18" text-anchor="middle" fill="#000000">${t('certificate.rightsText')}</text>
  <text x="600" y="620" font-family="Georgia, serif" font-size="16" text-anchor="middle" fill="#D4A017">${t('certificate.honors')}</text>
  <text x="600" y="660" font-family="Georgia, serif" font-size="16" text-anchor="middle" fill="#000000">${t('certificate.awardedDate')}</text>
  <text x="600" y="690" font-family="Georgia, serif" font-size="20" text-anchor="middle" fill="#000000">${formatDateEn(cert.issueDate || cert.date)}</text>
  <!-- 底部签名和印章 -->
  <line x1="300" y1="780" x2="450" y2="780" stroke="#D4A017" stroke-width="2" />
  <line x1="750" y1="780" x2="900" y2="780" stroke="#D4A017" stroke-width="2" />
  <image x="320" y="750" width="120" height="40" href="${presidentSign}" />
  <image x="760" y="750" width="120" height="40" href="${directorSign}" />
  
  <!-- 优化印章 - 完全重新设计 -->
  <!-- 白色背景圆 - 再次增大并下移 -->
  <circle cx="600" cy="770" r="55" fill="white" />
  <!-- 金色背景圆 - 增大并完全不透明，下移 -->
  <circle cx="600" cy="770" r="52" fill="#D4A017" fill-opacity="1.0"/>
  <!-- 内部装饰圆环 -->
  <circle cx="600" cy="770" r="46" fill="#D4A017" fill-opacity="0.8" stroke="#003087" stroke-width="1" />
  
  <!-- 更大更醒目的内部SIU文字 -->
  <text x="600" y="775" font-family="Georgia, serif" font-size="24" font-weight="bold" text-anchor="middle" fill="#003087">SIU</text>
  
  <!-- 简化印章 - 确保不会溢出 -->
  <g transform="translate(600, 770) scale(0.08)">
    <!-- 环绕印章文字 -->
    <defs>
      <path id="sealTextPath" d="M0,0 m-220,0 a220,220 0 1,1 440,0 a220,220 0 1,1 -440,0"/>
    </defs>
    
    <text font-family="Times New Roman" font-size="26" fill="#003087" letter-spacing="2">
      <textPath href="#sealTextPath" startOffset="0">
        ${t('certificate.universityName')}
      </textPath>
    </text>
  </g>
  
  <text x="375" y="825" font-family="Georgia, serif" font-size="14" text-anchor="middle" fill="#000000">${t('certificate.presidentTitle')}</text>
  <text x="825" y="825" font-family="Georgia, serif" font-size="14" text-anchor="middle" fill="#000000">${t('certificate.directorTitle')}</text>
  
  <!-- 证书编号 - 放置在底部红线圈起来的空白区域 -->
  <text x="600" y="870" font-family="Georgia, serif" font-size="14" text-anchor="middle" fill="#000000">${t('certificate.idLabel')}: ${cert.certificateNumber || cert.certificateId || ''}</text>
</svg>`;
    return svg;
  }

  // 修改PDF导出函数为异步
  const handleDownloadCertificatePDF = async () => {
    if (!selectedCertificate) return;
    // 找到证书详情的容器
    let certDom = document.getElementById('certificate-html-preview');
    if (!certDom) {
      // 动态创建一个隐藏div
      certDom = document.createElement('div');
      certDom.id = 'certificate-html-preview';
      certDom.style.position = 'absolute';
      certDom.style.left = '-9999px';
      certDom.style.top = '0';
      document.body.appendChild(certDom);
    }
    try {
      // 生成SVG字符串（带base64图片）
      const svgStr = await getCertificateSVG(selectedCertificate);
      certDom.innerHTML = `<div>${svgStr}</div>`;
      // 用html2canvas截图
      const canvas = await html2canvas(certDom, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#FFFDF0',
      });
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
        compress: false,
      });
      const imgWidth = 297;
      const imgHeight = 210;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, '', 'FAST');
      pdf.save(
        `${selectedCertificate.recipientName || selectedCertificate.name || t('certificates.generic')}${selectedCertificate.certificateNumber || selectedCertificate.certificateId}.pdf`
      );
    } catch (error) {
      alert(t('certificates.pdfError'));
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <div className="md:flex md:items-center md:justify-between mb-4 px-4 sm:px-0">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              {t('dashboard.tabs.dashboard')}
            </h2>
          </div>
        </div>

        {/* 欢迎信息 */}
        <div className="px-4 sm:px-0">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            {t('dashboard.welcome', {user: currentUser?.name || currentUser?.email?.split('@')[0] || 'User'})}
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            {t('dashboard.overview')}
          </p>
        </div>

        {/* Tab navigation */}
        <div className="border-b border-gray-200 mt-6">
          <nav className="-mb-px flex space-x-8 px-4 sm:px-0">
            <button
              className={`${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('dashboard')}
            >
              {t('dashboard.tabs.dashboard')}
            </button>
            <button
              className={`${
                activeTab === 'generate-certificate'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('generate-certificate')}
            >
              {t('dashboard.tabs.generateCertificate')}
            </button>
            {activeTab === 'certificate-details' && (
              <button className="border-blue-500 text-blue-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                {t('dashboard.tabs.certificateDetails')}
              </button>
            )}
          </nav>
        </div>

        {loading && activeTab === 'dashboard' ? (
          <LoadingSpinner message={t('dashboard.loadingMessage')} />
        ) : error && activeTab === 'dashboard' ? (
          <AlertMessage
            type="error"
            message={{
              title: t('dashboard.failedTitle'),
              details: error,
            }}
          />
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <>
                {/* 统计卡片 */}
                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 px-4 sm:px-0">
                  {/* 总证书数量 */}
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                          <svg
                            className="h-6 w-6 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              {t('dashboard.statistics.totalCertificates')}
                            </dt>
                            <dd>
                              <div className="text-lg font-medium text-gray-900">{stats.total}</div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-4 sm:px-6">
                      <div className="text-sm">
                        <Link
                          to="/user-certificates"
                          className="font-medium text-blue-600 hover:text-blue-500"
                        >
                          {t('dashboard.actions.viewAll')}<span className="sr-only"> certificates</span>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* 待审核证书 */}
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                          <svg
                            className="h-6 w-6 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              {t('dashboard.statistics.pendingApproval')}
                            </dt>
                            <dd>
                              <div className="text-lg font-medium text-gray-900">
                                {stats.pending}
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-4 sm:px-6">
                      <div className="text-sm">
                        <Link
                          to="/user-certificates?status=pending"
                          className="font-medium text-yellow-600 hover:text-yellow-500"
                        >
                          {t('dashboard.actions.viewPending')}<span className="sr-only"> certificates</span>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* 已颁发证书 */}
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                          <svg
                            className="h-6 w-6 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              {t('dashboard.statistics.issuedCertificates')}
                            </dt>
                            <dd>
                              <div className="text-lg font-medium text-gray-900">
                                {stats.issued}
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-4 sm:px-6">
                      <div className="text-sm">
                        <Link
                          to="/user-certificates?status=issued"
                          className="font-medium text-green-600 hover:text-green-500"
                        >
                          {t('dashboard.actions.viewIssued')}<span className="sr-only"> certificates</span>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* 已撤销证书 */}
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
                          <svg
                            className="h-6 w-6 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              {t('dashboard.statistics.revokedCertificates')}
                            </dt>
                            <dd>
                              <div className="text-lg font-medium text-gray-900">
                                {stats.revoked}
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-4 sm:px-6">
                      <div className="text-sm">
                        <Link
                          to="/user-certificates?status=revoked"
                          className="font-medium text-red-600 hover:text-red-500"
                        >
                          {t('dashboard.actions.viewRevoked')}<span className="sr-only"> certificates</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 快速操作 */}
                <div className="mt-8 px-4 sm:px-0">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {t('dashboard.quickActions.title')}
                  </h3>
                  <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg font-medium text-gray-900">{t('dashboard.quickActions.requestCertificate.title')}</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {t('dashboard.quickActions.requestCertificate.description')}
                        </p>
                        <div className="mt-3">
                          <button
                            type="button"
                            onClick={() => setActiveTab('generate-certificate')}
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            {t('dashboard.quickActions.requestCertificate.action')}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg font-medium text-gray-900">Update Profile</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Update your personal information and security settings.
                        </p>
                        <div className="mt-3">
                          <button
                            type="button"
                            onClick={() => navigate('/profile')}
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            View Profile
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg font-medium text-gray-900">Browse Certificates</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          View and manage all your certificates.
                        </p>
                        <div className="mt-3">
                          <button
                            type="button"
                            onClick={() => setActiveTab('certificates')}
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                          >
                            View All
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 最近的证书 */}
                <div className="mt-8 px-4 sm:px-0">
                  <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Recent Certificates
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Your most recently requested or updated certificates.
                      </p>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                      <button
                        type="button"
                        onClick={() => setActiveTab('certificates')}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        View All
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col">
                    <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                      <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                          {certificates.length === 0 ? (
                            <div className="bg-white py-12 text-center">
                              <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1}
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                              <h3 className="mt-2 text-sm font-medium text-gray-900">
                                No certificates found
                              </h3>
                              <p className="mt-1 text-sm text-gray-500">
                                Get started by requesting your first certificate.
                              </p>
                              <div className="mt-6">
                                <button
                                  type="button"
                                  onClick={() => setActiveTab('generate-certificate')}
                                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                  Request Certificate
                                </button>
                              </div>
                            </div>
                          ) : (
                            <table className="min-w-full divide-y divide-gray-300">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th
                                    scope="col"
                                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                  >
                                    Title
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                  >
                                    Status
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                  >
                                    Date
                                  </th>
                                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                    <span className="sr-only">View</span>
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200 bg-white">
                                {certificates.slice(0, 5).map(certificate => (
                                  <tr key={certificate._id}>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                      {certificate.program || t('certificates.unknown')}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                      <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(certificate.status)}`}
                                      >
                                        {certificate.status.charAt(0).toUpperCase() +
                                          certificate.status.slice(1)}
                                      </span>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                      {formatDate(
                                        certificate.updatedAt || certificate.createdAt || new Date()
                                      )}
                                    </td>
                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                      <Link
                                        to={`/certificate/${certificate._id}`}
                                        className="text-blue-600 hover:text-blue-900"
                                      >
                                        View
                                        <span className="sr-only">
                                          , {certificate.program || t('certificates.unknown')}
                                        </span>
                                      </Link>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'generate-certificate' && (
              <div className="mt-6 px-4 sm:px-0">
                <CertificateGenerator />
              </div>
            )}

            {activeTab === 'certificate-details' && (
              <div className="mt-6 px-4 sm:px-0">
                {certificateLoading ? (
                  <LoadingSpinner message="Loading certificate details..." />
                ) : certificateError ? (
                  <AlertMessage
                    type="error"
                    message={{
                      title: 'Failed to load certificate',
                      details: certificateError,
                    }}
                  />
                ) : selectedCertificate ? (
                  <>
                  <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                      <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          Certificate Details
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                          Details and information about your certificate.
                        </p>
                      </div>
                      <div className="btn-group">
                        <button 
                          className="btn btn-primary btn-sm" 
                            onClick={handleDownloadCertificatePDF}
                        >
                            下载PDF证书
                        </button>
                      </div>
                    </div>
                      {/* 证书HTML预览区域（隐藏，仅用于导出PDF） */}
                      <div
                        id="certificate-html-preview"
                        style={{ position: 'absolute', left: '-9999px', top: 0 }}
                      >
                        {/* 直接插入SVG模板，替换占位符 */}
                        <div
                          dangerouslySetInnerHTML={{
                            __html: getCertificateSVG(selectedCertificate),
                          }}
                        />
                      </div>
                    <div className="border-t border-gray-200">
                      <dl>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">证书编号</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              {selectedCertificate.certificateNumber || t('certificates.noAssignedNumber')}
                          </dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">课程/学位</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              {selectedCertificate.program || t('certificates.unspecifiedCourse')}
                          </dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">接收者姓名</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              {selectedCertificate.recipientName || t('certificates.unspecifiedRecipient')}
                          </dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">发布日期</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              {selectedCertificate.issueDate
                                ? formatDate(selectedCertificate.issueDate)
                                : t('certificates.unspecifiedDate')}
                          </dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">状态</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                                selectedCertificate.status || 'pending'
                              )}`}
                            >
                              {selectedCertificate.status 
                                  ? selectedCertificate.status.charAt(0).toUpperCase() +
                                    selectedCertificate.status.slice(1)
                                  : t('certificates.status.pending')}
                            </span>
                          </dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">区块链哈希</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              {selectedCertificate.blockchainHash || t('certificates.notGenerated')}
                          </dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">验证链接</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {selectedCertificate.certificateNumber ? (
                              <a
                                href={`/verify/${selectedCertificate.certificateNumber}`}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                验证此证书
                              </a>
                            ) : (
                                <span className="text-gray-500">{t('certificates.noIdCannotVerify')}</span>
                            )}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                  </>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-gray-500">Certificate not found</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'certificates' && (
              <div className="mt-6 px-4 sm:px-0">
                <div className="sm:flex sm:items-center mb-4">
                  <div className="sm:flex-auto">
                    <h3 className="text-lg font-bold leading-6 text-gray-900">
                      {statusFilterState 
                        ? `${t(`certificates.status.${statusFilterState}`)} ${t('certificates.title')}`
                        : t('certificates.allCertificates')}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {statusFilterState 
                        ? t('certificates.showingStatus', {status: t(`certificates.status.${statusFilterState}`)})
                        : t('certificates.viewAndManage')}
                    </p>
                  </div>
                  <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <button
                      type="button"
                      onClick={() => setActiveTab('generate-certificate')}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Request New Certificate
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3 mb-4">
                  <button
                    onClick={() => {
                      setStatusFilter(null);
                      setActiveTab('certificates');
                    }}
                    className={`px-3 py-1 text-sm font-medium rounded-md ${!statusFilterState ? 'bg-blue-100 text-blue-800 border border-blue-300' : 'bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200'}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => {
                      setStatusFilter('pending');
                      setActiveTab('certificates');
                    }}
                    className={`px-3 py-1 text-sm font-medium rounded-md ${statusFilterState === 'pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' : 'bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200'}`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => {
                      setStatusFilter('issued');
                      setActiveTab('certificates');
                    }}
                    className={`px-3 py-1 text-sm font-medium rounded-md ${statusFilterState === 'issued' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200'}`}
                  >
                    Issued
                  </button>
                  <button
                    onClick={() => {
                      setStatusFilter('revoked');
                      setActiveTab('certificates');
                    }}
                    className={`px-3 py-1 text-sm font-medium rounded-md ${statusFilterState === 'revoked' ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200'}`}
                  >
                    Revoked
                  </button>
                </div>
                
                {loading ? (
                  <LoadingSpinner message="Loading certificates..." />
                ) : error ? (
                  <AlertMessage
                    type="error"
                    message={{
                      title: 'Failed to load certificates',
                      details: error,
                    }}
                  />
                ) : (
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    {certificates.length === 0 || 
                    (statusFilterState &&
                      certificates.filter(cert => cert.status === statusFilterState).length ===
                        0) ? (
                      <div className="bg-white py-12 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                          {statusFilterState 
                            ? t('certificates.noStatusFound', {status: t(`certificates.status.${statusFilterState}`)})
                            : t('certificates.noCertificatesFound')}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {statusFilterState 
                            ? t('certificates.showingStatus', {status: t(`certificates.status.${statusFilterState}`)})
                            : t('certificates.viewAndManage')}
                        </p>
                        <div className="mt-6">
                          <button
                            type="button"
                            onClick={() => setActiveTab('generate-certificate')}
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Request Certificate
                          </button>
                        </div>
                      </div>
                    ) : (
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                            >
                              Title
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                              Status
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                              Date
                            </th>
                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                              <span className="sr-only">View</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {certificates
                            .filter(cert => !statusFilterState || cert.status === statusFilterState)
                            .map(certificate => (
                            <tr key={certificate._id}>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                  {certificate.program || t('certificates.unknown')}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(certificate.status)}`}
                                >
                                  {certificate.status.charAt(0).toUpperCase() +
                                    certificate.status.slice(1)}
                                </span>
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                  {formatDate(
                                    certificate.updatedAt || certificate.createdAt || new Date()
                                  )}
                              </td>
                              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                <Link
                                  to={`/certificate/${certificate._id}`}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                    View
                                    <span className="sr-only">
                                      , {certificate.program || t('certificates.unknown')}
                                    </span>
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {viewerOpen && (
        <div className="certificate-viewer-overlay">
          <div className="certificate-viewer-container">
            <div className="certificate-viewer-header">
              <h5>证书查看器</h5>
              <button className="btn-close" onClick={closeViewer}></button>
            </div>
            <div className="certificate-viewer-body">
              <iframe
                src={viewerUrl}
                title="Certificate Viewer"
                className="certificate-viewer-iframe"
                width="100%"
                height="100%"
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Add the CSS for the certificate viewer */}
      <style>{`
        .certificate-viewer-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.7);
          z-index: 1000;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .certificate-viewer-container {
          width: 90%;
          height: 90%;
          background-color: white;
          border-radius: 8px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
        }
        
        .certificate-viewer-header {
          padding: 10px 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #e0e0e0;
        }
        
        .certificate-viewer-body {
          flex: 1;
          overflow: hidden;
        }
        
        .certificate-viewer-iframe {
          border: none;
        }
      `}</style>
    </>
  );
};

export default UserDashboard;
