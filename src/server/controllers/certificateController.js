const Certificate = require('../models/Certificate');
const User = require('../models/User');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Application directories
const DIRS = {
  certificates: path.join(__dirname, '../../../public/certificates'),
  images: path.join(__dirname, '../../../public/images'),
  templates: path.join(__dirname, '../../../public/templates'),
};

// Create all required directories at startup
const initDirectories = () => {
  // Main directories
  Object.values(DIRS).forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Image subdirectories
  const requiredImageDirs = [
    'watermark',
    'signatures',
    'seal-left',
    'seal-right',
    'seal-effect',
    'siu-logo',
  ];
  requiredImageDirs.forEach(dir => {
    const fullPath = path.join(DIRS.images, dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  });
};

// Initialize directories at startup
initDirectories();

// Helper to convert mm to PDF points (1mm = 2.83465 points)
const mmToPt = mm => mm * 2.83465;

// Cache for generated certificates to avoid regenerating on each download
const certificateCache = new Map();

// Purge expired items from cache periodically
setInterval(
  () => {
    const now = Date.now();
    for (const [key, value] of certificateCache.entries()) {
      if (now - value.timestamp > 1000 * 60 * 60) {
        // 1 hour cache
        certificateCache.delete(key);
      }
    }
  },
  1000 * 60 * 15
); // Check every 15 minutes

/**
 * Generate PDF certificate with enhanced design and security features
 * @param {Object} certificateData - Certificate information
 * @param {string} outputPath - Output file path
 * @returns {Promise<string>} - Path to generated PDF
 */
const generateCertificatePDF = async (certificateData, outputPath) => {
  return new Promise((resolve, reject) => {
    try {
      // Create output directory if it doesn't exist
      const outputDir = path.dirname(outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // 强制使用premium模板，无论用户角色
      const templatePath = path.join(__dirname, '../../../public/templates/certificate-premium.svg');
      let svgTemplate;
      
      try {
        svgTemplate = fs.readFileSync(templatePath, 'utf8');
      } catch (err) {
        console.error('Error reading SVG template:', err);
        // Fallback to generating a template dynamically if file doesn't exist
        svgTemplate = generatePremiumCertificateSVG();
      }

      // Replace placeholders in the SVG template
      const recipientName = certificateData.recipientName || 'Student';
      const program = certificateData.program || 'Program';
      const certNumber = certificateData.certificateNumber || `SIU-${new Date().getFullYear()}-${crypto
        .createHash('md5')
        .update(certificateData._id.toString() + Date.now())
        .digest('hex')
        .substring(0, 4)
        .toUpperCase()}`;
      
      // Format issue date
      const issueDate = certificateData.issueDate
        ? new Date(certificateData.issueDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });

      // Replace placeholders
      svgTemplate = svgTemplate
        .replace(/\[RECIPIENT_NAME\]/g, recipientName)
        .replace(/\[PROGRAM\]/g, program)
        .replace(/\[CERTIFICATE_NUMBER\]/g, certNumber)
        .replace(/\[ISSUE_DATE\]/g, issueDate);

      // Create temporary SVG file
      const tempSvgPath = `${outputPath}.svg`;
      fs.writeFileSync(tempSvgPath, svgTemplate);

      // Convert SVG to PDF using sharp or another conversion library
      const SVGtoPDF = require('svg-to-pdfkit');
      
      // Create PDF document
      const doc = new PDFDocument({
        size: 'A4',
        layout: 'landscape',
        margin: 0,
        info: {
          Title: `Certificate - ${recipientName}`,
          Author: 'Stratford International University',
          Subject: `${program} Certificate`,
          Keywords: 'certificate, education, SIU, academic, qualification',
        },
      });

      // Create write stream for output PDF
      const stream = fs.createWriteStream(outputPath);
      doc.pipe(stream);

      // Convert SVG to PDF
      SVGtoPDF(doc, svgTemplate, 0, 0, {
        preserveAspectRatio: 'xMidYMid meet',
        width: doc.page.width,
        height: doc.page.height
      });

      // Finalize the PDF and end the stream
      doc.end();

      stream.on('finish', () => {
        // Clean up temporary SVG file
        try {
          fs.unlinkSync(tempSvgPath);
        } catch (err) {
          console.warn('Could not remove temporary SVG file:', err);
        }
        resolve(outputPath);
      });

      stream.on('error', (err) => {
        reject(new Error(`PDF stream error: ${err.message}`));
      });
    } catch (err) {
      reject(new Error(`Certificate generation failed: ${err.message}`));
    }
  });
};

/**
 * Generate a premium certificate SVG template dynamically
 * This is a fallback if the template file is not found
 */
function generatePremiumCertificateSVG() {
  // 使用图片中的米色背景和金色主题
  const goldColor = '#C19A49';
  const titleColor = '#C19A49';
  const textColor = '#333333';
  const backgroundColor = '#FFFEF0';
  
  // 正确的路径引用
  const logoPath = '/images/logo/logo.svg';
  const presidentSignPath = '/images/signatures/president.svg';
  const directorSignPath = '/images/signatures/director.svg';
  const sealPath = '/images/logo/seal.svg';  // 印章图片
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="900" xmlns="http://www.w3.org/2000/svg">
  <!-- 米色背景 -->
  <rect width="1200" height="900" fill="${backgroundColor}" />
  
  <!-- 星形装饰图案 - 淡金色背景装饰 -->
  <defs>
    <pattern id="starPattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
      <path d="M100,10 L110,40 L140,40 L115,60 L125,90 L100,75 L75,90 L85,60 L60,40 L90,40 Z" fill="${goldColor}" opacity="0.08" />
    </pattern>
  </defs>
  <rect width="1200" height="900" fill="url(#starPattern)" />
  
  <!-- 金色边框 -->
  <rect x="20" y="20" width="1160" height="860" fill="none" stroke="${goldColor}" stroke-width="5" />
  <rect x="40" y="40" width="1120" height="820" fill="none" stroke="${goldColor}" stroke-width="1" />
  
  <!-- 角落装饰 -->
  <path d="M20,20 L70,20 L70,25 L25,25 L25,70 L20,70 Z" fill="${goldColor}" />
  <path d="M1180,20 L1130,20 L1130,25 L1175,25 L1175,70 L1180,70 Z" fill="${goldColor}" />
  <path d="M20,880 L70,880 L70,875 L25,875 L25,830 L20,830 Z" fill="${goldColor}" />
  <path d="M1180,880 L1130,880 L1130,875 L1175,875 L1175,830 L1180,830 Z" fill="${goldColor}" />
  
  <!-- 顶部校徽 -->
  <image x="550" y="40" width="100" height="100" href="${logoPath}" />
  
  <!-- 学校名称 - 上移 -->
  <text x="600" y="100" font-family="Times New Roman, serif" font-size="36" font-weight="bold" text-anchor="middle" fill="#000000">STRATFORD INTERNATIONAL UNIVERSITY</text>
  
  <!-- 证书标题 - 显著的金色 - 上移 -->
  <text x="600" y="170" font-family="Times New Roman, serif" font-size="48" font-weight="bold" text-anchor="middle" fill="${titleColor}">CERTIFICATE OF COMPLETION</text>
  
  <!-- 证书文本 - 上移 -->
  <text x="600" y="240" font-family="Times New Roman, serif" font-size="20" text-anchor="middle" fill="${textColor}">The Stratford International University hereby certifies that</text>
  
  <!-- 接收者姓名 - 大号粗体 - 上移 -->
  <text x="600" y="300" font-family="Times New Roman, serif" font-size="38" font-weight="bold" font-style="italic" text-anchor="middle" fill="#000000">[RECIPIENT_NAME]</text>
  
  <!-- 学位文本 - 上移 -->
  <text x="600" y="350" font-family="Times New Roman, serif" font-size="20" text-anchor="middle" fill="${textColor}">has fulfilled the requirements for the degree of</text>
  
  <!-- 学位名称 - 金色斜体 - 上移 -->
  <text x="600" y="410" font-family="Times New Roman, serif" font-size="34" font-style="italic" font-weight="bold" text-anchor="middle" fill="${titleColor}">[PROGRAM]</text>
  
  <!-- 附加文本 - 上移 -->
  <text x="600" y="470" font-family="Times New Roman, serif" font-size="20" text-anchor="middle" fill="${textColor}">and is awarded this Certificate of Completion with all rights, privileges, and honors appertaining thereto.</text>
  
  <!-- 荣誉标签 -->
  <text x="600" y="520" font-family="Times New Roman, serif" font-size="22" font-style="italic" text-anchor="middle" fill="${goldColor}">Cum Honore</text>
  
  <!-- 日期文本 - 上移 -->
  <text x="600" y="560" font-family="Times New Roman, serif" font-size="20" text-anchor="middle" fill="${textColor}">Awarded Date</text>
  <text x="600" y="595" font-family="Times New Roman, serif" font-size="22" font-weight="bold" text-anchor="middle" fill="${textColor}">[ISSUE_DATE]</text>
  
  <!-- 签名区域 - 增大签名尺寸 -->
  <image x="190" y="620" width="180" height="80" href="${presidentSignPath}" />
  <line x1="150" y1="710" x2="400" y2="710" stroke="${textColor}" stroke-width="1" />
  <text x="275" y="730" font-family="Times New Roman, serif" font-size="16" text-anchor="middle" fill="${textColor}">Prof. Dr. Linda Foster</text>
  <text x="275" y="750" font-family="Times New Roman, serif" font-size="16" text-anchor="middle" fill="${textColor}">University President</text>
  
  <image x="830" y="620" width="180" height="80" href="${directorSignPath}" />
  <line x1="750" y1="710" x2="1000" y2="710" stroke="${textColor}" stroke-width="1" />
  <text x="875" y="730" font-family="Times New Roman, serif" font-size="16" text-anchor="middle" fill="${textColor}">Prof. Dr. James Carpenter</text>
  <text x="875" y="750" font-family="Times New Roman, serif" font-size="16" text-anchor="middle" fill="${textColor}">Director, MBA Program</text>
  
  <!-- 中央印章图像 - 移到红×位置 -->
  <image x="565" y="620" width="70" height="70" href="${sealPath}" />
  
  <!-- 如果没有实际印章图像，则绘制一个圆形印章 -->
  <g display="${sealPath ? 'none' : 'inline'}">
    <circle cx="600" cy="655" r="35" fill="#1A4B8C" stroke="${goldColor}" stroke-width="2" />
    <circle cx="600" cy="655" r="32" fill="#1A4B8C" stroke="${goldColor}" stroke-width="1" />
    <circle cx="600" cy="655" r="25" fill="#1A4B8C" stroke="${goldColor}" stroke-width="1" />
    <text x="600" y="655" font-family="Times New Roman, serif" font-size="12" font-weight="bold" text-anchor="middle" fill="${goldColor}">STRATFORD</text>
    <text x="600" y="665" font-family="Times New Roman, serif" font-size="12" font-weight="bold" text-anchor="middle" fill="${goldColor}">UNIVERSITY</text>
    <text x="600" y="645" font-family="Times New Roman, serif" font-size="16" font-weight="bold" text-anchor="middle" fill="${goldColor}">SIU</text>
  </g>
  
  <!-- 证书编号 - 放在底部中央 -->
  <text x="600" y="830" font-family="Times New Roman, serif" font-size="12" text-anchor="middle" fill="${textColor}">Certificate ID: [CERTIFICATE_NUMBER]</text>
</svg>`;
}

/**
 * Get all certificates for the current user
 */
exports.getAllCertificates = async (req, res) => {
  try {
    // Add pagination support
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalCertificates = await Certificate.countDocuments({ userId: req.user.id });

    const certificates = await Certificate.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      count: certificates.length,
      total: totalCertificates,
      page,
      totalPages: Math.ceil(totalCertificates / limit),
      data: certificates,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve certificates',
      error: process.env.NODE_ENV === 'production' ? null : error.message,
    });
  }
};

/**
 * Get a specific certificate by ID
 */
exports.getCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id).populate('userId', 'name');

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found',
      });
    }

    // Check authorization
    if (certificate.userId._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this certificate',
      });
    }

    res.json({
      success: true,
      data: certificate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve certificate',
      error: process.env.NODE_ENV === 'production' ? null : error.message,
    });
  }
};

/**
 * Create a new certificate request
 */
exports.createCertificateRequest = async (req, res) => {
  try {
    const { program, certificateType, metadata } = req.body;

    if (!program || !certificateType) {
      return res.status(400).json({
        success: false,
        message: 'Please provide program and certificate type',
      });
    }

    const certificate = new Certificate({
      userId: req.user.id,
      program,
      certificateType,
      status: 'pending',
      metadata: metadata || {},
    });

    await certificate.save();

    res.status(201).json({
      success: true,
      message: 'Certificate request submitted successfully',
      data: certificate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create certificate request',
      error: process.env.NODE_ENV === 'production' ? null : error.message,
    });
  }
};

/**
 * Verify a certificate by number
 */
exports.verifyCertificate = async (req, res) => {
  try {
    // 支持GET和POST请求
    let certificateNumber;
    
    if (req.method === 'GET') {
      // 从URL参数获取certificateId
      certificateNumber = req.params.certificateId;
    } else {
      // 从请求体获取certificateNumber (POST)
      certificateNumber = req.body.certificateNumber;
    }

    if (!certificateNumber) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a certificate number',
      });
    }

    // 先尝试通过证书编号查找
    let certificate = await Certificate.findOne({
      certificateNumber,
      status: 'issued',
    }).populate('userId', 'name');

    // 如果找不到，尝试通过ID查找
    if (!certificate) {
      try {
        certificate = await Certificate.findById(certificateNumber).populate('userId', 'name');
      } catch (err) {
        // ID格式无效，继续返回未找到
      }
    }

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found or not yet issued',
      });
    }

    // Check if certificate is expired
    const now = new Date();
    if (certificate.expiryDate && certificate.expiryDate < now) {
      return res.status(400).json({
        success: false,
        message: 'Certificate has expired',
        data: {
          certificateNumber: certificate.certificateNumber || certificate._id,
          status: 'expired',
          expiryDate: certificate.expiryDate,
        },
      });
    }

    res.json({
      success: true,
      message: 'Certificate verified successfully',
      data: {
        _id: certificate._id,
        certificateNumber: certificate.certificateNumber || certificate._id,
        recipient: certificate.userId?.name || certificate.recipientName,
        program: certificate.program,
        certificateType: certificate.certificateType,
        issueDate: certificate.issueDate || certificate.date,
        status: certificate.status,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to verify certificate',
      error: process.env.NODE_ENV === 'production' ? null : error.message,
    });
  }
};

/**
 * Download a certificate
 */
exports.downloadCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id).populate('userId', 'name');

    // Validation checks
    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found',
      });
    }

    if (certificate.userId._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this certificate',
      });
    }

    if (certificate.status !== 'issued') {
      return res.status(400).json({
        success: false,
        message: 'Certificate is not yet issued',
      });
    }

    // Ensure recipient name is set
    if (!certificate.recipientName && certificate.userId && certificate.userId.name) {
      certificate.recipientName = certificate.userId.name;
    } else if (!certificate.recipientName) {
      certificate.recipientName = 'Student';
    }

    // Define file paths
    const pdfFileName = `${certificate.certificateNumber || certificate._id}.pdf`;
    const pdfPath = path.join(DIRS.certificates, pdfFileName);

    // 强制重新生成证书
    let needsGeneration = true;
    
    // 删除之前的缓存项
    const cacheKey = certificate._id.toString();
    if (certificateCache.has(cacheKey)) {
      certificateCache.delete(cacheKey);
    }
    
    // 如果文件存在，删除旧文件
    if (fs.existsSync(pdfPath)) {
      try {
        fs.unlinkSync(pdfPath);
      } catch (err) {
        console.warn('Could not remove old certificate file:', err);
      }
    }

    // Generate the PDF
    await generateCertificatePDF(certificate, pdfPath);

    // Update cache
    certificateCache.set(cacheKey, {
      path: pdfPath,
      timestamp: Date.now(),
    });

    // Prepare download filename
    const sanitizedRecipientName = certificate.recipientName.replace(/[^a-zA-Z0-9]/g, '_');
    const downloadFilename = `SIU-Certificate-${sanitizedRecipientName}-${certificate.certificateNumber || certificate._id}.pdf`;

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${downloadFilename}"`);
    res.setHeader('Cache-Control', 'private, max-age=3600');

    // Send file
    return res.sendFile(path.resolve(pdfPath));
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to download certificate',
      error: process.env.NODE_ENV === 'production' ? null : error.message,
    });
  }
};

