'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/app/store/authStore';
import { sendEmailVerification } from 'firebase/auth';
import { auth, actionCodeSettings } from '@/app/utils/firebase';

export function EmailVerificationBanner(): React.ReactElement | null {
  // 使用单独的选择器而不是解构，这样可以避免无限循环问题
  const user = useAuthStore(state => state.user);
  const isEmailVerified = useAuthStore(state => state.isEmailVerified);
  
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 如果用户未登录或邮箱已验证，不显示此组件
  if (!user || isEmailVerified) {
    return null;
  }

  async function handleResendVerification() {
    if (!user || !auth.currentUser) return;
    
    setIsResending(true);
    setResendSuccess(false);
    setError(null);
    
    try {
      await sendEmailVerification(auth.currentUser, actionCodeSettings);
      setResendSuccess(true);
      console.log('验证邮件已重新发送');
    } catch (err) {
      console.error('发送验证邮件失败:', err);
      setError('发送验证邮件失败，请稍后重试');
    } finally {
      setIsResending(false);
    }
  }

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700">
            您的邮箱尚未验证。请查看您的邮箱 ({user.email}) 并点击验证链接。
            {!resendSuccess && !isResending && (
              <button
                onClick={handleResendVerification}
                className="ml-2 font-medium text-yellow-700 underline hover:text-yellow-600"
              >
                重新发送验证邮件
              </button>
            )}
            {isResending && (
              <span className="ml-2 text-yellow-700">发送中...</span>
            )}
            {resendSuccess && (
              <span className="ml-2 text-green-600">验证邮件已发送！</span>
            )}
            {error && (
              <span className="ml-2 text-red-600">{error}</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
} 