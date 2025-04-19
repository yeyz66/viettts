import NavBar from '../components/navbar';
import Hero from '../components/hero';
import Features from '../components/features';
import Testimonials from '../components/testimonials';
import Footer from '../components/footer';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Text to Speech | AI-Powered Voice Generation',
  description: 'Free AI text-to-speech tool. Convert text to natural-sounding speech with multiple voice options.',
};

export default function EnglishHomepage() {
  return (
    <>
      <NavBar />
      <div className="bg-indigo-600 py-3 text-center">
        <Link href="/en/text-to-speech" className="text-white font-semibold hover:underline">
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