/**
 * Get certificate data as base64 (for iframe display)
 */
exports.downloadCertificateBase64 = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id).populate('userId', 'name');

    // Basic validation
    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    if (certificate.userId._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (certificate.status !== 'issued') {
      return res.status(400).json({ success: false, message: 'Certificate not issued' });
    }

    // Set recipient name
    if (!certificate.recipientName && certificate.userId && certificate.userId.name) {
      certificate.recipientName = certificate.userId.name;
    } else if (!certificate.recipientName) {
      certificate.recipientName = 'Student';
    }

    // Define file paths
    const pdfFileName = `${certificate.certificateNumber || certificate._id}.pdf`;
    const pdfPath = path.join(DIRS.certificates, pdfFileName);

    // 强制重新生成证书
    const cacheKey = certificate._id.toString();
    
    // 删除之前的缓存项
    if (certificateCache.has(cacheKey)) {
      certificateCache.delete(cacheKey);
    }
    
    // 如果文件存在，删除旧文件
    if (fs.existsSync(pdfPath)) {
      try {
        fs.unlinkSync(pdfPath);
      } catch (err) {
        console.warn('Could not remove old certificate file:', err);
      }
    }

    // 生成新的PDF
    await generateCertificatePDF(certificate, pdfPath);

    // 更新缓存
    certificateCache.set(cacheKey, {
      path: pdfPath,
      timestamp: Date.now(),
    });

    // Read file as Buffer and convert to base64
    const pdfBuffer = fs.readFileSync(pdfPath);
    const base64Data = pdfBuffer.toString('base64');

    // Return base64 data
    return res.json({
      success: true,
      message: 'Certificate data retrieved successfully',
      data: {
        filename: `certificate-${certificate._id}.pdf`,
        contentType: 'application/pdf',
        base64Data: base64Data,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error generating certificate data',
      error: process.env.NODE_ENV === 'production' ? null : error.message,
    });
  }
};

