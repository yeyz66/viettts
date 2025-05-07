import NavBar from '../components/navbar';
import Footer from '../components/footer';
import PrivacyPolicy from '../components/privacy-policy';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | viettts',
  description: 'Privacy Policy for viettts text-to-speech service.',
  alternates: {
    canonical: '/privacy-policy',
  },
  openGraph: {
    title: 'Privacy Policy | viettts',
    description: 'Privacy Policy for viettts text-to-speech service.',
    url: '/privacy-policy',
    type: 'website',
  }
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <NavBar />
      <main>
        <PrivacyPolicy />
      </main>
      <Footer />
    </>
  );
} 