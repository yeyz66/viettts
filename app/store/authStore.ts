import { create } from 'zustand';
import { User as FirebaseUser } from 'firebase/auth'; // Firebase User type

// Define a more specific User type if needed, or use FirebaseUser directly
interface UserProfile extends Pick<FirebaseUser, 'uid' | 'email' | 'displayName' | 'photoURL'> {
  // Add any custom user properties you might store, e.g., in Firestore
  // role?: string;
  emailVerified: boolean; // 添加邮箱验证状态
}

interface AuthState {
  user: UserProfile | null;
  isLoading: boolean; // For initial auth state loading
  isAuthenticated: boolean; // Derived from user state for convenience
  isEmailVerified: boolean; // 添加邮箱验证状态
  setUser: (user: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void; // Added a specific logout action
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true, // Start with loading true until auth state is checked
  isAuthenticated: false,
  isEmailVerified: false, // 初始为未验证状态
  setUser: (user) => {
    set({ 
      user, 
      isAuthenticated: !!user, 
      isEmailVerified: user ? user.emailVerified : false, // 设置邮箱验证状态
      isLoading: false 
    });
    // console.log('AuthStore: User set to', user); // For debugging
  },
  setLoading: (loading) => set({ isLoading: loading }),
  logout: () => {
    set({ 
      user: null, 
      isAuthenticated: false, 
      isEmailVerified: false, // 重置邮箱验证状态
      isLoading: false 
    });
    // console.log('AuthStore: User logged out'); // For debugging
  },
})); 