/**
 * Generate a new SIU certificate
 */
exports.generateSIUCertificate = async (req, res) => {
  try {
    const { recipientName, program, issueDate, certificateNumber } = req.body;

    if (!recipientName || !program) {
      return res.status(400).json({
        success: false,
        message: 'Recipient name and program are required',
      });
    }

    // Generate a secure certificate number if not provided
    const secureNumber =
      certificateNumber ||
      `SIU-${crypto
        .createHash('md5')
        .update(recipientName + program + Date.now())
        .digest('hex')
        .substring(0, 8)
        .toUpperCase()}`;

    // Create certificate record
    const certificate = new Certificate({
      userId: req.user.id,
      recipientName,
      program,
      certificateNumber: secureNumber,
      certificateType: 'professional',
      issueDate: issueDate || new Date(),
      status: 'issued',
    });

    // Save to database
    await certificate.save();

    // Generate PDF
    const pdfFileName = `${certificate.certificateNumber}.pdf`;
    const pdfPath = path.join(DIRS.certificates, pdfFileName);

    await generateCertificatePDF(certificate, pdfPath);

    // Add to cache
    certificateCache.set(certificate._id.toString(), {
      path: pdfPath,
      timestamp: Date.now(),
    });

    res.json({
      success: true,
      message: 'Certificate generated successfully',
      data: {
        certificate,
        downloadUrl: `/api/certificates/${certificate._id}/download?token=${req.token || ''}`,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate certificate',
      error: process.env.NODE_ENV === 'production' ? null : error.message,
    });
  }
};

// Add new streaming endpoint for direct PDF viewing
exports.streamCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id).populate('userId', 'name');

    // Basic validation
    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    if (certificate.userId._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (certificate.status !== 'issued') {
      return res.status(400).json({ success: false, message: 'Certificate not issued' });
    }

    // Define file path
    const pdfFileName = `${certificate.certificateNumber || certificate._id}.pdf`;
    const pdfPath = path.join(DIRS.certificates, pdfFileName);

    // 强制重新生成证书
    const cacheKey = certificate._id.toString();
    
    // 删除之前的缓存项
    if (certificateCache.has(cacheKey)) {
      certificateCache.delete(cacheKey);
    }
    
    // 如果文件存在，删除旧文件
    if (fs.existsSync(pdfPath)) {
      try {
        fs.unlinkSync(pdfPath);
      } catch (err) {
        console.warn('Could not remove old certificate file:', err);
      }
    }

    // Ensure recipient name is set
    if (!certificate.recipientName && certificate.userId && certificate.userId.name) {
      certificate.recipientName = certificate.userId.name;
    } else if (!certificate.recipientName) {
      certificate.recipientName = 'Student';
    }

    // 生成新的PDF
    await generateCertificatePDF(certificate, pdfPath);

    // 更新缓存
    certificateCache.set(cacheKey, {
      path: pdfPath,
      timestamp: Date.now(),
    });

    // Set content headers for direct viewing
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('Cache-Control', 'private, max-age=3600');

    // Stream the file
    fs.createReadStream(pdfPath).pipe(res);
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Failed to stream certificate',
        error: process.env.NODE_ENV === 'production' ? null : error.message,
      });
    }
  }
};
