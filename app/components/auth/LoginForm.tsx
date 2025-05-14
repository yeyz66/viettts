import React, { useState } from 'react';
import { signInWithEmailAndPassword, User } from 'firebase/auth';
import { auth } from '@/app/utils/firebase'; // Adjust path if necessary
import { AuthError } from '@/app/types/auth';
import { useTranslations } from 'next-intl'; // 引入 useTranslations

interface LoginFormProps {
  onLoginSuccess?: (user: User) => void; // Optional callback for successful login
}

export function LoginForm({ onLoginSuccess }: LoginFormProps): React.ReactElement {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations('loginForm'); // 使用 loginForm 命名空间

  async function handleLogin(): Promise<void> {
    if (!email || !password) {
      setError(t('errors.emptyFields'));
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('用户已登录:', user.uid); // Log user ID for confirmation
      
      // 设置成功状态
      setIsSuccess(true);
      
      // 立即调用成功回调
      if (onLoginSuccess) {
        onLoginSuccess(user);
      }
      
    } catch (err: unknown) {
      console.error('登录错误:', err);
      // Provide more user-friendly error messages based on Firebase error codes
      let errorMessage = t('errors.defaultError');
      
      const authError = err as AuthError;
      if (authError.code === 'auth/user-not-found' || authError.code === 'auth/wrong-password' || authError.code === 'auth/invalid-credential') {
          errorMessage = t('errors.invalidCredentials');
      } else if (authError.code === 'auth/invalid-email') {
          errorMessage = t('errors.invalidEmail');
      } else if (authError.code === 'auth/too-many-requests') {
          errorMessage = t('errors.tooManyRequests');
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full space-y-4 p-4 rounded-lg bg-white shadow">
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          {t('email')}
        </label>
        <input
          id="email"
          type="email"
          placeholder={t('emailPlaceholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoCapitalize="none"
          autoComplete="email"
          disabled={isLoading || isSuccess}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          {t('password')}
        </label>
        <input
          id="password"
          type="password"
          placeholder={t('passwordPlaceholder')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          disabled={isLoading || isSuccess}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {error && (
        <p className="text-red-600 text-sm text-center">
          {error}
        </p>
      )}

      <button
        onClick={handleLogin}
        disabled={isLoading || isSuccess}
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {t('loadingText')}
          </span>
        ) : isSuccess ? (
          <span className="flex items-center justify-center">
            <svg className="-ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {t('successText')}
          </span>
        ) : t('loginButton')}
      </button>
    </div>
  );
} 