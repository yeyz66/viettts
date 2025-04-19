import NavBar from '../components/navbar';
import Footer from '../components/footer';
import TextToSpeechConverter from '../components/text-to-speech-converter';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Text to Speech | Convert Text to Voice',
  description: 'Convert text to natural-sounding speech with our AI-powered tool. Create high-quality audio from text in seconds.',
  alternates: {
    canonical: '/text-to-speech',
  },
  openGraph: {
    title: 'Text to Speech | Convert Text to Voice',
    description: 'Convert text to natural-sounding speech with our AI-powered tool. Create high-quality audio from text in seconds.',
    url: '/text-to-speech',
    type: 'website',
  }
};

export default function TextToSpeechPage() {
  return (
    <>
      <NavBar />
      <main>
        <TextToSpeechConverter />
      </main>
      <Footer />
    </>
  );
} 