import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import certificatesData from '../data/certificate-data';
import CertificateGenerator from '../services/CertificateGenerator';
import { jsPDF } from 'jspdf';
import ImageWithFallback from './shared/ImageWithFallback';
import axios from 'axios';
import CertificateModal from './CertificateModal';
import LoadingSpinner from './shared/LoadingSpinner';
import AlertMessage from './shared/AlertMessage';
import VerificationBadge from './VerificationBadge';
import HtmlCertificate from './HtmlCertificate';

const CertificatesPage = () => {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [processedCertificates, setProcessedCertificates] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState({
    certificateId: null,
    status: null,
    message: '',
  });
  const [showHtmlCertificate, setShowHtmlCertificate] = useState(false);
  const [certificateTemplate, setCertificateTemplate] = useState('high-contrast'); // 默认使用高对比度模板
  const currentLanguage = i18n.language;
  const isEnglish = currentLanguage === 'en' || currentLanguage.startsWith('en-');

  // 处理SVG证书
  useEffect(() => {
    // 为每个证书创建处理后的图像URL
    const processCertificates = async () => {
      // 显示加载状态
      const emptyProcessed = certificatesData.map(cert => ({
        ...cert,
        processedImage: null,
        isLoading: true,
      }));
      setProcessedCertificates(emptyProcessed);

      const processed = await Promise.all(
        certificatesData.map(async cert => {
          try {
            // 使用CertificateGenerator服务的预览方法
            console.log(`开始处理证书: ${cert.id} - ${cert.name}`);

            // 创建证书对象的副本
            const certCopy = { ...cert };

            // 对姓名和课程名称进行编码，防止XML注入和特殊字符问题
            certCopy.name = cert.name
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;');

            certCopy.course =
              isEnglish && cert.english_course
                ? cert.english_course
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                : cert.course.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

            // 设置模板路径
            certCopy.templatePath = '/templates/certificate-premium.svg';

            // 使用增强的预览方法
            const previewUrl = await CertificateGenerator.previewCertificate(certCopy);
            console.log(`证书预览URL生成成功: ${cert.id}`);

            return { ...cert, processedImage: previewUrl, isLoading: false };
          } catch (error) {
            console.error(`处理证书失败: ${cert.id} - ${cert.name}`, error);
            // 设置错误状态，但保留原始图像路径以便后续尝试
            return {
              ...cert,
              processedImage: null,
              isLoading: false,
              error: true,
              errorMessage: error.message || '证书处理失败',
            };
          }
        })
      );

      setProcessedCertificates(processed);
    };

    processCertificates();

    // 清理函数
    return () => {
      // 释放创建的对象URL
      processedCertificates.forEach(cert => {
        if (cert.processedImage && cert.processedImage.startsWith('blob:')) {
          CertificateGenerator.safeRevokeURL(cert.processedImage);
        }
      });
    };
  }, [isEnglish]);

  // 搜索筛选逻辑
  const filteredCertificates = processedCertificates.filter(
    cert =>
      cert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (isEnglish && cert.english_course
        ? cert.english_course.toLowerCase().includes(searchTerm.toLowerCase())
        : cert.course.toLowerCase().includes(searchTerm.toLowerCase())) ||
      cert.certificateId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 选择证书查看详情
  const handleCertificateClick = certificate => {
    setSelectedCertificate(certificate);
    setShowHtmlCertificate(false); // 默认显示SVG证书
  };

  // 关闭证书详情模态框
  const closeModal = () => {
    setSelectedCertificate(null);
    setShowHtmlCertificate(false);
  };

  // 切换HTML证书视图
  const toggleHtmlCertificate = e => {
    if (e) e.stopPropagation();
    setShowHtmlCertificate(!showHtmlCertificate);
  };

  // 下载PDF证书
  const handleDownloadPDF = () => {
    setIsDownloading(true);
    try {
      if (selectedCertificate) {
        // 使用增强的高对比度证书下载
        CertificateGenerator.downloadPDF(selectedCertificate);
        setDownloadStatus({
          certificateId: selectedCertificate.certificateId,
          status: 'success',
          message: t('certificatesPage.downloadSuccess'),
        });

        // 3秒后重置状态
        setTimeout(() => {
          setDownloadStatus({ certificateId: null, status: null, message: '' });
        }, 3000);
      } else {
        console.error('未找到证书数据');
        setDownloadStatus({
          certificateId: 'error',
          status: 'error',
          message: '未找到证书数据',
        });
      }
    } catch (error) {
      console.error('下载证书时出错:', error);
      setDownloadStatus({
        certificateId: 'error',
        status: 'error',
        message: t('certificatesPage.downloadError'),
      });

      // 3秒后重置错误状态
      setTimeout(() => {
        setDownloadStatus({ certificateId: null, status: null, message: '' });
      }, 3000);
    } finally {
      setIsDownloading(false);
    }
  };

  // 格式化发布日期
  const formatDate = dateString => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(isEnglish ? 'en-US' : 'zh-CN', options);
  };

  // 根据当前语言获取课程名称
  const getCourseTitle = certificate => {
    return isEnglish && certificate.english_course
      ? certificate.english_course
      : certificate.course;
  };

  // 根据当前语言获取课程描述
  const getCourseDescription = certificate => {
    return isEnglish && certificate.english_description
      ? certificate.english_description
      : certificate.description;
  };

  // 处理模板选择
  const handleTemplateChange = e => {
    setCertificateTemplate(e.target.value);

    // 如果已选择证书，则刷新证书图像
    if (selectedCertificate) {
      // 清除当前的已处理图像
      const updatedCertificates = processedCertificates.map(cert => {
        if (cert.id === selectedCertificate.id) {
          if (cert.processedImage && cert.processedImage.startsWith('blob:')) {
            CertificateGenerator.safeRevokeURL(cert.processedImage);
          }
          return {
            ...cert,
            processedImage: null,
            isLoading: true,
          };
        }
        return cert;
      });

      setProcessedCertificates(updatedCertificates);

      // 重新处理选定的证书
      const processCertificate = async () => {
        try {
          const certCopy = { ...selectedCertificate };

          // 对姓名和课程名称进行编码
          certCopy.name = selectedCertificate.name
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

          certCopy.course =
            isEnglish && selectedCertificate.english_course
              ? selectedCertificate.english_course
                  .replace(/&/g, '&amp;')
                  .replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;')
              : selectedCertificate.course
                  .replace(/&/g, '&amp;')
                  .replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;');

          // 设置模板路径
          certCopy.templatePath = '/templates/certificate-premium.svg';

          // 使用预览方法
          const previewUrl = await CertificateGenerator.previewCertificate(certCopy);

          // 更新处理后的证书列表
          const updatedCerts = processedCertificates.map(cert =>
            cert.id === selectedCertificate.id
              ? { ...cert, processedImage: previewUrl, isLoading: false }
              : cert
          );

          setProcessedCertificates(updatedCerts);

          // 更新选中的证书
          setSelectedCertificate({
            ...selectedCertificate,
            processedImage: previewUrl,
            isLoading: false,
          });
        } catch (error) {
          console.error('更新证书模板失败:', error);
        }
      };

      processCertificate();
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <div className="bg-white pt-16 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
                {t('certificatesPage.title')}
              </h1>
              <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-900 sm:mt-4">
                {t('certificatesPage.subtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* 搜索框 */}
        <div className="max-w-xl mx-auto mb-10">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white shadow-sm focus:outline-none focus:ring-[#003087] focus:border-[#003087]"
              placeholder={t('certificatesPage.searchPlaceholder')}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* 证书列表 */}
        <div className="mt-12 grid gap-6 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 mx-auto">
          {filteredCertificates.length > 0 ? (
            filteredCertificates.map(certificate => (
              <div
                key={certificate.id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div
                  className="relative cursor-pointer"
                  onClick={() => handleCertificateClick(certificate)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleCertificateClick(certificate);
                    }
                  }}
                  role="button"
                  tabIndex="0"
                  aria-label={`${t('certificatesPage.viewCertificate')}: ${certificate.name}`}
                >
                  <div className="h-52 w-full bg-white flex items-center justify-center border">
                    {certificate.isLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                      </div>
                    ) : certificate.error ? (
                      <div className="flex items-center justify-center h-full bg-red-50">
                        <div className="text-center p-4">
                          <svg
                            className="mx-auto h-12 w-12 text-red-500"
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
                          <p className="mt-2 text-sm text-red-800">证书图像加载出错</p>
                          <button
                            className="mt-2 px-3 py-1 bg-blue-600 text-white rounded-md text-xs hover:bg-blue-700"
                            onClick={e => {
                              e.stopPropagation();
                              handleCertificateClick(certificate);
                              setShowHtmlCertificate(true);
                            }}
                          >
                            使用HTML证书
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <img
                          src={certificate.processedImage || certificate.image}
                          alt={certificate.name}
                          className="h-52 object-contain w-full"
                          style={{
                            filter: 'contrast(3.0) brightness(0.8)',
                            maxHeight: '100%',
                            backgroundColor: '#ffffff',
                            objectFit: 'contain',
                            objectPosition: 'center',
                            border: '3px solid #000',
                          }}
                          onError={e => {
                            e.target.onerror = null;
                            e.target.src = `data:image/svg+xml;utf8,${encodeURIComponent(`
                              <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
                                <rect width="400" height="300" fill="#f8f9fa" stroke="#cccccc" stroke-width="2" />
                                <text x="200" y="150" font-family="Arial, sans-serif" font-size="24" text-anchor="middle" fill="#999">Certificate Preview</text>
                              </svg>
                            `)}`;
                          }}
                        />
                        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-200 bg-black bg-opacity-80 flex flex-col items-center justify-center">
                          <p className="text-white text-md font-bold px-2 py-1 mb-2">
                            看不清证书内容？
                          </p>
                          <button
                            type="button"
                            className="mt-2 w-full inline-flex justify-center rounded-md border border-2 border-red-500 shadow-sm px-4 py-2 bg-white text-base font-bold text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                            onClick={e => {
                              e.stopPropagation();
                              handleCertificateClick(certificate);
                              setShowHtmlCertificate(true);
                            }}
                            disabled={isDownloading}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 mr-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                              />
                            </svg>
                            HTML证书 (推荐)
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-5 hover:bg-opacity-10 transition-opacity flex items-center justify-center">
                    <div className="absolute bottom-2 right-2 bg-white/80 p-1 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-700"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* 证书信息 */}
                <div className="px-4 py-4">
                  <h3 className="text-lg font-medium text-gray-900">{certificate.name}</h3>
                  <p className="text-md font-medium text-[#003087]">
                    {getCourseTitle(certificate)}
                  </p>
                  <p className="mt-1 text-sm text-gray-800 line-clamp-2">
                    {getCourseDescription(certificate)}
                  </p>
                  <p className="mt-2 text-xs text-gray-700">
                    Issue Date: {formatDate(certificate.date)}
                  </p>

                  <div className="mt-4 flex">
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-bold rounded-md shadow-md text-white bg-[#003087] hover:bg-[#002266] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#003087] transition-colors w-full justify-center"
                      onClick={handleDownloadPDF}
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleDownloadPDF();
                        }
                      }}
                      disabled={
                        isDownloading && downloadStatus.certificateId === certificate.certificateId
                      }
                      aria-label={t('certificatesPage.ariaLabel', {
                        name: certificate.name,
                        course: getCourseTitle(certificate),
                      })}
                    >
                      {isDownloading &&
                      downloadStatus.certificateId === certificate.certificateId ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                          {t('certificatesPage.downloading')}
                        </>
                      ) : (
                        <>
                          <svg
                            className="-ml-0.5 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                          </svg>
                          {t('certificatesPage.download')}
                        </>
                      )}
                    </button>
                  </div>

                  {/* 下载状态消息 */}
                  {downloadStatus.certificateId === certificate.certificateId &&
                    downloadStatus.status && (
                      <div
                        className={`mt-2 text-xs ${
                          downloadStatus.status === 'success'
                            ? 'text-green-600'
                            : downloadStatus.status === 'error'
                              ? 'text-red-600'
                              : 'text-blue-600'
                        }`}
                      >
                        {downloadStatus.message}
                      </div>
                    )}
                </div>

                {/* 认证标志 */}
                <div className="px-5 py-2 bg-gray-50 border-t border-gray-200 flex items-center">
                  <svg
                    className="h-4 w-4 text-[#D4A017] mr-1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-xs text-gray-500">
                    {t('Accredited by Global Academic Standards Board')}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 flex flex-col items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-gray-300 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                role="img"
                aria-labelledby="no-certificates-title"
              >
                <title id="no-certificates-title">{t('certificatesPage.noCertificates')}</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                {t('certificatesPage.noCertificates')}
              </h3>
              <p className="text-gray-500 text-center max-w-md">
                {t('certificatesPage.noCertificatesMessage')}
              </p>
            </div>
          )}
        </div>

        {/* 证书验证部分 */}
        <div className="max-w-7xl mx-auto my-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-[#3e86cc] bg-opacity-90 rounded-lg shadow-xl overflow-hidden">
            <div className="pt-10 pb-12 px-6 sm:pt-16 sm:px-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20 lg:flex lg:items-center lg:justify-between">
              <div className="lg:w-0 lg:flex-1">
                <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  <span className="block text-white">
                    {t('certificatesPage.verifySection.title')}
                  </span>
                </h2>
                <p className="mt-4 max-w-3xl text-lg text-white">
                  {t('certificatesPage.verifySection.description')}
                </p>
              </div>
              <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                <div className="inline-flex rounded-md shadow">
                  <button
                    onClick={() => (window.location.href = '/verify-certificate')}
                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-bold rounded-md text-[#3e86cc] bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                  >
                    {t('certificatesPage.verifySection.action')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 证书详情模态框 */}
      {selectedCertificate && (
        <div
          className="fixed z-10 inset-0 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="certificate-modal-title"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
              onClick={closeModal}
              onKeyDown={e => {
                if (e.key === 'Escape') {
                  closeModal();
                }
              }}
              tabIndex="0"
              role="button"
              aria-label={t('certificatesPage.certificateModal.closeModal')}
            ></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white">
                {/* 模板选择器 */}
                {!showHtmlCertificate && (
                  <div className="px-4 py-3 bg-gray-100 border-b">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-700">选择证书样式:</span>
                      <select
                        value={certificateTemplate}
                        onChange={handleTemplateChange}
                        className="ml-4 border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="high-contrast">高对比度证书 (推荐)</option>
                        <option value="inverted">反色证书 (黑底白字)</option>
                        <option value="no-bg">标准证书</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="relative">
                  {selectedCertificate.isLoading ? (
                    <div className="flex items-center justify-center h-64 bg-gray-100">
                      <svg
                        className="animate-spin h-12 w-12 text-[#003087]"
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
                  ) : showHtmlCertificate ? (
                    <div className="p-4 bg-gray-50">
                      <HtmlCertificate
                        certificate={selectedCertificate}
                        onDownload={() => {
                          setDownloadStatus({
                            certificateId: selectedCertificate.certificateId,
                            status: 'success',
                            message: t('certificatesPage.downloadSuccess'),
                          });

                          setTimeout(() => {
                            setDownloadStatus({ certificateId: null, status: null, message: '' });
                          }, 3000);
                        }}
                      />
                    </div>
                  ) : selectedCertificate.error ? (
                    <div className="flex items-center justify-center h-64 bg-red-50">
                      <div className="text-center p-4">
                        <svg
                          className="mx-auto h-16 w-16 text-red-500"
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
                        <p className="mt-4 text-lg text-red-800">证书图像加载失败</p>
                        <p className="mt-2 text-sm text-red-600">
                          请点击&apos;切换HTML证书&apos;按钮使用替代证书
                        </p>
                        <button
                          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onClick={toggleHtmlCertificate}
                        >
                          切换HTML证书
                        </button>
                      </div>
                    </div>
                  ) : (
                    <ImageWithFallback
                      src={selectedCertificate.processedImage || selectedCertificate.image}
                      alt={`${selectedCertificate.name}的${getCourseTitle(selectedCertificate)}证书`}
                      className="w-full h-full object-contain"
                      style={{
                        filter: 'contrast(3.0) brightness(0.8)',
                        maxWidth: '100%',
                        maxHeight: '70vh',
                        backgroundColor: '#ffffff',
                        border: '3px solid #000',
                      }}
                      fallbackSrc="/images/no-bg-certificate.svg"
                      onError={e =>
                        console.error(
                          `模态框证书图像加载失败: ${selectedCertificate.id}，原路径: ${selectedCertificate.image}`
                        )
                      }
                    />
                  )}
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#003087] text-base font-medium text-white hover:bg-[#002266] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#003087] sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={handleDownloadPDF}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleDownloadPDF();
                      }
                    }}
                    aria-label={t('certificatesPage.certificateModal.download')}
                  >
                    {t('certificatesPage.certificateModal.download')}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={closeModal}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        closeModal();
                      }
                    }}
                    aria-label={t('certificatesPage.certificateModal.close')}
                  >
                    {t('certificatesPage.certificateModal.close')}
                  </button>
                  <button
                    type="button"
                    className={`mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm ${showHtmlCertificate ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 focus:ring-gray-500' : 'bg-yellow-500 text-black border-yellow-400 hover:bg-yellow-400 focus:ring-yellow-500'}`}
                    onClick={toggleHtmlCertificate}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        toggleHtmlCertificate(e);
                      }
                    }}
                  >
                    {showHtmlCertificate ? '返回SVG证书' : '切换到高清HTML证书'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificatesPage;
