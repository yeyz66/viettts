'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/app/store/authStore';
import { EmailVerificationBanner } from './EmailVerificationBanner';
import { useTranslations } from 'next-intl';

export default function TtsEmailVerificationCheck(): React.ReactElement | null {
  // 修复无限循环问题：单独获取各个状态而不是返回对象
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isEmailVerified = useAuthStore(state => state.isEmailVerified);
  const isLoading = useAuthStore(state => state.isLoading);
  const t = useTranslations('converter');
  
  const router = useRouter();
  const pathname = usePathname();
  
  // 获取当前语言路径
  const getCurrentLanguagePath = () => {
    if (pathname.startsWith('/zh/')) return '/zh';
    if (pathname.startsWith('/en/')) return '/en';
    if (pathname.startsWith('/vi/')) return '/vi';
    return '';
  };
  
  // 构建验证邮箱页面的路径
  const verifyEmailPath = `${getCurrentLanguagePath()}/verify-email`;

  useEffect(() => {
    // 等待加载完成后再检查认证状态
    if (!isLoading) {
      // 如果已登录但邮箱未验证，将显示提示
      if (isAuthenticated && !isEmailVerified) {
        console.log('TtsEmailVerificationCheck: Email not verified');
      }
    }
  }, [isAuthenticated, isEmailVerified, isLoading, router]);

  // 加载中时不显示任何内容
  if (isLoading) {
    return null;
  }

  // 如果已登录但邮箱未验证，显示验证提示
  if (isAuthenticated && !isEmailVerified) {
    return (
      <div className="max-w-4xl mx-auto mt-4 px-4">
        <div className="flex flex-col space-y-4 p-4 rounded-lg bg-white shadow-md dark:bg-gray-800">
          <h2 className="text-xl font-semibold text-center text-gray-800 dark:text-white">
            {t('emailVerification.required')}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-center">
            {t('emailVerification.message')}
          </p>
          <EmailVerificationBanner />
          <div className="flex justify-center pt-2">
            <button
              onClick={() => router.push(verifyEmailPath)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              {t('emailVerification.goToVerifyPage')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 对于匿名用户或已验证用户，不显示任何内容
  return null;
} 