import NavBar from './components/navbar';
import Hero from './components/hero';
import Features from './components/features';
import Testimonials from './components/testimonials';
import Footer from './components/footer';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TTL Project | AI-Powered Text to Speech',
  description: 'Convert text to natural-sounding speech with our free AI-powered text-to-speech tool.',
};

export default function Home() {
  return (
    <>
      <NavBar />
      <div className="bg-indigo-600 py-3 text-center">
        <Link href="/text-to-speech" className="text-white font-semibold hover:underline">
          Try our Text-to-Speech converter →
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
