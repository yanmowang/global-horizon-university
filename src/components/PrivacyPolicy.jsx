import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-8">隐私政策</h1>

        <div className="prose prose-blue prose-lg">
          <p className="text-gray-500 mb-4">最近更新日期: 2023年10月15日</p>

          <h2 className="text-xl font-bold mt-8 mb-4">1. 引言</h2>
          <p>
            Stratford International University
            (以下简称&quot;SIU&quot;、&quot;我们&quot;或&quot;本大学&quot;)尊重您的隐私，致力于保护您的个人数据。本隐私政策将告诉您我们如何收集、使用、处理和保护您的个人信息。
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">2. 我们收集的信息</h2>
          <p>为了提供教育服务和改进用户体验，我们可能会收集以下类型的信息:</p>
          <ul className="list-disc pl-6 my-4">
            <li>个人识别信息 (如姓名、电子邮件地址、电话号码)</li>
            <li>教育背景和学术记录</li>
            <li>财务信息 (用于学费支付和财务援助)</li>
            <li>用户生成内容 (如论文、考试答案、项目作业)</li>
            <li>技术和使用数据 (如IP地址、浏览器类型、访问时间)</li>
          </ul>

          <h2 className="text-xl font-bold mt-8 mb-4">3. 信息使用</h2>
          <p>我们使用收集的信息来:</p>
          <ul className="list-disc pl-6 my-4">
            <li>提供、维护和改进我们的教育服务</li>
            <li>处理入学申请、学费支付和证书颁发</li>
            <li>与您沟通并回应您的问题</li>
            <li>进行研究和分析以改进我们的教学方法和课程设计</li>
            <li>遵守法律义务和保护我们的合法权益</li>
          </ul>

          <h2 className="text-xl font-bold mt-8 mb-4">4. 信息共享</h2>
          <p>我们不会出售您的个人信息。我们可能在以下情况下共享您的信息:</p>
          <ul className="list-disc pl-6 my-4">
            <li>与提供支持服务的第三方服务提供商</li>
            <li>符合法律要求或保护我们的合法权益</li>
            <li>在获得您明确同意的情况下</li>
          </ul>

          <h2 className="text-xl font-bold mt-8 mb-4">5. 信息安全</h2>
          <p>
            我们采取适当的技术和组织措施来保护您的个人数据不被未经授权的访问、使用或披露。我们定期审查我们的安全措施以确保其有效性。
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">6. 您的权利</h2>
          <p>根据适用的数据保护法律，您可能拥有以下权利:</p>
          <ul className="list-disc pl-6 my-4">
            <li>访问您的个人数据</li>
            <li>更正不准确的数据</li>
            <li>删除您的个人数据</li>
            <li>限制或反对处理您的数据</li>
            <li>数据可携带性</li>
          </ul>

          <h2 className="text-xl font-bold mt-8 mb-4">7. Cookie政策</h2>
          <p>
            我们使用Cookie和类似技术来提升您的浏览体验、个性化内容和广告、提供社交媒体功能并分析我们的流量。您可以通过浏览器设置控制Cookie的使用。
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">8. 隐私政策更新</h2>
          <p>
            我们可能会不时更新本隐私政策。当我们进行实质性更改时，我们会在网站上发布更新的政策并更新&quot;最近更新日期&quot;。
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">9. 联系我们</h2>
          <p>如果您对本隐私政策有任何疑问或希望行使您的数据保护权利，请联系我们的数据保护官:</p>
          <p className="mt-2">
            电子邮件: privacy@stratfordinternational.edu
            <br />
            电话: +1-555-123-4567
            <br />
            地址: 123 Education Lane, Academic City, 10001
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
