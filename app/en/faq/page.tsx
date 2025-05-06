import NavBar from '../../components/navbar';
import Footer from '../../components/footer';
import FAQ from '../../components/faq';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | TTL Project',
  description: 'Find answers to commonly asked questions about our text-to-speech services and functionality.',
  alternates: {
    canonical: '/en/faq',
  },
  openGraph: {
    title: 'Frequently Asked Questions | TTL Project',
    description: 'Find answers to commonly asked questions about our text-to-speech services and functionality.',
    url: '/en/faq',
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