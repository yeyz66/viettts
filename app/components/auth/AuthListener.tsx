'use client';

import { useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/app/utils/firebase'; // Adjust path if necessary
import { useAuthStore } from '@/app/store/authStore'; // Adjust path if necessary
import { syncUserProfileToSupabase } from '@/app/services/userService'; // Import the sync function

// Helper function to map FirebaseUser to our UserProfile
function mapFirebaseUserToProfile(firebaseUser: FirebaseUser | null) {
  if (!firebaseUser) {
    return null;
  }
  // Include the emailVerified property
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
    emailVerified: firebaseUser.emailVerified, // 添加邮箱验证状态
    // Add other properties as needed
  };
}


export function AuthListener(): null { // This component doesn't render anything
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);
  const wasLoading = useAuthStore((state) => state.isLoading); // Track initial load

  useEffect(() => {
    // Set initial loading state only once
    if (wasLoading) {
      setLoading(true);
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      const userProfile = mapFirebaseUserToProfile(firebaseUser);
      setUser(userProfile); // Update the store with the user profile or null
      
      if (firebaseUser) {
        // If user is logged in, sync their profile to Supabase
        await syncUserProfileToSupabase(firebaseUser);
        
        // 在控制台输出用户邮箱验证状态
        console.log('Email verification status:', firebaseUser.emailVerified ? 'Verified' : 'Not verified');
      }
      
      console.log('Auth state changed:', userProfile ? `User logged in (${userProfile.uid})` : 'User logged out');
    }, (error) => {
      // Handle potential errors during listener setup
      console.error("Error setting up auth listener:", error);
      setLoading(false); // Ensure loading is false even on error
    });

    // Cleanup function to unsubscribe when the component unmounts
    return () => {
        console.log("Unsubscribing auth listener...");
        unsubscribe();
    };
    // setUser and setLoading likely won't change, but include them if linting requires
  }, [setUser, setLoading, wasLoading]);

  return null; // This component does not render UI
} 