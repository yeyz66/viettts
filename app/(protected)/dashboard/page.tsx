'use client';

import { useAuthStore } from '@/app/store/authStore';
import { auth } from '@/app/utils/firebase';
import { signOut } from 'firebase/auth';
import ConfirmPopover from '@/app/components/ConfirmPopover';
import { useTranslations } from 'next-intl';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const isEmailVerified = useAuthStore((state) => state.isEmailVerified);
  const logoutAction = useAuthStore((state) => state.logout);
  const t = useTranslations('logout_confirmation');
  const dt = useTranslations('dashboard');

  async function handleLogout(): Promise<void> {
    try {
      await signOut(auth); // Sign out from Firebase
      logoutAction(); // Clear Zustand state
      console.log('User logged out successfully.');
      // 登出后的重定向会由AuthGuard处理，或者可以在这里显式添加
    } catch (error) {
      console.error('Logout failed:', error);
      // Handle logout error if needed
    }
  }

  const userEmail = user?.email || dt('guestUser');

  return (
    <div className="flex flex-1 flex-col items-center justify-center space-y-4 p-4">
      <h1 className="text-2xl font-bold">{dt('title')}</h1>
      <p>{dt('welcome', {email: userEmail})}</p>
      <p>{dt('protectedArea')}</p>
      
      {/* 显示邮箱验证状态 */}
      <p className={`text-sm ${isEmailVerified ? 'text-green-500' : 'text-yellow-500'}`}>
        {dt('emailStatus')} {isEmailVerified ? dt('verified') : dt('notVerified')}
      </p>
      
      <ConfirmPopover
        onConfirm={handleLogout}
        title={t('title')}
        description={t('description')}
        confirmText={t('confirm')}
        cancelText={t('cancel')}
        confirmColor="red"
        placement="right"
      >
        <button 
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          {dt('logoutButton')}
        </button>
      </ConfirmPopover>
    </div>
  );
} 