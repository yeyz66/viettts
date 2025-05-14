import type { Metadata } from 'next';
import TextToSpeechPage from './client-page';
import TtsEmailVerificationCheck from '../components/auth/TtsEmailVerificationCheck';
import TtsAuthCheck from '../components/auth/TtsAuthCheck';

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

export default function TextToSpeechIndexPage() {
  return (
    <>
      <TtsAuthCheck />
      <TtsEmailVerificationCheck />
      <TextToSpeechPage />
    </>
  );
} 