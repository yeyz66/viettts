import NavBar from '../../components/navbar';
import Footer from '../../components/footer';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: '隐私政策 | TTL文字转语音平台',
  description: '了解我们如何收集、使用、存储和保护您的个人信息。我们致力于保护您的隐私和数据安全。',
  keywords: '隐私政策, 数据保护, 个人信息, 文字转语音',
  alternates: {
    canonical: '/zh/privacy-policy',
  },
  openGraph: {
    title: '隐私政策 | TTL文字转语音平台',
    description: '了解我们如何收集、使用、存储和保护您的个人信息。我们致力于保护您的隐私和数据安全。',
    url: '/zh/privacy-policy',
    type: 'website',
  }
};

export default function ZhPrivacyPolicyPage() {
  return (
    <>
      <NavBar />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center">隐私政策</h1>
        <div className="prose prose-lg max-w-none">
          <p className="text-sm text-gray-500 mb-6 text-center">最后更新日期：{new Date().toISOString().split('T')[0]}</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. 引言</h2>
            <p>欢迎访问TTL文字转语音平台（以下简称"我们"、"本平台"）。我们非常重视您的隐私和个人信息保护。本隐私政策旨在向您说明我们如何收集、使用、存储和保护您的个人信息，以及您对这些信息所拥有的权利。</p>
            <p>使用我们的服务即表示您同意本隐私政策中描述的数据实践。如果您不同意本隐私政策的任何部分，请停止使用我们的服务。</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. 信息收集</h2>
            <p>我们可能收集以下类型的信息：</p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>账户信息</strong>：当您注册账户时，我们会收集您的电子邮件地址、密码（经加密存储）、用户名和其他可选的个人资料信息。</li>
              <li><strong>使用数据</strong>：我们收集有关您如何使用我们服务的数据，包括您转换的文本内容、选择的语音类型、生成的音频文件以及使用频率等统计信息。</li>
              <li><strong>设备信息</strong>：我们可能收集您的IP地址、设备类型、操作系统、浏览器类型、语言设置等技术信息。</li>
              <li><strong>付款信息</strong>：如果您购买我们的服务，我们会收集必要的支付信息，但完整的支付卡详情由我们的支付处理合作伙伴安全处理。</li>
              <li><strong>通信数据</strong>：当您与我们的客户支持团队联系时，我们会保存这些通信记录。</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. 信息使用</h2>
            <p>我们使用收集的信息用于：</p>
            <ul className="list-disc pl-6 mb-4">
              <li>提供、维护和改进我们的文字转语音服务</li>
              <li>创建和管理您的账户</li>
              <li>处理您的订阅和支付</li>
              <li>发送服务通知和更新</li>
              <li>回应您的查询和请求</li>
              <li>监控服务使用情况以防止滥用</li>
              <li>分析使用模式以改进用户体验</li>
              <li>遵守法律义务</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. 信息共享</h2>
            <p>我们不会出售您的个人信息。我们仅在以下情况下共享您的信息：</p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>服务提供商</strong>：我们使用第三方服务提供商来帮助我们提供服务，如云存储、支付处理和分析服务。这些提供商仅能访问执行服务所需的信息，并且必须保护您的信息。</li>
              <li><strong>法律要求</strong>：如果法律要求或政府机构有合法要求，我们可能会披露您的信息。</li>
              <li><strong>业务转让</strong>：如果我们参与合并、收购或资产出售，您的信息可能会作为转让资产的一部分。</li>
              <li><strong>经您同意</strong>：在您同意的情况下，我们可能会以其他方式共享您的信息。</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. 数据安全</h2>
            <p>我们采取合理的安全措施来保护您的个人信息，防止未经授权的访问、披露、修改或损毁。这些措施包括数据加密、安全服务器和定期安全审查。</p>
            <p>然而，请注意，尽管我们努力保护您的信息，但互联网上的传输方法或电子存储方法都不是100%安全的。</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. 您的权利</h2>
            <p>根据您所在地区的隐私法律，您可能拥有以下权利：</p>
            <ul className="list-disc pl-6 mb-4">
              <li>访问我们持有的关于您的个人信息</li>
              <li>更正不准确或不完整的个人信息</li>
              <li>要求删除您的个人信息</li>
              <li>限制或反对我们处理您的个人信息</li>
              <li>数据可携带性（即以结构化、常用和机器可读的格式接收您的数据）</li>
              <li>撤回您之前给予的同意</li>
            </ul>
            <p>如需行使这些权利，请通过下方提供的联系方式联系我们。</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Cookie和类似技术</h2>
            <p>我们使用Cookie和类似技术来收集和存储有关您的设备和浏览活动的信息。这些技术帮助我们识别您、保存您的偏好、提供个性化体验、分析网站流量并改进我们的服务。</p>
            <p>您可以通过浏览器设置控制Cookie的使用。然而，禁用Cookie可能会影响您对我们服务的体验。</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. 儿童隐私</h2>
            <p>我们的服务不面向13岁以下的儿童。我们不会故意收集13岁以下儿童的个人信息。如果您发现我们可能收集了13岁以下儿童的个人信息，请立即联系我们，我们将采取措施删除这些信息。</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. 国际数据传输</h2>
            <p>您的个人信息可能会被传输至并存储在您所在国家/地区以外的服务器上。我们将确保此类传输符合适用的数据保护法律，并且您的信息受到充分的保护。</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. 政策变更</h2>
            <p>我们可能会不时更新本隐私政策。当我们作出重大更改时，我们将在网站上发布通知并更新页面顶部的"最后更新日期"。</p>
            <p>我们鼓励您定期查看本隐私政策，以了解我们如何保护您的信息。</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. 联系我们</h2>
            <p>如果您对本隐私政策有任何疑问、意见或请求，请通过以下方式联系我们：</p>
            <ul className="list-disc pl-6 mb-4">
              <li>电子邮件：uul0504@gmail.com</li>
            </ul>
          </section>
          
          <div className="text-sm text-gray-500 mt-12 border-t pt-6">
            <p>注意：本隐私政策中文版仅供参考，如有争议，请以英文版为准。</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 