import React from 'react';

const CommunityForum = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">社区论坛</h1>
      <p className="text-gray-600 mb-8">社区论坛页面正在开发中，敬请期待...</p>

      <div className="flex justify-end mb-6">
        <button className="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-800">
          发布新话题
        </button>
      </div>

      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map(item => (
          <div key={item} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start space-x-4">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-semibold">
                用户
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2">示例话题 {item}</h2>
                <p className="text-gray-600 mb-4">
                  这是一个示例话题的内容描述，实际内容正在开发中...
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <span>发布于: 2023-05-0{item}</span>
                  <span className="mx-2">•</span>
                  <span>{10 + item} 回复</span>
                  <span className="mx-2">•</span>
                  <span>{20 + item} 浏览</span>
                </div>
              </div>
              <div className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm">
                分类 {item}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <nav className="inline-flex rounded-md shadow">
          <button className="px-3 py-2 bg-white border border-gray-300 text-sm font-medium text-gray-500 hover:bg-gray-50 rounded-l-md">
            上一页
          </button>
          <button className="px-3 py-2 bg-blue-900 border border-blue-900 text-sm font-medium text-white hover:bg-blue-800">
            1
          </button>
          <button className="px-3 py-2 bg-white border border-gray-300 text-sm font-medium text-gray-500 hover:bg-gray-50">
            2
          </button>
          <button className="px-3 py-2 bg-white border border-gray-300 text-sm font-medium text-gray-500 hover:bg-gray-50">
            3
          </button>
          <button className="px-3 py-2 bg-white border border-gray-300 text-sm font-medium text-gray-500 hover:bg-gray-50 rounded-r-md">
            下一页
          </button>
        </nav>
      </div>
    </div>
  );
};

export default CommunityForum;
