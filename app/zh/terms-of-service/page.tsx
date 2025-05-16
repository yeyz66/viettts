import NavBar from '../../components/navbar';
import Footer from '../../components/footer';
import TermsOfService from '../../components/terms-of-service';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "服务条款 | TTL Project",
  description: "TTL Project的服务条款和使用条件。了解我们的服务规则、用户责任、内容政策和隐私保护措施。",
  keywords: "服务条款, 使用条件, 用户协议, 法律条款, TTL Project",
  openGraph: {
    title: '服务条款 | TTL Project',
    description: 'TTL Project的服务条款和使用条件。了解我们的服务规则、用户责任、内容政策和隐私保护措施。',
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '服务条款 | TTL Project',
    description: 'TTL Project的服务条款和使用条件。了解我们的服务规则、用户责任、内容政策和隐私保护措施。',
  },
};

export default function TermsOfServicePage() {
  return (
    <>
      <NavBar />
      <main>
        <TermsOfService />
      </main>
      <Footer />
    </>
  );
} 