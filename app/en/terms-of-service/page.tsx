import NavBar from '../../components/navbar';
import Footer from '../../components/footer';
import TermsOfService from '../../components/terms-of-service';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | TTL Project",
  description: "Terms of Service and conditions of use for TTL Project. Learn about our service rules, user responsibilities, content policies, and privacy protection measures.",
  keywords: "terms of service, conditions of use, user agreement, legal terms, TTL Project",
  openGraph: {
    title: 'Terms of Service | TTL Project',
    description: 'Terms of Service and conditions of use for TTL Project. Learn about our service rules, user responsibilities, content policies, and privacy protection measures.',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service | TTL Project',
    description: 'Terms of Service and conditions of use for TTL Project. Learn about our service rules, user responsibilities, content policies, and privacy protection measures.',
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