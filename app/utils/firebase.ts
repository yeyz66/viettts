// app/utils/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, ActionCodeSettings } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';
// import { getFirestore } from 'firebase/firestore'; // 如果你需要 Firestore
// import { getStorage } from 'firebase/storage'; // 如果你需要 Storage

// Your web app's Firebase configuration pulled from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase for SSR + SSG compatibility
// https://firebase.google.com/docs/web/setup#access-firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
// const firestore = getFirestore(app); // 如果你需要 Firestore
// const storage = getStorage(app); // 如果你需要 Storage

// Initialize Analytics only if supported (runs only on client-side)
let analytics;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

// 配置邮箱验证链接的设置
export const actionCodeSettings: ActionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be in the authorized domains list in the Firebase Console.
  url: process.env.NEXT_PUBLIC_APP_URL 
    ? `${process.env.NEXT_PUBLIC_APP_URL}/verify-email` 
    : 'http://localhost:3000/verify-email',
  // This must be true.
  handleCodeInApp: true,
};

export { app, auth, analytics /*, firestore, storage */ }; 