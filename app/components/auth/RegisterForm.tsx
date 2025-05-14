import React, { useState } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification, User } from 'firebase/auth';
import { auth, actionCodeSettings } from '@/app/utils/firebase'; // 导入 actionCodeSettings
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuthError } from '@/app/types/auth';

interface RegisterFormProps {
  onRegisterSuccess?: (user: User) => void; // Optional callback for successful registration
}

export function RegisterForm({ onRegisterSuccess }: RegisterFormProps): React.ReactElement {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationSent, setVerificationSent] = useState<boolean>(false);
  const pathname = usePathname();
  
  // 获取当前语言路径
  const getCurrentLanguagePath = () => {
    if (pathname.startsWith('/zh/')) return '/zh';
    if (pathname.startsWith('/en/')) return '/en';
    if (pathname.startsWith('/vi/')) return '/vi';
    return '';
  };
  
  // 构建验证页面链接
  const verifyEmailPath = `${getCurrentLanguagePath()}/verify-email`;

  async function handleRegister(): Promise<void> {
    if (!email || !password || !confirmPassword) {
      setError('请填写所有字段。');
      return;
    }
    if (password !== confirmPassword) {
      setError('两次输入的密码不一致。');
      return;
    }
    // Add password strength validation if needed

    setIsLoading(true);
    setError(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('用户已注册:', user.uid);
      
      // 发送验证邮件，使用 actionCodeSettings
      await sendEmailVerification(user, actionCodeSettings);
      setVerificationSent(true);
      console.log('验证邮件已发送');
      
      setIsLoading(false);
      if (onRegisterSuccess) {
        onRegisterSuccess(user); // Call the success callback
      }
    } catch (err: unknown) {
      console.error('注册错误:', err);
      let errorMessage = '注册失败，请稍后重试。';
      
      const authError = err as AuthError;
      if (authError.code === 'auth/email-already-in-use') {
        errorMessage = '该邮箱已被注册。';
      } else if (authError.code === 'auth/invalid-email') {
        errorMessage = '邮箱格式无效。';
      } else if (authError.code === 'auth/weak-password') {
        errorMessage = '密码强度不足，请使用更强的密码。';
      }
      setError(errorMessage);
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col space-y-4 p-4 rounded-lg bg-white shadow-md w-full max-w-md">
      {verificationSent && (
        <div className="bg-green-50 p-4 rounded-md space-y-3">
          <h3 className="text-green-800 font-medium text-center">注册成功！</h3>
          <p className="text-green-800 text-sm text-center">
            验证邮件已发送至 <strong>{email}</strong>
          </p>
          <div className="bg-white p-3 rounded border border-green-200">
            <h4 className="font-medium text-gray-800 text-sm mb-2">重要提示：</h4>
            <p className="text-gray-700 text-sm">
              请立即查收邮件并点击验证链接完成邮箱验证。<strong>您必须验证邮箱后才能使用系统功能。</strong>
            </p>
          </div>
          <div className="flex flex-col items-center pt-2">
            <Link 
              href={verifyEmailPath} 
              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              前往验证页面
            </Link>
            <p className="text-xs text-gray-500 mt-1">
              未收到邮件？请检查垃圾邮件或在验证页面重新发送
            </p>
          </div>
        </div>
      )}
      
      {!verificationSent && (
        <>
          <div className="flex flex-col space-y-2">
            <label htmlFor="register-email" className="text-sm font-medium text-gray-700">邮箱</label>
            <input
              id="register-email"
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
          <div className="flex flex-col space-y-2">
            <label htmlFor="register-password" className="text-sm font-medium text-gray-700">密码</label>
            <input
              id="register-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password" // Use "new-password" for registration
              disabled={isLoading}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="confirm-password" className="text-sm font-medium text-gray-700">确认密码</label>
            <input
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              disabled={isLoading}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm text-center">
              {error}
            </p>
          )}

          <button
            onClick={handleRegister}
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                注册中...
              </span>
            ) : '注册'}
          </button>
        </>
      )}
    </div>
  );
} 