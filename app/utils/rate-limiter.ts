// Text-to-speech rate limiter for authenticated users
import supabase from './supabaseClient';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

class TTSRateLimiter {
  private static instance: TTSRateLimiter;
  private freeUserLimit: number;
  private windowMs: number = 24 * 60 * 60 * 1000; // 1 day in milliseconds
  
  // Default TTS request processor implementation
  private _processRequestImpl: (payload: { text: string; voice: string }) => Promise<ArrayBuffer>;

  private constructor() {
    // 从环境变量获取每日限制次数，如果未设置则默认使用10次作为兜底值
    this.freeUserLimit = Number(process.env.NEXT_PUBLIC_FREE_USER_TTS_LIMIT_PER_DAY) || 10;
    
    // Set the default implementation for processing TTS requests
    this._processRequestImpl = async (payload: { text: string; voice: string }): Promise<ArrayBuffer> => {
      const { text, voice } = payload;
      
      // Map frontend voice names to OpenAI voice IDs
      const voiceMap: Record<string, string> = {
        allison: 'alloy', 
        echo: 'echo',
        fable: 'fable',
        onyx: 'onyx',
        nova: 'nova',
        shimmer: 'shimmer',
        ash: 'ash',
        ballad: 'ballad',
        coral: 'coral',
        sage: 'sage',
      };

      const openaiVoice = voiceMap[voice] || 'alloy';

      // Create speech with OpenAI API
      const mp3 = await openai.audio.speech.create({
        model: process.env.OPENAI_MODEL || 'tts-1',
        voice: openaiVoice,
        input: text,
      });

      // Convert response to ArrayBuffer
      return await mp3.arrayBuffer();
    };
  }

  public static getInstance(): TTSRateLimiter {
    if (!TTSRateLimiter.instance) {
      TTSRateLimiter.instance = new TTSRateLimiter();
    }
    return TTSRateLimiter.instance;
  }

  // Check if the user has exceeded rate limit for the current day
  public async hasExceededRateLimit(): Promise<boolean> {
    const currentDayKey = this.getCurrentDayKey();
    
    // Get the current usage count for this day
    const { data, error } = await supabase
      .from('tts_usage_counts')
      .select('count')
      .eq('minute_key', currentDayKey)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows found"
      console.error('Error checking rate limit:', error);
      return false; // In case of error, allow the request to proceed
    }
    
    const currentCount = data?.count || 0;
    return currentCount >= this.freeUserLimit;
  }

  // Record a TTS request for rate limiting purposes
  public async recordRequest(): Promise<void> {
    const currentDayKey = this.getCurrentDayKey();
    
    // Upsert the usage count for the current day
    const { error } = await supabase
      .from('tts_usage_counts')
      .upsert(
        { 
          minute_key: currentDayKey, 
          count: 1,
          updated_at: new Date().toISOString()
        }, 
        { 
          onConflict: 'minute_key',
          ignoreDuplicates: false
        }
      );
      
    if (error) {
      console.error('Error recording request count:', error);
      return;
    }
    
    // If upsert succeeded, increment the count
    await supabase.rpc('increment_tts_count', { key: currentDayKey });
  }

  // Get the current day key (used for rate limiting)
  private getCurrentDayKey(): string {
    const now = new Date();
    // 使用本地时间而不是UTC时间，确保按照自然天计算
    return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  }

  // Process a TTS request directly
  public async processRequest(payload: { text: string; voice: string }): Promise<ArrayBuffer> {
    return this._processRequestImpl(payload);
  }

  // Allow overriding the default TTS processor implementation
  public set processRequestImpl(impl: (payload: { text: string; voice: string }) => Promise<ArrayBuffer>) {
    this._processRequestImpl = impl;
  }
}

const rateLimiter = TTSRateLimiter.getInstance();
export default rateLimiter; 