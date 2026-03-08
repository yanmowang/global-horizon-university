import React from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const HtmlCertificate = ({ certificate, onDownload }) => {
  const certificateRef = React.useRef(null);

  const downloadAsPDF = async () => {
    if (!certificateRef.current) return;

    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 5, // 更高分辨率
        useCORS: true,
        logging: false,
        backgroundColor: '#FFFDF0',
      });

      const imgData = canvas.toDataURL('image/png', 1.0);

      // A4 尺寸
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
        compress: false, // 不压缩以保持质量
      });

      const imgWidth = 297; // A4 宽度
      const imgHeight = 210; // A4 高度

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, '', 'FAST');
      pdf.save(`${certificate.name}_${certificate.certificateId}.pdf`);

      if (onDownload) {
        onDownload();
      }
    } catch (error) {
      console.error('下载证书失败:', error);
      alert('生成PDF时出错，请稍后再试');
    }
  };

  // 增加下载图片功能
  const downloadAsImage = async () => {
    if (!certificateRef.current) return;

    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 5, // 更高分辨率
        useCORS: true,
        logging: false,
        backgroundColor: '#FFFDF0',
      });

      // 使用最高质量创建PNG
      const imgData = canvas.toDataURL('image/png', 1.0);

      // 创建下载链接
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `${certificate.name}_${certificate.certificateId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      if (onDownload) {
        onDownload();
      }
    } catch (error) {
      console.error('下载图片失败:', error);
      alert('生成图片时出错，请稍后再试');
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* 现代简约风格证书模板 */}
      <div
        ref={certificateRef}
        className="relative"
        style={{
          width: '800px',
          height: '600px',
          fontFamily: 'Georgia, serif',
          backgroundColor: '#FFFDF0',
          color: '#000000',
          boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
          overflow: 'hidden',
          padding: '30px',
          borderRadius: '5px',
          position: 'relative',
        }}
      >
        {/* 简单边框 */}
        <div
          style={{
            position: 'absolute',
            top: '15px',
            left: '15px',
            right: '15px',
            bottom: '15px',
            border: '2px solid #B58A3F',
            zIndex: 10,
          }}
        ></div>

        {/* 学校标志 - 可以替换为您的实际logo */}
        <div className="text-center mt-6 relative z-20">
          <svg width="80" height="80" viewBox="0 0 200 200" style={{ margin: '0 auto' }}>
            <circle cx="100" cy="100" r="80" fill="#111" />
            <text
              x="100"
              y="120"
              fontSize="60"
              fontWeight="bold"
              textAnchor="middle"
              fill="#FFFDF0"
            >
              SIU
            </text>
          </svg>
        </div>

        {/* 学校名称 */}
        <div className="text-center mt-4 relative z-20">
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#000000',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            STRATFORD INTERNATIONAL UNIVERSITY
          </h1>
        </div>

        {/* 证书标题 */}
        <div className="text-center mt-4 relative z-20">
          <h2
            style={{
              fontSize: '40px',
              fontWeight: 'bold',
              color: '#B58A3F',
              marginBottom: '10px',
            }}
          >
            DIPLOMA
          </h2>
        </div>

        {/* 证书文本 */}
        <div className="text-center mt-4 relative z-20">
          <p style={{ fontSize: '16px', color: '#000000' }}>This is to certify that</p>

          {/* 获得者姓名 */}
          <h3
            style={{
              fontSize: '32px',
              fontWeight: 'bold',
              margin: '20px 0',
              color: '#000000',
            }}
          >
            {certificate.name}
          </h3>

          <p style={{ fontSize: '16px', color: '#000000' }}>
            has successfully completed the online degree
          </p>

          {/* 课程名称 */}
          <h3
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              margin: '20px 0',
              color: '#B58A3F',
              fontStyle: 'italic',
            }}
          >
            {certificate.course}
          </h3>

          <p style={{ fontSize: '14px', color: '#000000', margin: '15px 0' }}>
            together with all the rights, privileges and honours which appertain thereto.
          </p>
        </div>

        {/* 日期 */}
        <div className="text-center mt-4 relative z-20">
          <p style={{ fontSize: '14px', color: '#000000' }}>Awarded Date</p>
          <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#000000' }}>
            {new Date(certificate.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        {/* 签名区域 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '30px',
            paddingLeft: '60px',
            paddingRight: '60px',
            position: 'relative',
            zIndex: 20,
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                borderTop: '1px solid #000',
                width: '120px',
                margin: '0 auto 5px auto',
              }}
            ></div>
            <div style={{ fontStyle: 'italic', fontSize: '14px' }}>Prof. Dr. Linda Foster</div>
            <div style={{ fontSize: '12px' }}>University President</div>
          </div>

          {/* 中间的印章替换为logo */}
          <div
            style={{
              width: '80px',
              height: '80px',
              margin: '-20px auto 0',
              position: 'relative',
            }}
          >
            <img src="/images/logo/logo.png" width="60" height="60" alt="SIU Logo" />
          </div>

          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                borderTop: '1px solid #000',
                width: '120px',
                margin: '0 auto 5px auto',
              }}
            ></div>
            <div style={{ fontStyle: 'italic', fontSize: '14px' }}>Prof. Dr. James Carpenter</div>
            <div style={{ fontSize: '12px' }}>Program Director</div>
          </div>
        </div>

        {/* 证书ID */}
        <div
          style={{
            position: 'absolute',
            bottom: '15px',
            width: '100%',
            textAlign: 'center',
            left: 0,
            fontSize: '12px',
            color: '#000000',
            zIndex: 20,
          }}
        >
          Certificate ID: {certificate.certificateId}
        </div>

        {/* 星形背景装饰 */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.15,
            zIndex: 10,
          }}
        >
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: i % 2 ? '20%' : '70%',
                left: i < 2 ? '15%' : '85%',
                width: '40px',
                height: '40px',
                background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23B58A3F' d='M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z'/%3E%3C/svg%3E")`,
                backgroundSize: 'contain',
              }}
            />
          ))}
        </div>
      </div>

      {/* 下载按钮区域 */}
      <div className="mt-6 flex space-x-4">
        <button
          onClick={downloadAsPDF}
          className="px-6 py-3 bg-blue-900 text-white font-bold rounded-md shadow-md hover:bg-blue-800 transition-colors"
        >
          下载PDF证书
        </button>

        <button
          onClick={downloadAsImage}
          className="px-6 py-3 bg-green-800 text-white font-bold rounded-md shadow-md hover:bg-green-700 transition-colors"
        >
          下载图片证书 (推荐)
        </button>
      </div>
    </div>
  );
};

export default HtmlCertificate;
