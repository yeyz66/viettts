'use client'; // Mark this as a Client Component

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/app/store/authStore'; // Import the store
import { syncUserProfileToSupabase } from '@/app/services/userService'; // Import sync function
import { LoginForm } from '@/app/components/auth/LoginForm'; // Adjust path if necessary
import { GoogleSignInButton } from '@/app/components/auth/GoogleSignInButton';
import NavBar from '@/app/components/navbar'; // 导入NavBar组件
import { User } from 'firebase/auth';
import { useTranslations } from 'next-intl'; // 引入 useTranslations

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser); // Get the setUser action
  const [isRedirecting, setIsRedirecting] = useState(false);
  const t = useTranslations('login'); // 使用 login 命名空间

  // 预加载首页
  useEffect(() => {
    router.prefetch('/');
  }, [router]);

  async function handleLoginSuccess(user: User) {
    console.log('Login successful, setting user state and navigating. User UID:', user.uid);
    // Map the firebase user to our profile structure if needed, or use as is if compatible
    const userProfile = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified, // 确保包含 emailVerified 属性
    };
    
    // 立即更新状态
    setUser(userProfile);
    
    // 设置重定向状态
    setIsRedirecting(true);
    
    // 立即导航到首页
    router.push('/');
    
    // 后台同步数据，不阻塞UI响应
    syncUserProfileToSupabase(user).catch(err => {
      console.error('同步用户信息失败:', err);
      // 可以添加重试逻辑或通知用户
    });
  }

  return (
    <>
      <NavBar /> {/* 添加NavBar组件 */}
      {isRedirecting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md shadow-lg flex items-center space-x-3">
            <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{t('redirectingMessage')}</span>
          </div>
        </div>
      )}
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-background p-4">
        <div className="w-full max-w-md space-y-4">
          <LoginForm onLoginSuccess={handleLoginSuccess} />
          
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">{t('orSeparator')}</span>
            </div>
          </div>
          
          <GoogleSignInButton />
          
          <div className="flex flex-col items-center mt-4 space-y-2">
            <Link href="/register" className="text-sm text-blue-600 hover:underline">
              {t('noAccount')}
            </Link>
            <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
              {t('forgotPassword')}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
} 