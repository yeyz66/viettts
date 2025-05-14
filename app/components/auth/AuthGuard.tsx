'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/app/store/authStore';

interface AuthGuardProps {
  children: React.ReactNode;
  requireEmailVerification?: boolean; // 添加是否需要邮箱验证的选项
}

export function AuthGuard({ 
  children,
  requireEmailVerification = true, // 默认需要邮箱验证
}: AuthGuardProps): React.ReactElement | null {
  // 修复无限循环问题：单独获取各个状态而不是返回对象
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isEmailVerified = useAuthStore(state => state.isEmailVerified);
  const isLoading = useAuthStore(state => state.isLoading);
  
  const router = useRouter();
  const pathname = usePathname();
  
  // 获取当前语言路径
  const getCurrentLanguagePath = () => {
    if (pathname.startsWith('/zh/')) return '/zh';
    if (pathname.startsWith('/en/')) return '/en';
    if (pathname.startsWith('/vi/')) return '/vi';
    return '';
  };
  
  // 构建登录和验证邮箱页面的路径
  const loginPath = `${getCurrentLanguagePath()}/login`;
  const verifyEmailPath = `${getCurrentLanguagePath()}/verify-email`;

  useEffect(() => {
    // 等待加载完成后再检查认证状态
    if (!isLoading) {
      if (!isAuthenticated) {
        console.log(`AuthGuard: User not authenticated, redirecting to ${loginPath}`);
        router.replace(loginPath); // 使用 replace 避免将登录页添加到历史记录
      } else if (requireEmailVerification && !isEmailVerified) {
        // 如果需要邮箱验证且邮箱未验证，重定向到验证邮箱页面
        console.log(`AuthGuard: Email not verified, redirecting to ${verifyEmailPath}`);
        router.replace(verifyEmailPath);
      }
    }
  }, [isAuthenticated, isEmailVerified, isLoading, router, requireEmailVerification, loginPath, verifyEmailPath]);

  // 加载中时显示加载动画
  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  // 如果已认证且(不需要邮箱验证或邮箱已验证)，显示子组件（受保护的页面）
  if (isAuthenticated && (!requireEmailVerification || isEmailVerified)) {
    return <>{children}</>;
  }

  // 如果未加载且未认证或邮箱未验证，重定向正在进行，不渲染任何内容
  return null;
} 