import NavBar from '../../components/navbar';
import Footer from '../../components/footer';
import FAQ from '../../components/faq';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Câu hỏi thường gặp | TTL Project',
  description: 'Tìm câu trả lời cho các câu hỏi thường gặp về dịch vụ và chức năng chuyển văn bản thành giọng nói của chúng tôi.',
  alternates: {
    canonical: '/vi/faq',
  },
  openGraph: {
    title: 'Câu hỏi thường gặp | TTL Project',
    description: 'Tìm câu trả lời cho các câu hỏi thường gặp về dịch vụ và chức năng chuyển văn bản thành giọng nói của chúng tôi.',
    url: '/vi/faq',
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