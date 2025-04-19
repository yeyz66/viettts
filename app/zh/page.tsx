import NavBar from '../components/navbar';
import Hero from '../components/hero';
import Features from '../components/features';
import Testimonials from '../components/testimonials';
import Footer from '../components/footer';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '文字转语音 | 高质量AI语音生成工具',
  description: '免费AI文字转语音工具。使用多种声音选项将文本转换为自然流畅的语音。',
};

export default function ChineseHomepage() {
  return (
    <>
      <NavBar />
      <div className="bg-indigo-600 py-3 text-center">
        <Link href="/zh/text-to-speech" className="text-white font-semibold hover:underline">
          点击这里进入文字转语音页面 →
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