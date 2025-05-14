'use client';

import React, { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup, AuthError as FirebaseAuthError } from 'firebase/auth';
import { auth } from '@/app/utils/firebase';
import { useAuthStore } from '@/app/store/authStore';
import { useRouter } from 'next/navigation';
import { syncUserProfileToSupabase } from '@/app/services/userService'; // Import sync function
import { useTranslations } from 'next-intl'; // 引入 useTranslations

export function GoogleSignInButton(): React.ReactElement {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const setUser = useAuthStore((state) => state.setUser);
  const router = useRouter();
  const t = useTranslations('googleAuth'); // 使用 googleAuth 命名空间

  async function handleGoogleSignIn(): Promise<void> {
    setIsLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    // You can add custom parameters if needed
    // provider.addScope('profile');
    // provider.addScope('email');

    try {
      const result = await signInWithPopup(auth, provider);
      // This gives you a Google Access Token. You can use it to access the Google API.
      // const credential = GoogleAuthProvider.credentialFromResult(result);
      // const token = credential?.accessToken;
      // The signed-in user info.
      const user = result.user;

      console.log('Google Sign-In successful, user:', user.uid);
      // 设置成功状态
      setIsSuccess(true);
      
      // Map the firebase user to our profile structure
      const userProfile = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified, // 确保包含 emailVerified 属性
      };
      
      // 立即更新状态
      setUser(userProfile);
      
      // 立即导航到首页
      router.push('/');
      
      // 后台同步用户数据
      syncUserProfileToSupabase(user).catch(err => {
        console.error('同步用户信息失败:', err);
      });

    } catch (err: unknown) {
      const authError = err as FirebaseAuthError; // Type assertion for better error handling
      console.error('Google Sign-In Error:', authError);
      // Handle specific errors
      let errorMessage = t('errors.defaultError');
      if (authError.code === 'auth/popup-closed-by-user') {
        errorMessage = t('errors.popupClosed');
        // Don't necessarily show an error message for this, as it's user action
        setError(null); // Clear error for this specific case
        return; // Exit without setting error message
      } else if (authError.code === 'auth/account-exists-with-different-credential') {
        errorMessage = t('errors.accountExists');
        // TODO: Implement account linking flow if desired
      } else if (authError.code === 'auth/popup-blocked') {
          errorMessage = t('errors.popupBlocked');
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full flex flex-col items-center space-y-2">
      <button
        onClick={handleGoogleSignIn}
        disabled={isLoading || isSuccess}
        className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {t('loadingText')}
          </span>
        ) : isSuccess ? (
          <span className="flex items-center">
            <svg className="-ml-1 mr-3 h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {t('successText')}
          </span>
        ) : (
          <>
            <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.6,20H24v8h11.3c-1.1,5.2-5.5,8-11.3,8c-6.6,0-12-5.4-12-12s5.4-12,12-12c3.1,0,5.8,1.2,8,3.1 l6.1-6.1C33.7,4.5,29.1,2,24,2C11.8,2,2,11.8,2,24s9.8,22,22,22c11,0,21-8,21-22C45,22.7,44.5,21.3,43.6,20z"></path>
              <path fill="#FF3D00" d="M6.3,14.7l7.1,5.2c1.8-4.8,6.3-8,11.6-8c3.1,0,5.8,1.2,8,3.1l6.1-6.1C33.7,4.5,29.1,2,24,2 C15.5,2,8.3,7.3,6.3,14.7z"></path>
              <path fill="#4CAF50" d="M24,46c5,0,9.6-2.3,12.7-6l-6.8-5.4c-1.9,2-4.4,3.4-7.9,3.4c-5.8,0-10.2-2.8-11.3-8H3.5 C6.5,38.6,14.5,46,24,46z"></path>
              <path fill="#1976D2" d="M43.6,20H24v8h11.3c-0.6,2.6-2.1,4.9-4.2,6.2l6.8,5.4c4.1-3.8,6.6-9.5,6.6-15.6C45,22.7,44.5,21.3,43.6,20z"></path>
            </svg>
            {t('buttonText')}
          </>
        )}
      </button>
      {error && (
        <p className="text-red-600 text-sm text-center mt-2">
          {error}
        </p>
      )}
    </div>
  );
} 