import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../shared/LoadingSpinner';
import AlertMessage from '../shared/AlertMessage';

const UserCertificatesList = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerUrl, setViewerUrl] = useState('');

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const token = localStorage.getItem('auth_token');

        if (!token) {
          throw new Error('Authentication required');
        }

        const response = await fetch('/api/certificates', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch certificates');
        }

        setCertificates(data.data || []);
      } catch (err) {
        console.error('Fetch certificates error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  const getStatusBadgeClass = status => {
    switch (status) {
      case 'issued':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'revoked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = dateString => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const downloadCertificate = async id => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        alert('需要登录才能下载证书');
        return;
      }

      // 显示下载中提示
      const downloadStartMessage = document.createElement('div');
      downloadStartMessage.innerText = '证书下载中...';
      downloadStartMessage.style.position = 'fixed';
      downloadStartMessage.style.bottom = '20px';
      downloadStartMessage.style.right = '20px';
      downloadStartMessage.style.padding = '10px 15px';
      downloadStartMessage.style.backgroundColor = '#4299e1';
      downloadStartMessage.style.color = 'white';
      downloadStartMessage.style.borderRadius = '4px';
      downloadStartMessage.style.zIndex = '9999';
      document.body.appendChild(downloadStartMessage);

      console.log(`开始下载证书ID: ${id}, 时间戳: ${Date.now()}`);

      // 下载URL
      const downloadUrl = `/api/certificates/${id}/download?token=${encodeURIComponent(token)}&t=${Date.now()}`;

      // 方法1: 使用原生fetch下载
      try {
        console.log('尝试使用fetch方法下载');
        const response = await fetch(downloadUrl, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error(`服务器响应错误: ${response.status} ${response.statusText}`);
        }

        // 检查Content-Type是否为PDF
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/pdf')) {
          console.warn(`服务器返回了非PDF内容: ${contentType}`);
          // 继续尝试，因为有些服务器可能未正确设置content-type
        }

        // 获取blob数据
        const blob = await response.blob();
        if (blob.size === 0) {
          throw new Error('下载的文件为空');
        }

        console.log(`证书文件已下载，大小: ${blob.size} 字节`);

        // 创建下载链接
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `certificate-${id}.pdf`;
        document.body.appendChild(a);
        a.click();

        // 清理
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
          if (a.parentNode) {
            a.parentNode.removeChild(a);
          }
        }, 100);

        console.log('证书下载成功');

        // 显示成功消息
        if (downloadStartMessage.parentNode) {
          downloadStartMessage.parentNode.removeChild(downloadStartMessage);
        }

        const successMessage = document.createElement('div');
        successMessage.innerText = '证书下载成功';
        successMessage.style.position = 'fixed';
        successMessage.style.bottom = '20px';
        successMessage.style.right = '20px';
        successMessage.style.padding = '10px 15px';
        successMessage.style.backgroundColor = '#48bb78';
        successMessage.style.color = 'white';
        successMessage.style.borderRadius = '4px';
        successMessage.style.zIndex = '9999';
        document.body.appendChild(successMessage);

        setTimeout(() => {
          if (successMessage.parentNode) {
            successMessage.parentNode.removeChild(successMessage);
          }
        }, 3000);

        return; // 成功返回
      } catch (fetchError) {
        console.error('Fetch下载失败:', fetchError);
        // 继续尝试其他方法
      }

      // 方法2: 使用iframe方式下载
      console.log('尝试使用iframe方法下载');
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = downloadUrl;
      document.body.appendChild(iframe);

      // 方法3: 使用window.open下载
      setTimeout(() => {
        if (downloadStartMessage.parentNode) {
          console.log('尝试使用window.open方法下载');
          window.open(downloadUrl, '_blank');
        }
      }, 2000);

      // 方法4: 尝试base64下载
      const downloadTimeout = setTimeout(async () => {
        try {
          console.log('尝试使用base64方法下载');
          const response = await fetch(`/api/certificates/${id}/download-base64`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!response.ok) {
            throw new Error(`服务器响应错误: ${response.status}`);
          }

          const result = await response.json();

          if (!result.success) {
            throw new Error(result.message || '获取证书数据失败');
          }

          // 使用base64数据创建下载
          const { base64Data, filename } = result.data;
          const linkSource = `data:application/pdf;base64,${base64Data}`;
          const downloadLink = document.createElement('a');
          downloadLink.href = linkSource;
          downloadLink.download = filename;
          downloadLink.style.display = 'none';
          document.body.appendChild(downloadLink);
          downloadLink.click();

          setTimeout(() => {
            if (downloadLink.parentNode) {
              downloadLink.parentNode.removeChild(downloadLink);
            }
          }, 100);

          console.log('base64方法下载成功');
        } catch (base64Error) {
          console.error('Base64下载失败:', base64Error);
        }
      }, 4000);

      // 最终清理
      setTimeout(() => {
        if (iframe && iframe.parentNode) {
          iframe.parentNode.removeChild(iframe);
        }

        if (downloadStartMessage && downloadStartMessage.parentNode) {
          downloadStartMessage.parentNode.removeChild(downloadStartMessage);
        }

        clearTimeout(downloadTimeout);

        // 显示下载完成或失败提示
        const downloadMessage = document.createElement('div');
        downloadMessage.innerText = '证书下载已完成，请检查您的下载文件夹';
        downloadMessage.style.position = 'fixed';
        downloadMessage.style.bottom = '20px';
        downloadMessage.style.right = '20px';
        downloadMessage.style.padding = '10px 15px';
        downloadMessage.style.backgroundColor = '#48bb78';
        downloadMessage.style.color = 'white';
        downloadMessage.style.borderRadius = '4px';
        downloadMessage.style.zIndex = '9999';
        document.body.appendChild(downloadMessage);

        setTimeout(() => {
          if (downloadMessage.parentNode) {
            downloadMessage.parentNode.removeChild(downloadMessage);
          }
        }, 5000);
      }, 10000);
    } catch (err) {
      console.error('Download certificate error:', err);
      alert('下载证书失败，请重试或联系管理员。错误: ' + err.message);
    }
  };

  // 在线查看证书
  const viewCertificate = id => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        alert('需要登录才能查看证书');
        return;
      }

      // 构建查看URL
      const viewUrl = `/api/certificates/${id}/view?token=${encodeURIComponent(token)}`;

      // 打开证书查看器
      setViewerUrl(viewUrl);
      setViewerOpen(true);
    } catch (err) {
      console.error('证书查看错误:', err);
      alert(`查看证书失败: ${err.message}`);
    }
  };

  // 关闭证书查看器
  const closeViewer = () => {
    setViewerOpen(false);
    setViewerUrl('');
  };

  // 渲染证书列表
  const renderCertificates = () => {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Certificate Number
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Program
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Type
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Issue Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {certificates.map(certificate => (
              <tr key={certificate._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {certificate.certificateNumber || 'Pending'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {certificate.program}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {certificate.certificateType.charAt(0).toUpperCase() +
                    certificate.certificateType.slice(1)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(certificate.status)}`}
                  >
                    {certificate.status.charAt(0).toUpperCase() + certificate.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {certificate.status === 'issued'
                    ? formatDate(certificate.issueDate)
                    : 'Not issued yet'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Link
                      to={`/certificate/${certificate._id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </Link>

                    {certificate.status === 'issued' && (
                      <button
                        onClick={() => downloadCertificate(certificate._id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Download
                      </button>
                    )}

                    {certificate.status === 'issued' && (
                      <button
                        onClick={() => viewCertificate(certificate._id)}
                        className="text-info-600 hover:text-info-900"
                      >
                        View Online
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
          <p className="mt-2 text-gray-700">Loading your certificates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="text-2xl font-bold mb-4">我的证书</h2>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <AlertMessage type="danger" message={error} />
      ) : certificates.length === 0 ? (
        <AlertMessage type="info" message="您还没有任何证书记录" />
      ) : (
        renderCertificates()
      )}

      {/* 证书查看器 */}
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

      {/* 证书查看器样式 */}
      <style jsx>{`
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
    </div>
  );
};

export default UserCertificatesList;
