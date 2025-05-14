'use client';

import { useEffect, useState, Suspense } from 'react';
import { useAuthStore } from '@/app/store/authStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { applyActionCode, sendEmailVerification } from 'firebase/auth';
import { auth, actionCodeSettings } from '@/app/utils/firebase';
import Link from 'next/link';
import { EmailVerificationBanner } from '@/app/components/auth/EmailVerificationBanner';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const oobCode = searchParams.get('oobCode'); // Firebase verification code
  const mode = searchParams.get('mode'); // Operation mode

  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'waiting'>('loading');
  const [message, setMessage] = useState<string>('');
  const [isResending, setIsResending] = useState<boolean>(false);

  const user = useAuthStore((state) => state.user);
  const isEmailVerified = useAuthStore((state) => state.isEmailVerified);

  useEffect(() => {
    // If not in email verification mode or no verification code, show waiting status
    if (mode !== 'verifyEmail' || !oobCode) {
      setStatus('waiting');
      return;
    }

    // If already logged in and email is verified, redirect to home page
    if (user && isEmailVerified) {
      router.replace('/en');
      return;
    }

    // Apply verification code
    async function verifyEmail() {
      try {
        // 确保oobCode不为null
        if (!oobCode) {
          setStatus('error');
          setMessage('Verification code is missing. Please use the link from your email.');
          return;
        }
        
        await applyActionCode(auth, oobCode);
        setStatus('success');
        setMessage('Your email has been successfully verified!');
        
        // Refresh user status
        if (auth.currentUser) {
          await auth.currentUser.reload();
        }
      } catch (error) {
        console.error('Email verification failed:', error);
        setStatus('error');
        setMessage('The verification link is invalid or has expired. Please request a new verification email.');
      }
    }

    verifyEmail();
  }, [oobCode, mode, user, isEmailVerified, router]);

  // Resend verification email
  async function handleResendVerification() {
    if (!auth.currentUser) {
      setMessage('Please log in before attempting to resend the verification email.');
      return;
    }

    setIsResending(true);
    try {
      await sendEmailVerification(auth.currentUser, actionCodeSettings);
      setMessage('Verification email has been resent. Please check your inbox.');
    } catch (error) {
      console.error('Failed to send verification email:', error);
      setMessage('Failed to send verification email. Please try again later.');
    } finally {
      setIsResending(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center space-y-6 p-6">
      <h1 className="text-2xl font-bold text-center">Email Verification</h1>

      {status === 'loading' && (
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          <p>Verifying your email...</p>
        </div>
      )}

      {status === 'success' && (
        <div className="flex flex-col items-center space-y-4">
          <span className="text-green-500 text-3xl">✓</span>
          <p className="text-center text-green-500">{message}</p>
          <Link href="/en" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
            Go to Homepage
          </Link>
        </div>
      )}

      {status === 'error' && (
        <div className="flex flex-col items-center space-y-4">
          <span className="text-red-500 text-3xl">✗</span>
          <p className="text-center text-red-500">{message}</p>
          {user && (
            <button 
              className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors ${isResending ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleResendVerification}
              disabled={isResending}
            >
              {isResending ? 'Sending...' : 'Resend Verification Email'}
            </button>
          )}
          <Link href="/en/login" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">
            Back to Login
          </Link>
        </div>
      )}

      {status === 'waiting' && (
        <div className="flex flex-col items-center space-y-4">
          <EmailVerificationBanner />
          <p className="text-center mt-4">
            To verify your email address, please open the verification email we sent you and click the link.
          </p>
          {user && !isEmailVerified && (
            <button 
              className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors ${isResending ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleResendVerification}
              disabled={isResending}
            >
              {isResending ? 'Sending...' : 'Resend Verification Email'}
            </button>
          )}
          <Link href="/en" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">
            Back to Homepage
          </Link>
        </div>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-1 flex-col items-center justify-center space-y-6 p-6">
        <h1 className="text-2xl font-bold text-center">Email Verification</h1>
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          <p>Loading...</p>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
} 