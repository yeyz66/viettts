import NavBar from '../../components/navbar';
import Footer from '../../components/footer';
import TextToSpeechConverter from '../../components/text-to-speech-converter';
import { AuthGuard } from '../../components/auth/AuthGuard';
import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: '文字转语音 | 快速将文本转换为音频',
  description: '高质量AI文字转语音工具。使用多种自然声音在几秒钟内将文本转换为音频文件。',
  keywords: '文字转语音, text to speech, 语音合成, 文本转音频, 文字朗读',
  alternates: {
    canonical: '/zh/text-to-speech',
  },
  openGraph: {
    title: '文字转语音 | 快速将文本转换为音频',
    description: '高质量AI文字转语音工具。使用多种自然声音在几秒钟内将文本转换为音频文件。',
    url: '/zh/text-to-speech',
    type: 'website',
  }
};

export default function ChineseTextToSpeechPage() {
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
          "name": "文字转语音工具",
          "applicationCategory": "WebApplication",
          "operatingSystem": "All",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "CNY"
          },
          "description": "高质量AI文字转语音工具，帮助用户轻松将文本转换为自然流畅的语音。几秒钟内即可生成音频文件。",
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
              "name": "李明"
            },
            "reviewBody": "这是我用过的最好的文字转语音工具。声音非常自然，使用也很简单。"
          }
        })
      }} />
    </>
  );
} 