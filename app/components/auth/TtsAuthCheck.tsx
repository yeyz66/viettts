'use client';

import React from 'react';
import { useAuthStore } from '@/app/store/authStore';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

export default function TtsAuthCheck(): React.ReactElement | null {
  // 单独获取各个状态以避免无限循环问题
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isLoading = useAuthStore(state => state.isLoading);
  const t = useTranslations('converter');
  
  const pathname = usePathname();
  
  // 获取当前语言路径
  const getCurrentLanguagePath = () => {
    if (pathname.startsWith('/zh/')) return '/zh';
    if (pathname.startsWith('/en/')) return '/en';
    if (pathname.startsWith('/vi/')) return '/vi';
    return '';
  };
  
  // 构建登录页面的路径
  const loginPath = `${getCurrentLanguagePath()}/login`;

  // 加载中时不显示任何内容
  if (isLoading) {
    return null;
  }

  // 如果未登录，显示提示
  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto mt-4 px-4">
        <div className="flex flex-col space-y-4 p-4 rounded-lg bg-white shadow-md dark:bg-gray-800">
          <h2 className="text-xl font-semibold text-center text-gray-800 dark:text-white">
            {t('loginRequired.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-center">
            {t('loginRequired.message')}
          </p>
          <div className="flex justify-center pt-2">
            <Link 
              href={loginPath}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              {t('loginRequired.loginButton')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 对于已登录用户，不显示任何内容
  return null;
} 