import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="bg-white">
      {/* 页面头部 */}
      <div className="relative">
        {/* 背景图片 */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("/images/general/about-us.jpg")',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            height: '500px',
          }}
        ></div>
        <div className="absolute inset-0 bg-[#003087] opacity-70" style={{ height: '500px' }}></div>
        <div className="relative max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl drop-shadow-lg">
            关于我们
          </h1>
          <p className="mt-6 text-xl text-white max-w-3xl whitespace-nowrap">
            了解郑树国际教育集团的使命、愿景和价值观。
          </p>
        </div>
      </div>

      {/* 使命和愿景 */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">我们的使命与愿景</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              我们致力于通过提供高质量的国际教育，培养具有全球视野和创新精神的未来领导者。
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="bg-blue-50 p-8 rounded-lg">
              <h3 className="text-xl font-bold text-[#003087] mb-4">我们的使命</h3>
              <p className="text-gray-700">
                提供世界一流的教育体验，培养学生成为具有国际视野、批判性思维和创新能力的全球公民。
              </p>
            </div>
            <div className="bg-yellow-50 p-8 rounded-lg">
              <h3 className="text-xl font-bold text-[#D4A017] mb-4">我们的愿景</h3>
              <p className="text-gray-700">
                成为全球领先的教育机构，通过创新的教学方法和跨文化合作，塑造未来领导者。
              </p>
            </div>
            <div className="bg-green-50 p-8 rounded-lg">
              <h3 className="text-xl font-bold text-green-700 mb-4">我们的价值观</h3>
              <p className="text-gray-700">
                卓越、诚信、包容、创新、全球视野是指导我们所有行动和决策的核心价值观。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 学校历史 */}
      <div className="py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 space-y-8 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">学校历史</h2>
            <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-500">
              自2005年成立以来，我们一直致力于提供卓越教育和培养全球领导者。
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-2 text-gray-500">我们的历程</span>
            </div>
          </div>

          <div className="space-y-8">
            <div className="lg:grid lg:grid-cols-7 lg:gap-8 lg:items-center">
              <div className="lg:col-span-2">
                <h3 className="text-2xl font-bold text-gray-900">2005年</h3>
                <p className="mt-2 text-lg text-gray-500">
                  Global Horizon University 在新加坡成立，最初提供商业和技术领域的学士课程。
                </p>
              </div>
              <div className="mt-6 lg:mt-0 lg:col-span-5">
                <img
                  className="rounded-lg shadow-lg object-cover w-full h-80"
                  src="/images/founding.jpg"
                  alt="大学成立"
                />
              </div>
            </div>

            <div className="lg:grid lg:grid-cols-7 lg:gap-8 lg:items-center">
              <div className="lg:col-span-5">
                <img
                  className="rounded-lg shadow-lg object-cover w-full h-80"
                  src="/images/expansion.jpg"
                  alt="校园扩展"
                />
              </div>
              <div className="mt-6 lg:mt-0 lg:col-span-2">
                <h3 className="text-2xl font-bold text-gray-900">2010年</h3>
                <p className="mt-2 text-lg text-gray-500">
                  扩展课程，增加了硕士和博士项目，并在亚洲和欧洲开设了新校区。
                </p>
              </div>
            </div>

            <div className="lg:grid lg:grid-cols-7 lg:gap-8 lg:items-center">
              <div className="lg:col-span-2">
                <h3 className="text-2xl font-bold text-gray-900">2015年</h3>
                <p className="mt-2 text-lg text-gray-500">
                  获得多项国际认证，并启动了全球在线学习平台，使教育机会更加普及。
                </p>
              </div>
              <div className="mt-6 lg:mt-0 lg:col-span-5">
                <img
                  className="rounded-lg shadow-lg object-cover w-full h-80"
                  src="/images/online.jpg"
                  alt="在线学习"
                />
              </div>
            </div>

            <div className="lg:grid lg:grid-cols-7 lg:gap-8 lg:items-center">
              <div className="lg:col-span-5">
                <img
                  className="rounded-lg shadow-lg object-cover w-full h-80"
                  src="/images/today.jpg"
                  alt="今天的校园"
                />
              </div>
              <div className="mt-6 lg:mt-0 lg:col-span-2">
                <h3 className="text-2xl font-bold text-gray-900">今天</h3>
                <p className="mt-2 text-lg text-gray-500">
                  现在，我们在全球拥有超过15,000名学生，提供100多个学位和证书项目，并继续致力于教育创新和全球合作。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 学校数据 */}
      <div className="bg-blue-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Global Horizon University 数据
            </h2>
            <p className="mt-3 text-xl text-blue-200 sm:mt-4">
              我们以这些数字为荣，它们体现了我们对教育质量和学生成功的承诺。
            </p>
          </div>
          <dl className="mt-10 text-center sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-3 sm:gap-8">
            <div className="flex flex-col">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-blue-200">毕业生</dt>
              <dd className="order-1 text-5xl font-extrabold text-white">25,000+</dd>
            </div>
            <div className="flex flex-col mt-10 sm:mt-0">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-blue-200">
                国家和地区
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-white">120+</dd>
            </div>
            <div className="flex flex-col mt-10 sm:mt-0">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-blue-200">就业率</dt>
              <dd className="order-1 text-5xl font-extrabold text-white">94%</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* 号召性用语 */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block">准备好开始您的学习之旅了吗？</span>
            <span className="block text-blue-800">今天就加入我们的全球社区。</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/courses"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-800 hover:bg-blue-900"
              >
                浏览课程
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-800 bg-white hover:bg-gray-50"
              >
                联系我们
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
