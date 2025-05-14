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
  const oobCode = searchParams.get('oobCode'); // Firebase 验证码
  const mode = searchParams.get('mode'); // 操作模式

  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'waiting'>('loading');
  const [message, setMessage] = useState<string>('');
  const [isResending, setIsResending] = useState<boolean>(false);

  const user = useAuthStore((state) => state.user);
  const isEmailVerified = useAuthStore((state) => state.isEmailVerified);

  useEffect(() => {
    // 如果不是验证邮箱的模式或没有验证码，显示等待状态
    if (mode !== 'verifyEmail' || !oobCode) {
      setStatus('waiting');
      return;
    }

    // 如果已经登录并且邮箱已验证，跳转到首页
    if (user && isEmailVerified) {
      router.replace('/');
      return;
    }

    // 应用验证码
    async function verifyEmail() {
      try {
        // 确保oobCode不为null
        if (!oobCode) {
          setStatus('error');
          setMessage('验证码缺失，请使用邮件中的链接。');
          return;
        }
        
        await applyActionCode(auth, oobCode);
        setStatus('success');
        setMessage('您的邮箱已成功验证！');
        
        // 刷新用户状态
        if (auth.currentUser) {
          await auth.currentUser.reload();
        }
      } catch (error) {
        console.error('验证邮箱失败:', error);
        setStatus('error');
        setMessage('验证链接无效或已过期，请重新发送验证邮件。');
      }
    }

    verifyEmail();
  }, [oobCode, mode, user, isEmailVerified, router]);

  // 重新发送验证邮件
  async function handleResendVerification() {
    if (!auth.currentUser) {
      setMessage('请先登录后再尝试重新发送验证邮件。');
      return;
    }

    setIsResending(true);
    try {
      await sendEmailVerification(auth.currentUser, actionCodeSettings);
      setMessage('验证邮件已重新发送，请查收。');
    } catch (error) {
      console.error('发送验证邮件失败:', error);
      setMessage('发送验证邮件失败，请稍后重试。');
    } finally {
      setIsResending(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center space-y-6 p-6">
      <h1 className="text-2xl font-bold text-center">邮箱验证</h1>

      {status === 'loading' && (
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          <p>正在验证您的邮箱...</p>
        </div>
      )}

      {status === 'success' && (
        <div className="flex flex-col items-center space-y-4">
          <span className="text-green-500 text-3xl">✓</span>
          <p className="text-center text-green-500">{message}</p>
          <Link href="/" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
            前往首页
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
              {isResending ? '发送中...' : '重新发送验证邮件'}
            </button>
          )}
          <Link href="/login" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">
            返回登录
          </Link>
        </div>
      )}

      {status === 'waiting' && (
        <div className="flex flex-col items-center space-y-4">
          <EmailVerificationBanner />
          <p className="text-center mt-4">
            若要验证您的邮箱，请打开我们发送给您的验证邮件并点击链接。
          </p>
          {user && !isEmailVerified && (
            <button 
              className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors ${isResending ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleResendVerification}
              disabled={isResending}
            >
              {isResending ? '发送中...' : '重新发送验证邮件'}
            </button>
          )}
          <Link href="/" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">
            返回首页
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
        <h1 className="text-2xl font-bold text-center">邮箱验证</h1>
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          <p>正在加载...</p>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
} 