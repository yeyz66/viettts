import NavBar from '../components/navbar';
import Hero from '../components/hero';
import Features from '../components/features';
import Testimonials from '../components/testimonials';
import Footer from '../components/footer';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chuyển Văn Bản Thành Giọng Nói | Công Cụ AI Chất Lượng Cao',
  description: 'Công cụ chuyển văn bản thành giọng nói AI miễn phí. Tạo giọng nói tự nhiên từ văn bản với nhiều lựa chọn giọng đọc.',
};

export default function VietnameseHomepage() {
  return (
    <>
      <NavBar />
      <div className="bg-indigo-600 py-3 text-center">
        <Link href="/vi/text-to-speech" className="text-white font-semibold hover:underline">
          Chuyển văn bản thành giọng nói - Nhấn vào đây →
        </Link>
      </div>
      <main>
        <Hero />
        <Features />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
} 