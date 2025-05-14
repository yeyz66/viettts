'use client';

import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/app/utils/firebase'; // Adjust path if necessary
import { AuthError } from '@/app/types/auth';

export function ForgotPasswordForm(): React.ReactElement {
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null); // To show success message

  async function handlePasswordReset(): Promise<void> {
    if (!email) {
      setError('请输入你的注册邮箱。');
      setMessage(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      await sendPasswordResetEmail(auth, email);
      console.log('Password reset email sent to:', email);
      setMessage('密码重置邮件已发送。请检查你的收件箱（包括垃圾邮件）。');
      setIsLoading(false);
      setEmail(''); // Clear email field on success
    } catch (err: unknown) {
      console.error('Password reset error:', err);
      let errorMessage = '发送密码重置邮件失败，请稍后重试。';
      
      const authError = err as AuthError;
      if (authError.code === 'auth/invalid-email') {
        errorMessage = '邮箱格式无效。';
      } else if (authError.code === 'auth/user-not-found' || authError.code === 'auth/invalid-credential') {
        // Avoid revealing if an email exists or not for security
        errorMessage = '如果该邮箱已注册，密码重置邮件将会发送。';
        // Still show a general success message to the user in this case
        setMessage('如果该邮箱已注册，密码重置邮件将会发送。请检查你的收件箱（包括垃圾邮件）。');
      }
      
      setError(errorMessage); // Still set error for internal logging/debugging if needed
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col space-y-4 p-4 rounded-lg bg-white shadow-md w-full max-w-sm">
      <h2 className="text-xl font-semibold text-center">忘记密码？</h2>
      <p className="text-sm text-center text-gray-600">
        输入你的注册邮箱，我们会发送重置链接给你。
      </p>
      <div className="flex flex-col space-y-2">
        <label htmlFor="reset-email" className="text-sm font-medium text-gray-700">邮箱</label>
        <input
          id="reset-email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoCapitalize="none"
          autoComplete="email"
          disabled={isLoading}
          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
        />
      </div>

      {error && !message && ( // Show error only if there's no success/info message
        <p className="text-red-600 text-sm text-center">
          {error}
        </p>
      )}
      {message && ( // Show success/info message
        <p className="text-green-600 text-sm text-center">
          {message}
        </p>
      )}

      <button
        onClick={handlePasswordReset}
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            发送中...
          </span>
        ) : '发送重置邮件'}
      </button>
    </div>
  );
} 