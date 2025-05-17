import { jsPDF } from 'jspdf';
import i18next from 'i18next';
import certificateConfig from '../config/certificateTemplates.json';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';

// 如果在浏览器环境中使用的哈希函数
function sha256(str) {
  return crypto.subtle.digest('SHA-256', new TextEncoder().encode(str)).then(hashBuffer => {
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  });
}

/**
 * 证书生成服务 - 用于创建可下载的证书PDF
 */
class CertificateGenerator {
  /**
   * 根据证书数据生成PDF证书
   * @param {Object} certificate - 证书数据
   * @returns {Promise<Blob>} 返回PDF Blob
   */
  static generateCertificatePDF(certificate) {
    return new Promise(async (resolve, reject) => {
      try {
        // 创建一个临时的隐藏div来渲染SVG
        let certDom = document.getElementById('certificate-generator-preview');
        if (!certDom) {
          certDom = document.createElement('div');
          certDom.id = 'certificate-generator-preview';
          certDom.style.position = 'absolute';
          certDom.style.left = '-9999px';
          certDom.style.top = '0';
          document.body.appendChild(certDom);
        }

        // 使用SVG模板生成证书
        const svgStr = await this.getCertificateSVG(certificate);
        certDom.innerHTML = `<div>${svgStr}</div>`;

        // 将SVG转换为canvas
        const canvas = await html2canvas(certDom, {
          scale: 3,
          useCORS: true,
          backgroundColor: '#FFFDF0',
        });

        // 将canvas转换为图像数据
        const imgData = canvas.toDataURL('image/png', 1.0);

        // 创建PDF
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a4',
          compress: false,
        });

        // 设置文档属性
        pdf.setProperties({
          title: `${certificate.name} - Certificate`,
          subject: 'Stratford International University Certificate',
          author: 'Stratford International University',
          keywords: 'certificate, education, diploma, blockchain, verified',
          creator: 'SIU Certificate System',
          resolution: 300, // 设置为高分辨率
        });

        // 将图像添加到PDF
        const imgWidth = 297;
        const imgHeight = 210;
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, '', 'FAST');
        
        // 输出PDF blob
        const pdfBlob = pdf.output('blob');
        resolve(pdfBlob);

        // 移除临时DOM
        if (document.body.contains(certDom)) {
          document.body.removeChild(certDom);
        }
      } catch (error) {
        console.error('PDF生成错误:', error);
        reject(error);
      }
    });
  }

  /**
   * SVG转base64工具
   * @param {string} url - SVG URL
   * @returns {Promise<string>} Base64编码的SVG URL
   */
  static async svgUrlToBase64(url) {
    const response = await fetch(url);
    const text = await response.text();
    // encodeURIComponent后替换特殊字符，保证兼容性
    const encoded = encodeURIComponent(text).replace(/'/g, '%27').replace(/"/g, '%22');
    return `data:image/svg+xml;utf8,${encoded}`;
  }

  /**
   * 英文日期格式
   * @param {string} dateString - 日期字符串
   * @returns {string} 格式化的英文日期
   */
  static formatDateEn(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  /**
   * 生成SVG证书模板
   * @param {Object} certificate - 证书数据
   * @returns {Promise<string>} SVG字符串
   */
  static async getCertificateSVG(certificate) {
    if (!certificate) return '';

    // 获取翻译函数
    const t = i18next.t;
    
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
</svg>`)}`;

    const origin = window.location.origin;
    const presidentSign = await this.svgUrlToBase64(`${origin}/images/signatures/president.svg`);
    const directorSign = await this.svgUrlToBase64(`${origin}/images/signatures/director.svg`);
    const logoImg = await this.svgUrlToBase64(`${origin}/images/logo/logo.svg`);
    
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
  <text x="600" y="460" font-family="Georgia, serif" font-size="28" font-weight="bold" font-style="italic" text-anchor="middle" fill="#000000">${certificate.name || ''}</text>
  <text x="600" y="500" font-family="Georgia, serif" font-size="22" text-anchor="middle" fill="#000000">${t('certificate.requirementsText')}</text>
  <text x="600" y="540" font-family="Georgia, serif" font-size="26" font-weight="bold" font-style="italic" text-anchor="middle" fill="#B58A3F">${certificate.course || ''}</text>
  <text x="600" y="580" font-family="Georgia, serif" font-size="18" text-anchor="middle" fill="#000000">${t('certificate.rightsText')}</text>
  <text x="600" y="620" font-family="Georgia, serif" font-size="16" text-anchor="middle" fill="#D4A017">${t('certificate.honors')}</text>
  <text x="600" y="660" font-family="Georgia, serif" font-size="16" text-anchor="middle" fill="#000000">${t('certificate.awardedDate')}</text>
  <text x="600" y="690" font-family="Georgia, serif" font-size="20" text-anchor="middle" fill="#000000">${this.formatDateEn(certificate.date)}</text>
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
  <text x="600" y="870" font-family="Georgia, serif" font-size="14" text-anchor="middle" fill="#000000">${t('certificate.idLabel')}: ${certificate.certificateId || ''}</text>
</svg>`;
    return svg;
  }

  /**
   * 预览证书 - 将证书数据填充到模板中
   * @param {Object} certificate - 证书数据
   * @returns {Promise<string>} 处理后的证书URL
   */
  static async previewCertificate(certificate) {
    try {
      // 如果证书已经处理过，直接返回
      if (certificate.processedImage) {
        return certificate.processedImage;
      }

      // 生成SVG
      const svgContent = await this.getCertificateSVG(certificate);
      
      // 创建Blob和URL
      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      const processedImageUrl = URL.createObjectURL(blob);

      // 保存处理后的图像URL
      certificate.processedImage = processedImageUrl;

      console.log('证书SVG生成成功');
      return processedImageUrl;
    } catch (error) {
      console.error('处理证书时出错:', error);
      return this.generateErrorImage(certificate);
    }
  }

  /**
   * 生成错误图像 - 用于在无法加载证书图像时显示
   * @param {Object} certificate - 证书数据
   * @returns {string} 图像URL
   */
  static generateErrorImage(certificate) {
    // 创建一个更专业的SVG，模仿真实证书但显示错误消息
    const svgContent = `
    <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="certificate-error-title certificate-error-desc">
      <title id="certificate-error-title">Certificate Error</title>
      <desc id="certificate-error-desc">Certificate image is not available for this certificate</desc>
      
      <!-- 使用柔和的背景色和更优雅的设计 -->
      <rect width="800" height="600" fill="#f8f9fa" stroke="#cccccc" stroke-width="2" />
      
      <!-- 添加内边框使其看起来更像证书 -->
      <rect x="20" y="20" width="760" height="560" fill="none" stroke="#aaaaaa" stroke-width="1" />
      
      <!-- 添加校徽样式图标 -->
      <circle cx="400" cy="150" r="70" fill="#f1f1f1" stroke="#999999" stroke-width="1" />
      <text x="400" y="150" font-family="Times New Roman, serif" font-size="40" text-anchor="middle" dominant-baseline="middle" fill="#999999">SIU</text>
      <circle cx="400" cy="150" r="55" fill="none" stroke="#999999" stroke-width="0.5" />
      
      <!-- 学校名称 -->
      <text x="400" y="250" font-family="Times New Roman, serif" font-size="24" font-weight="bold" text-anchor="middle" fill="#555555">STRATFORD INTERNATIONAL UNIVERSITY</text>
      
      <!-- 错误消息 - 提高可读性的样式 -->
      <text x="400" y="310" font-family="Arial, sans-serif" font-size="20" text-anchor="middle" fill="#666666" font-weight="bold">证书模板不可用</text>
      <text x="400" y="340" font-family="Arial, sans-serif" font-size="16" text-anchor="middle" fill="#666666">Certificate Template Not Available</text>
      
      <!-- 建议消息 -->
      <text x="400" y="380" font-family="Arial, sans-serif" font-size="14" text-anchor="middle" fill="#777777">请联系管理员获取新的证书模板</text>
      <text x="400" y="400" font-family="Arial, sans-serif" font-size="14" text-anchor="middle" fill="#777777">Please contact administrator for template update</text>
      
      <!-- 显示证书ID以便识别 -->
      <text x="400" y="460" font-family="Consolas, monospace" font-size="16" font-weight="bold" text-anchor="middle" fill="#333333">${certificate ? certificate.certificateId : 'Unknown ID'}</text>
      
      <!-- 添加装饰元素 -->
      <line x1="250" y1="500" x2="550" y2="500" stroke="#999999" stroke-width="1" stroke-dasharray="5,5" />
      <text x="400" y="520" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" fill="#999999">系统已记录此错误 | Error logged</text>
    </svg>
    `;

    // 创建Blob和URL
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const errorImageUrl = URL.createObjectURL(blob);

    // 如果有证书对象，保存处理后的图像URL
    if (certificate) {
      certificate.processedImage = errorImageUrl;
      // 添加标记，表示这是错误图像
      certificate._isErrorImage = true;
      console.error(
        `证书模板不可用：ID=${certificate.certificateId}, 名称=${certificate.name}`
      );
    }

    return errorImageUrl;
  }

  /**
   * 格式化日期为更好的显示格式
   * @param {string} dateString - ISO日期字符串
   * @returns {string} 格式化的日期
   */
  static formatDate(dateString) {
    if (!dateString) return 'N/A';

    try {
      const date = new Date(dateString);

      // 检查日期是否有效
      if (isNaN(date.getTime())) {
        return dateString; // 如果无效，则返回原始字符串
      }

      // 格式化为 '15th December, 2023' 这样的格式
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      let formatted = date.toLocaleDateString('en-US', options);

      // 添加序数后缀 (1st, 2nd, 3rd, 4th 等)
      const day = date.getDate();
      const suffix = this.getOrdinalSuffix(day);

      // 替换日期中的数字为带有序数后缀的版本
      formatted = formatted.replace(String(day), `${day}${suffix}`);

      return formatted;
    } catch (error) {
      console.error('格式化日期时出错:', error);
      return dateString;
    }
  }

  /**
   * 获取数字的序数后缀 (st, nd, rd, th)
   * @param {number} n - 数字
   * @returns {string} 序数后缀
   */
  static getOrdinalSuffix(n) {
    if (n > 3 && n < 21) return 'th'; // 11th, 12th, 13th, ...
    switch (n % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  }

  /**
   * 安全地释放URL对象
   * @param {string} url - 由URL.createObjectURL创建的URL
   */
  static safeRevokeURL(url) {
    if (url && typeof url === 'string' && url.startsWith('blob:')) {
      try {
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Failed to revoke object URL:', error);
      }
    }
  }

  /**
   * 对外公开的下载证书方法
   * @param {Object} certificate - 证书数据
   * @returns {Promise<boolean>} 下载是否成功
   */
  static async downloadCertificate(certificate) {
    try {
      // 检查证书对象是否有效
      if (!certificate) {
        console.error('证书对象无效');
        alert('无法下载证书：证书数据无效');
        return false;
      }

      // 生成证书PDF
      const pdfBlob = await this.generateCertificatePDF(certificate);
      
      // 创建下载链接
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `${certificate.name || 'Certificate'}-${certificate.certificateId || 'SIU'}.pdf`;

      // 模拟点击下载
      document.body.appendChild(link);
      link.click();

      // 安全移除链接
      setTimeout(() => {
        document.body.removeChild(link);
        this.safeRevokeURL(pdfUrl);
      }, 100);

      console.log('PDF证书生成并下载成功');
      return true;
    } catch (error) {
      console.error('下载证书时出错:', error);
      alert('下载证书时出错，请重试');
      return false;
    }
  }
}

export default CertificateGenerator;
