import React from 'react';

function KnowledgeBase() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">知识库</h1>
      <p className="text-lg text-gray-600 mb-8">
        欢迎来到斯特拉福德国际大学的知识库。这里提供了与教育、证书和课程相关的各种知识资源。
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* 知识库分类卡片 */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">常见问题</h3>
            <p className="text-gray-600 mb-4">关于课程、证书和注册流程的常见问题解答。</p>
            <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">
              查看更多 &rarr;
            </a>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">教育资源</h3>
            <p className="text-gray-600 mb-4">学习指南、教程和其他教育资源，帮助您取得学术成功。</p>
            <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">
              查看更多 &rarr;
            </a>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">证书指南</h3>
            <p className="text-gray-600 mb-4">关于我们的证书项目、申请流程和验证方法的详细指南。</p>
            <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">
              查看更多 &rarr;
            </a>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">最新文章</h2>

        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-900">如何申请在线学习证书</h3>
            <p className="text-gray-600 mt-2">
              了解申请在线学习证书的步骤和要求，以及获得全球认可的资格证书。
            </p>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-gray-500">发布于：2023年10月15日</span>
              <span className="mx-2 text-gray-500">|</span>
              <a href="#" className="text-blue-600 hover:text-blue-500 text-sm font-medium">
                阅读全文
              </a>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-900">
              证书验证技术：了解区块链如何保障证书安全
            </h3>
            <p className="text-gray-600 mt-2">
              深入了解我们如何使用区块链技术确保证书的真实性和安全性，防止伪造和欺诈。
            </p>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-gray-500">发布于：2023年9月28日</span>
              <span className="mx-2 text-gray-500">|</span>
              <a href="#" className="text-blue-600 hover:text-blue-500 text-sm font-medium">
                阅读全文
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KnowledgeBase;
