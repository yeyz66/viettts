import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Text to Speech | TTL Project",
  description: "Advanced text-to-speech tool. Easily transform text into high-quality AI voice in seconds.",
  keywords: "text to speech, voice synthesis, AI voice generation, text reader, audio creator",
  openGraph: {
    title: 'Text to Speech | TTL Project',
    description: 'Advanced text-to-speech tool. Easily transform text into high-quality AI voice in seconds.',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Text to Speech | TTL Project',
    description: 'Advanced text-to-speech tool. Easily transform text into high-quality AI voice in seconds.',
  },
};

export default function EnglishLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 