import NavBar from '../../components/navbar';
import Footer from '../../components/footer';
import TextToSpeechConverter from '../../components/text-to-speech-converter';
import { AuthGuard } from '../../components/auth/AuthGuard';
import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Chuyển Văn Bản Thành Giọng Nói | Tạo Audio Từ Text Nhanh Chóng',
  description: 'Công cụ chuyển văn bản thành giọng nói AI chất lượng cao. Tạo file âm thanh từ văn bản chỉ trong vài giây với nhiều giọng đọc tự nhiên.',
  keywords: 'chuyển văn bản thành giọng nói, text to speech vietnamese, tạo giọng đọc từ văn bản, công cụ chuyển text thành speech, văn bản sang âm thanh',
  alternates: {
    canonical: '/vi/text-to-speech',
  },
  openGraph: {
    title: 'Chuyển Văn Bản Thành Giọng Nói | Tạo Audio Từ Text Nhanh Chóng',
    description: 'Công cụ chuyển văn bản thành giọng nói AI chất lượng cao. Tạo file âm thanh từ văn bản chỉ trong vài giây với nhiều giọng đọc tự nhiên.',
    url: '/vi/text-to-speech',
    type: 'website',
  }
};

export default function VietnameseTextToSpeechPage() {
  return (
    <>
      <NavBar />
      <main>
        <AuthGuard requireEmailVerification={true}>
          <TextToSpeechConverter />
        </AuthGuard>
      </main>
      <Footer />
      
      <Script id="schema-structured-data" type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Chuyển Văn Bản Thành Giọng Nói",
          "applicationCategory": "WebApplication",
          "operatingSystem": "All",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "VND"
          },
          "description": "Công cụ chuyển văn bản thành giọng nói AI chất lượng cao dành cho người dùng Việt Nam. Dễ dàng tạo file âm thanh từ văn bản chỉ trong vài giây.",
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "156"
          },
          "review": {
            "@type": "Review",
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": "5",
              "bestRating": "5"
            },
            "author": {
              "@type": "Person",
              "name": "Nguyễn Văn A"
            },
            "reviewBody": "Ứng dụng chuyển văn bản thành giọng nói tốt nhất tôi từng dùng. Giọng đọc rất tự nhiên và dễ sử dụng."
          }
        })
      }} />
    </>
  );
} 