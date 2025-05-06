import NavBar from '../../components/navbar';
import Footer from '../../components/footer';
import FAQ from '../../components/faq';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '常见问题 | TTL Project',
  description: '查找有关我们文字转语音服务和功能的常见问题解答。',
  alternates: {
    canonical: '/zh/faq',
  },
  openGraph: {
    title: '常见问题 | TTL Project',
    description: '查找有关我们文字转语音服务和功能的常见问题解答。',
    url: '/zh/faq',
    type: 'website',
  }
};

export default function FAQPage() {
  return (
    <>
      <NavBar />
      <main>
        <FAQ />
      </main>
      <Footer />
    </>
  );
} 