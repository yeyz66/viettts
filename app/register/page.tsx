'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Use Next.js Link for navigation
import { useAuthStore } from '@/app/store/authStore'; // Import the store
import { RegisterForm } from '@/app/components/auth/RegisterForm'; // Adjust path if necessary
import { GoogleSignInButton } from '@/app/components/auth/GoogleSignInButton';
import { syncUserProfileToSupabase } from '@/app/services/userService'; // Import sync function
import { User } from 'firebase/auth';

export default function RegisterPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser); // Get the setUser action

  async function handleRegisterSuccess(user: User) {
    console.log('Registration successful, setting user state and navigating. User UID:', user.uid);
    // Map the firebase user to our profile structure
    const userProfile = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
    };
    setUser(userProfile); // Set user state immediately
    
    // 导航到首页
    router.push('/');
    
    // 后台同步数据，不阻塞UI响应
    syncUserProfileToSupabase(user).catch(err => {
      console.error('同步用户信息失败:', err);
      // 可以添加重试逻辑或通知用户
    });
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-background p-4 space-y-4 max-w-[350px] mx-auto">
      <RegisterForm onRegisterSuccess={handleRegisterSuccess} />
      <hr className="w-full my-4" />
      <GoogleSignInButton />
      <Link href="/login" passHref>
        <button className="text-primary hover:text-primary-dark text-sm font-medium">已经有账户？点击登录</button>
      </Link>
    </div>
  );
} 