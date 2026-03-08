const certificatesData = [
  {
    id: 'siu-harvard-cert-2023',
    name: 'Harvard Style Certificate',
    certificateId: 'SIUHV-2023-001',
    course: 'Master of Business Administration',
    date: '2023-12-15',
    image: `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="300" fill="#f8f9fa" stroke="#cccccc" stroke-width="2" />
  <text x="200" y="150" font-family="Arial, sans-serif" font-size="24" text-anchor="middle" fill="#999">Certificate Preview</text>
</svg>
`)}`,
    visible: true,
  },
  {
    id: 'siu-oxford-cert-2023',
    name: 'Oxford Style Certificate',
    certificateId: 'SIUOX-2023-001',
    course: 'Master of Science in Artificial Intelligence',
    date: '2023-12-15',
    image: `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="300" fill="#f8f9fa" stroke="#cccccc" stroke-width="2" />
  <text x="200" y="150" font-family="Arial, sans-serif" font-size="24" text-anchor="middle" fill="#999">Oxford Style Certificate</text>
</svg>
`)}`,
    visible: true,
  },
  {
    id: 'siu-test-cert-2023',
    name: '高对比度测试证书',
    certificateId: 'SIUTEST-2023-001',
    course: '计算机科学学士',
    date: '2023-12-15',
    image: `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="300" fill="#f8f9fa" stroke="#cccccc" stroke-width="2" />
  <text x="200" y="150" font-family="Arial, sans-serif" font-size="24" text-anchor="middle" fill="#999">高对比度测试证书</text>
</svg>
`)}`,
    visible: true,
  },
  {
    id: 'siu-nobg-cert-2023',
    name: '纯文本证书（无背景）',
    certificateId: 'SIUNOBG-2023-001',
    course: '工商管理硕士',
    date: '2023-12-15',
    image: `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="300" fill="#ffffff" stroke="#eeeeee" stroke-width="2" />
  <text x="200" y="150" font-family="Arial, sans-serif" font-size="24" text-anchor="middle" fill="#333">纯文本证书（无背景）</text>
</svg>
`)}`,
    visible: true,
  },
];

export default certificatesData;
