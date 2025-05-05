import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

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
export async function getUserIdFromRequest(request: Request): Promise<string | null> {
  try {
    // Create a Supabase client with cookies for auth
    const cookieStore = cookies();
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'sb-auth-token',
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      },
    });

    // Get session data
    const { data: { session } } = await supabase.auth.getSession();
    
    // Return user ID if session exists
    return session?.user?.id || null;
  } catch (error) {
    console.error('Error getting user ID from session:', error);
    return null;
  }
} 