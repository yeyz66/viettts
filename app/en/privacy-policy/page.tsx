import NavBar from '../../components/navbar';
import Footer from '../../components/footer';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Privacy Policy | TTL Text-to-Speech Platform',
  description: 'Learn how we collect, use, store, and protect your personal information. We are committed to protecting your privacy and data security.',
  keywords: 'privacy policy, data protection, personal information, text to speech',
  alternates: {
    canonical: '/en/privacy-policy',
  },
  openGraph: {
    title: 'Privacy Policy | TTL Text-to-Speech Platform',
    description: 'Learn how we collect, use, store, and protect your personal information. We are committed to protecting your privacy and data security.',
    url: '/en/privacy-policy',
    type: 'website',
  }
};

export default function EnPrivacyPolicyPage() {
  return (
    <>
      <NavBar />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Privacy Policy</h1>
        <div className="prose prose-lg max-w-none">
          <p className="text-sm text-gray-500 mb-6 text-center">Last Updated: {new Date().toISOString().split('T')[0]}</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p>Welcome to the TTL Text-to-Speech Platform (hereinafter referred to as &ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;the Platform&rdquo;). We highly value your privacy and the protection of your personal information. This Privacy Policy aims to explain how we collect, use, store, and protect your personal information, as well as the rights you have regarding this information.</p>
            <p>By using our services, you agree to the data practices described in this Privacy Policy. If you do not agree with any part of this Privacy Policy, please discontinue using our services.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            <p>We may collect the following types of information:</p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Account Information</strong>: When you register for an account, we collect your email address, password (stored in encrypted form), username, and other optional profile information.</li>
              <li><strong>Usage Data</strong>: We collect data about how you use our services, including the text content you convert, voice types selected, audio files generated, and usage frequency statistics.</li>
              <li><strong>Device Information</strong>: We may collect technical information such as your IP address, device type, operating system, browser type, language settings, etc.</li>
              <li><strong>Payment Information</strong>: If you purchase our services, we collect necessary payment information, but complete payment card details are securely processed by our payment processing partners.</li>
              <li><strong>Communication Data</strong>: When you contact our customer support team, we keep records of these communications.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p>We use the collected information to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide, maintain, and improve our text-to-speech services</li>
              <li>Create and manage your account</li>
              <li>Process your subscriptions and payments</li>
              <li>Send service notifications and updates</li>
              <li>Respond to your inquiries and requests</li>
              <li>Monitor service usage to prevent abuse</li>
              <li>Analyze usage patterns to improve user experience</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Information Sharing</h2>
            <p>We do not sell your personal information. We only share your information in the following circumstances:</p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Service Providers</strong>: We use third-party service providers to help us deliver services, such as cloud storage, payment processing, and analytics services. These providers can only access information necessary to perform services and must protect your information.</li>
              <li><strong>Legal Requirements</strong>: We may disclose your information if required by law or if government agencies make legitimate requests.</li>
              <li><strong>Business Transfers</strong>: If we are involved in a merger, acquisition, or asset sale, your information may be transferred as part of the transferred assets.</li>
              <li><strong>With Your Consent</strong>: We may share your information in other ways if you consent to it.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
            <p>We implement reasonable security measures to protect your personal information from unauthorized access, disclosure, modification, or destruction. These measures include data encryption, secure servers, and regular security reviews.</p>
            <p>However, please note that despite our efforts to protect your information, no method of transmission over the Internet or electronic storage is 100% secure.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
            <p>Depending on the privacy laws in your region, you may have the following rights:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Access personal information we hold about you</li>
              <li>Correct inaccurate or incomplete personal information</li>
              <li>Request deletion of your personal information</li>
              <li>Restrict or object to our processing of your personal information</li>
              <li>Data portability (receiving your data in a structured, commonly used, and machine-readable format)</li>
              <li>Withdraw consent you previously provided</li>
            </ul>
            <p>To exercise these rights, please contact us using the contact information provided below.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Cookies and Similar Technologies</h2>
            <p>We use cookies and similar technologies to collect and store information about your device and browsing activities. These technologies help us identify you, save your preferences, provide personalized experiences, analyze website traffic, and improve our services.</p>
            <p>You can control the use of cookies through your browser settings. However, disabling cookies may affect your experience of our services.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Children's Privacy</h2>
            <p>Our services are not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If you discover that we may have collected personal information from a child under 13, please contact us immediately, and we will take steps to remove this information.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. International Data Transfers</h2>
            <p>Your personal information may be transferred to and stored on servers located outside your country/region. We will ensure that such transfers comply with applicable data protection laws and that your information is adequately protected.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. When we make significant changes, we will post a notice on our website and update the &ldquo;Last Updated&rdquo; date at the top of this page.</p>
            <p>We encourage you to review this Privacy Policy periodically to stay informed about how we are protecting your information.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
            <p>If you have any questions, comments, or requests regarding this Privacy Policy, please contact us through:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Email: uul0504@gmail.com</li>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
} 