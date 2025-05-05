import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client with admin key for server operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a Supabase client for admin operations
const supabaseAdmin = createClient(supabaseUrl, supabaseAnonKey);

// Create a utility function to record TTS usage
export async function recordTTSUsage({ 
  text, 
  voice, 
  clientIP, 
  userId = null 
}: { 
  text: string; 
  voice: string; 
  clientIP: string; 
  userId?: string | null;
}) {
  try {
    // Record in the tts_history table
    const { error } = await supabaseAdmin
      .from('tts_history')
      .insert({
        text,
        voice,
        client_ip: clientIP,
        user_id: userId,
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error recording TTS usage:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error recording TTS usage:', error);
    return false;
  }
}

// Get user ID from session if available
export async function getUserIdFromRequest(): Promise<string | null> {
  try {
    // 创建一个简单的服务器端supabase客户端
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // 获取会话数据
    const { data: { session } } = await supabase.auth.getSession();
    
    // 如果会话存在，返回用户ID
    return session?.user?.id || null;
  } catch (error) {
    console.error('Error getting user ID from session:', error);
    return null;
  }
} 