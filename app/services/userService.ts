import supabase from '@/app/utils/supabaseClient';
import { User as FirebaseUser } from 'firebase/auth';

interface UserProfileData {
  user_id: string; // Firebase UID
  email?: string | null;
  display_name?: string | null;
  photo_url?: string | null;
  email_verified: boolean; // 添加邮箱验证状态
  updated_at: string; // ISO string for timestamp
}

// 定义返回类型
interface SyncUserResult {
  data: UserProfileData | null;
  error: { message: string } | null;
}

/**
 * Upserts user profile data into the Supabase 'tts_users' table.
 * Uses Firebase UID as the unique user_id field.
 *
 * @param user - The Firebase user object.
 * @returns The result of the upsert operation.
 */
export async function syncUserProfileToSupabase(user: FirebaseUser): Promise<SyncUserResult> {
  console.log('==== 开始同步用户信息到 Supabase ====');
  console.log('Supabase客户端状态:', !!supabase);

  if (!user) {
    console.error("syncUserProfileToSupabase: No user provided.");
    return { data: null, error: { message: "No user provided." } };
  }

  console.log('User object properties:', Object.keys(user));
  console.log('User UID:', user.uid);
  console.log('User email:', user.email);

  // 确保 user_id 是文本类型
  const userProfile: UserProfileData = {
    user_id: String(user.uid), // 显式转换为字符串以确保类型正确
    email: user.email,
    display_name: user.displayName,
    photo_url: user.photoURL,
    email_verified: user.emailVerified, // 保存邮箱验证状态
    updated_at: new Date().toISOString(), // Ensure updated_at is set
  };

  console.log(`准备同步用户 ${user.uid} 到 Supabase...`);
  console.log(`用户数据:`, JSON.stringify(userProfile, null, 2));
  console.log(`邮箱验证状态: ${user.emailVerified ? '已验证' : '未验证'}`);

  try {
    // Upsert based on the 'user_id' column (Firebase UID)
    const { data, error } = await supabase
      .from('tts_users')
      .upsert(userProfile, { onConflict: 'user_id', ignoreDuplicates: false }) // Ensure we update existing records
      .select() // Optionally select the upserted data
      .single(); // Expecting a single row back

    if (error) {
      console.error(`Supabase upsert error for user ${user.uid}:`, error);
      console.error(`错误详情:`, JSON.stringify(error, null, 2));
      console.error(`用户数据:`, JSON.stringify(userProfile, null, 2));
      console.error(`用户ID类型:`, typeof user.uid);
    } else {
      console.log(`成功同步用户 ${user.uid} 到 Supabase:`, data);
    }

    console.log('==== 同步用户信息到 Supabase 完成 ====');
    return { 
      data: data as UserProfileData | null, 
      error: error ? { message: error.message } : null 
    };
  } catch (exception) {
    console.error(`Supabase同步发生异常:`, exception);
    return {
      data: null,
      error: { message: exception instanceof Error ? exception.message : String(exception) }
    };
  }
} 