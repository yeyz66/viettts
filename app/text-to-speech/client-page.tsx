'use client';

import NavBar from '../components/navbar';
import Footer from '../components/footer';
import TextToSpeechConverter from '../components/text-to-speech-converter';
import { AuthGuard } from '../components/auth/AuthGuard';

export default function TextToSpeechPage() {
  return (
    <>
      <NavBar />
      <main>
        <AuthGuard requireEmailVerification={true}>
          <TextToSpeechConverter />
        </AuthGuard>
      </main>
      <Footer />
    </>
  );
} 