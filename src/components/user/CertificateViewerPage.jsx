import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../shared/LoadingSpinner';
import AlertMessage from '../shared/AlertMessage';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const CertificateViewerPage = () => {
  const { t } = useTranslation();
  const { id, templateName } = useParams();
  const [certificateSvgUrl, setCertificateSvgUrl] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // SVG转base64工具
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
`)}`;

  // 生成SVG字符串
  async function getCertificateSVG(cert) {
    if (!cert) return '';
    const origin = window.location.origin;
    const presidentSign = await svgUrlToBase64(`${origin}/images/signatures/president.svg`);
    const directorSign = await svgUrlToBase64(`${origin}/images/signatures/director.svg`);
    const logoImg = await svgUrlToBase64(`${origin}/images/logo/logo.svg`);
    const sealImg = await svgUrlToBase64(`${origin}/images/logo/seal.svg`);
    
    // 使用与 premium 模板完全相同的样式
    const goldColor = '#C19A49';
    const blueColor = '#003087';
    const blackColor = '#000000';
    const backgroundColor = '#FFFEF0';

    // 确保数据存在，提供默认值
    const recipientName = cert.recipientName || cert.name || 'Recipient Name';
    const program = cert.program || cert.course || 'Program Name';
    const issueDate = formatDateEn(cert.issueDate || cert.date || new Date());
    const certificateId = cert.certificateNumber || cert.certificateId || 'N/A';

    let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="900" xmlns="http://www.w3.org/2000/svg">
  <!-- 米色背景 -->
  <rect width="1200" height="900" fill="${backgroundColor}" />
  
  <g transform="translate(0, 20)">
    <!-- 金色边框 -->
    <rect x="20" y="20" width="1160" height="860" fill="none" stroke="${goldColor}" stroke-width="5" />
    <rect x="40" y="40" width="1120" height="820" fill="none" stroke="${goldColor}" stroke-width="1" />
    
    <!-- 角落装饰 -->
    <path d="M40,40 L90,40 L90,45 L45,45 L45,90 L40,90 Z" fill="${goldColor}" />
    <path d="M1160,40 L1110,40 L1110,45 L1155,45 L1155,90 L1160,90 Z" fill="${goldColor}" />
    <path d="M40,860 L90,860 L90,855 L45,855 L45,810 L40,810 Z" fill="${goldColor}" />
    <path d="M1160,860 L1110,860 L1110,855 L1155,855 L1155,810 L1160,810 Z" fill="${goldColor}" />

    <!-- 顶部校徽 - 调大, 调整位置 -->
    ${logoImg ? `<image x="540" y="40" width="120" height="120" href="${logoImg}" />` : ''}

    <!-- 学校名称 - 黑色, 下移 -->
    <text x="600" y="200" font-family="Times New Roman, serif" font-size="36" font-weight="bold" text-anchor="middle" fill="${blackColor}">STRATFORD INTERNATIONAL UNIVERSITY</text>
    
    <!-- 证书标题 - 蓝色, 下移 -->
    <text x="600" y="260" font-family="Times New Roman, serif" font-size="48" font-weight="bold" text-anchor="middle" fill="${blueColor}">CERTIFICATE OF COMPLETION</text>
    
    <!-- 证书文本 - 黑色, 下移 -->
    <text x="600" y="320" font-family="Times New Roman, serif" font-size="20" text-anchor="middle" fill="${blackColor}">The Stratford International University hereby certifies that</text>
    
    <!-- 接收者姓名 - 黑色, 斜体, 下移 -->
    <text x="600" y="370" font-family="Times New Roman, serif" font-size="38" font-weight="bold" font-style="italic" text-anchor="middle" fill="${blackColor}">${recipientName}</text>
    
    <!-- 学位文本 - 黑色, 下移 -->
    <text x="600" y="425" font-family="Times New Roman, serif" font-size="20" text-anchor="middle" fill="${blackColor}">has fulfilled the requirements for the degree of</text>
    
    <!-- 学位名称 - 金色, 斜体, 下移 -->
    <text x="600" y="475" font-family="Times New Roman, serif" font-size="34" font-style="italic" font-weight="bold" text-anchor="middle" fill="${goldColor}">${program}</text>
    
    <!-- 附加文本 - 黑色, 下移 -->
    <text x="600" y="525" font-family="Times New Roman, serif" font-size="20" text-anchor="middle" fill="${blackColor}">and is awarded this Certificate of Completion with all rights, privileges, and honors appertaining thereto.</text>
    
    <!-- 荣誉标签 - 金色, 斜体, 下移 -->
    <text x="600" y="565" font-family="Times New Roman, serif" font-size="22" font-style="italic" text-anchor="middle" fill="${goldColor}">Cum Honore</text>
    
    <!-- 日期文本 - 黑色, 下移 -->
    <text x="600" y="605" font-family="Times New Roman, serif" font-size="20" text-anchor="middle" fill="${blackColor}">Awarded Date</text>
    <text x="600" y="635" font-family="Times New Roman, serif" font-size="22" font-weight="bold" text-anchor="middle" fill="${blackColor}">${issueDate}</text>
    
    <!-- 签名区域 - 调大签名, 调整间距 -->
    ${presidentSign ? `<image x="190" y="640" width="200" height="70" href="${presidentSign}" />` : ''}
    <line x1="150" y1="715" x2="400" y2="715" stroke="${goldColor}" stroke-width="1.5" />
    <text x="275" y="735" font-family="Times New Roman, serif" font-size="16" text-anchor="middle" fill="${blackColor}">Prof. Dr. Linda Foster, University President</text>
    
    ${directorSign ? `<image x="810" y="640" width="200" height="70" href="${directorSign}" />` : ''}
    <line x1="800" y1="715" x2="1050" y2="715" stroke="${goldColor}" stroke-width="1.5" />
    <text x="925" y="735" font-family="Times New Roman, serif" font-size="16" text-anchor="middle" fill="${blackColor}">Prof. Dr. James Carpenter, Director, MBA Program</text>
    
    <!-- 简单 SIU Logo -->
    <g transform="translate(600, 700)">
      <circle cx="0" cy="0" r="45" fill="${blueColor}" />
      <circle cx="0" cy="0" r="42" fill="none" stroke="${goldColor}" stroke-width="1.5" />
      <circle cx="0" cy="0" r="48" fill="none" stroke="${goldColor}" stroke-width="1" />
      <text x="0" y="0" font-family="Arial, sans-serif" font-size="40" font-weight="bold" text-anchor="middle" dominant-baseline="central" fill="${goldColor}">SIU</text>
    </g>

    <!-- 证书编号 - 移到内框底部 -->
    <text x="600" y="840" font-family="Times New Roman, serif" font-size="14" text-anchor="middle" fill="${blackColor}">Certificate ID: ${certificateId}</text>
  </g>
</svg>`;
    return svg;
  }

  useEffect(() => {
    const loadCertificate = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. 获取证书数据
        const isEmbedRoute = window.location.pathname.includes('certificate-embed');
        
        let response;
        
        if (isEmbedRoute) {
          // 公共嵌入路由，使用验证API
          response = await fetch(`/api/certificates/verify/${id}`);
        } else {
          // 受保护路由，需要身份验证
          const token = localStorage.getItem('auth_token');
          if (!token) {
            throw new Error('需要身份验证才能访问证书');
          }
          
          response = await fetch(`/api/certificates/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        }
        
        if (!response.ok) {
          throw new Error(`无法获取证书: ${response.statusText}`);
        }
        
        const data = await response.json();
        const cert = data.data;
        
        if (!cert) {
          throw new Error('找不到证书数据');
        }

        setCertificate(cert);

        // 2. 生成SVG
        const svgContent = await getCertificateSVG(cert);
        
        // 创建Blob和URL
        const blob = new Blob([svgContent], { type: 'image/svg+xml' });
        const processedImageUrl = URL.createObjectURL(blob);

        setCertificateSvgUrl(processedImageUrl);
      } catch (err) {
        console.error('加载证书时出错:', err);
        setError(err.message || '无法加载证书');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadCertificate();
    }
    
    // 清理函数
    return () => {
      if (certificateSvgUrl) {
        URL.revokeObjectURL(certificateSvgUrl);
      }
    };
  }, [id, templateName]);

  const handleDownloadPDF = async () => {
    if (!certificate) return;
    
    // 创建隐藏容器
    let certDom = document.getElementById('certificate-html-preview');
    if (!certDom) {
      certDom = document.createElement('div');
      certDom.id = 'certificate-html-preview';
      certDom.style.position = 'absolute';
      certDom.style.left = '-9999px';
      certDom.style.top = '0';
      document.body.appendChild(certDom);
    }
    
    try {
      // 生成SVG并插入DOM
      const svgStr = await getCertificateSVG(certificate);
      certDom.innerHTML = `<div>${svgStr}</div>`;
      
      // 用html2canvas截图 - 提高分辨率(scale)以获得更清晰的PDF
      const canvas = await html2canvas(certDom, {
        scale: 4, // 提高分辨率，从3增加到4
        useCORS: true,
        backgroundColor: '#FFFDF0',
        logging: false, // 禁用日志以提高性能
        imageTimeout: 15000, // 增加图像加载超时时间
      });
      
      // 生成PDF - 增加更多配置选项
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
        compress: true, // 启用压缩
        precision: 16, // 提高精度
      });
      
      // 添加文档属性
      pdf.setProperties({
        title: `${certificate.recipientName || certificate.name || 'Certificate'} - ${certificate.program || certificate.course || 'Program'}`,
        subject: 'Stratford International University Certificate',
        author: 'Stratford International University',
        keywords: 'certificate, education, diploma, blockchain, verified',
        creator: 'SIU Certificate System',
      });
      
      // 添加水印文本作为安全特性
      const addWatermark = () => {
        pdf.saveGraphicsState();
        pdf.setTextColor(0, 0, 0);
        pdf.setGState(new pdf.GState({opacity: 0.05}));
        pdf.setFontSize(16);
        pdf.text('VERIFIED SIU CERTIFICATE', 40, 60, {angle: 45});
        pdf.restoreGraphicsState();
      };
      addWatermark();
      
      const imgWidth = 297; // A4纸张宽度(横向)
      const imgHeight = 210; // A4纸张高度(横向)
      
      // 添加图像并优化品质
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, '', 'FAST');
      
      // 使用更好的文件命名方式，包含证书类型和日期
      const dateStr = new Date().toISOString().slice(0, 10);
      const recipientName = certificate.recipientName || certificate.name || 'Certificate';
      const safeRecipientName = recipientName.replace(/[^a-zA-Z0-9]/g, '_');
      const certId = certificate.certificateNumber || certificate._id || '';
      
      pdf.save(`SIU_Certificate_${safeRecipientName}_${certId}_${dateStr}.pdf`);
    } catch (error) {
      console.error('生成PDF时出错:', error);
      alert('下载证书时出错，请重试');
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 sm:px-0">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
          证书
        </h2>
      </div>

      {loading ? (
        <div className="mt-6">
          <LoadingSpinner message="正在加载证书..." />
        </div>
      ) : error ? (
        <div className="mt-6">
          <AlertMessage
            type="error"
            message={{ title: '错误', details: error }}
          />
        </div>
      ) : (
        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                证书预览
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                您的证书已成功生成。
              </p>
            </div>
            <div className="flex space-x-4">
              <button 
                onClick={handleDownloadPDF}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                下载PDF
              </button>
              <a
                href={certificateSvgUrl}
                download="certificate.svg"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                下载SVG
              </a>
            </div>
          </div>
          <div className="certificate-preview-container p-4 flex justify-center">
            {certificateSvgUrl && (
              <div className="certificate-preview-wrapper max-w-full overflow-auto">
                <img
                  src={certificateSvgUrl}
                  alt="Certificate Preview"
                  className="certificate-preview max-w-full h-auto"
                  style={{ maxHeight: '70vh' }}
                />
              </div>
            )}
          </div>
          
          {/* 隐藏的预览区域 - 仅用于生成PDF */}
          <div
            id="certificate-html-preview"
            style={{ position: 'absolute', left: '-9999px', top: 0 }}
          />
        </div>
      )}
    </div>
  );
};

export default CertificateViewerPage;
