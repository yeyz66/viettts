import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client with admin key for server operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Create a Supabase client for admin operations
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey);

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
    const fiveSecondsAgo = new Date(Date.now() - 5000).toISOString();

    let query = supabaseAdmin
      .from('tts_history')
      .select('id', { count: 'exact', head: true })
      .eq('text', text)
      .eq('voice', voice)
      .gte('created_at', fiveSecondsAgo);

    if (userId) {
      // For logged-in users, deduplicate based on user_id, text, and voice.
      // clientIP is not used here for deduplication to be more robust against IP variations.
      query = query.eq('user_id', userId);
    } else {
      // For anonymous users, deduplicate based on client_ip, text, and voice, and ensure user_id is null.
      query = query.eq('client_ip', clientIP);
      query = query.is('user_id', null);
    }

    const { count, error: checkError } = await query;

    if (checkError) {
      console.error('Error checking for existing TTS usage record:', checkError);
      // Proceed to insert if the check fails, to ensure functionality isn't blocked.
    }

    if (count !== null && count > 0) {
      console.log('Recent similar TTS usage found, skipping duplicate recording.');
      return true; // Indicate successful handling (or skipping)
    }

    // Record in the tts_history table
    const { error: insertError } = await supabaseAdmin
      .from('tts_history')
      .insert({
        text,
        voice,
        client_ip: clientIP,
        user_id: userId,
        created_at: new Date().toISOString() // Explicitly set to match potential query logic
      });

    if (insertError) {
      console.error('Error recording TTS usage:', insertError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Exception in recordTTSUsage:', error);
    return false;
  }
} 