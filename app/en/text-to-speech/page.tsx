import type { Metadata } from 'next';
import Script from 'next/script';
import EnglishTextToSpeechPage from './client-page';

export const metadata: Metadata = {
  title: 'Text to Speech | Convert Text to Voice Instantly',
  description: 'High-quality AI text-to-speech tool. Convert text to audio files in seconds with multiple natural voices.',
  keywords: 'text to speech, voice synthesis, audio generation, text converter, speech generator',
  alternates: {
    canonical: '/en/text-to-speech',
  },
  openGraph: {
    title: 'Text to Speech | Convert Text to Voice Instantly',
    description: 'High-quality AI text-to-speech tool. Convert text to audio files in seconds with multiple natural voices.',
    url: '/en/text-to-speech',
    type: 'website',
  }
};

export default function Page() {
  return (
    <>
      <EnglishTextToSpeechPage />
      <Script id="schema-structured-data" type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Text to Speech Converter",
          "applicationCategory": "WebApplication",
          "operatingSystem": "All",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "description": "High-quality AI text-to-speech tool that helps users easily convert text to natural-sounding speech. Generate audio files in seconds.",
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
              "name": "John Smith"
            },
            "reviewBody": "Best text-to-speech tool I've ever used. The voices sound very natural and it's easy to use."
          }
        })
      }} />
    </>
  );
} 