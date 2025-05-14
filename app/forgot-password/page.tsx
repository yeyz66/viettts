'use client';

import { ForgotPasswordForm } from '@/app/components/auth/ForgotPasswordForm'; // Adjust path if necessary
import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-white space-y-4">
      <ForgotPasswordForm />
      <Link 
        href="/login" 
        className="text-blue-500 hover:text-blue-700 transition-colors"
      >
        返回登录
      </Link>
    </div>
  );
} 