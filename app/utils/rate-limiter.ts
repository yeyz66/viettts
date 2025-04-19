// Global rate limiter and queue manager for text-to-speech operations using Supabase
import supabase from './supabase';
import OpenAI from 'openai';

// Initialize OpenAI client (as a fallback processor)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

// Define types
type QueuedRequest = {
  id: string;
  resolve: (value: ArrayBuffer) => void;
  reject: (reason: Error) => void;
  payload: {
    text: string;
    voice: string;
  };
};

// Define a type for Supabase TTS request rows
type TTSRequestRow = {
  id: number;
  created_at: string;
  client_ip: string;
  processed: boolean;
  text: string;
  voice: string;
};

class TTSRateLimiter {
  private static instance: TTSRateLimiter;
  private pendingRequests: Map<number, QueuedRequest> = new Map();
  private processingQueue = false;
  private freeUserLimit: number;
  private windowMs: number = 60 * 1000; // 1 minute in milliseconds
  private pollingInterval: NodeJS.Timeout | null = null;
  
  // Default TTS request processor implementation
  private _processRequestImpl: (payload: { text: string; voice: string }) => Promise<ArrayBuffer>;

  private constructor() {
    this.freeUserLimit = Number(process.env.FREE_USER_TTS_LIMIT_PER_MINUTE) || 5;
    
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
    
    // Start queue processing
    this.startQueueProcessing();
  }

  public static getInstance(): TTSRateLimiter {
    if (!TTSRateLimiter.instance) {
      TTSRateLimiter.instance = new TTSRateLimiter();
    }
    return TTSRateLimiter.instance;
  }

  // Start the queue processing loop
  private startQueueProcessing() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }

    // Poll for unprocessed requests every 2 seconds
    this.pollingInterval = setInterval(() => {
      if (!this.processingQueue) {
        this.processQueue();
      }
    }, 2000);
  }

  // Stop the queue processing loop (used for cleanup)
  public stopQueueProcessing() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  // Check if the global rate limit has been exceeded for the current minute
  public async hasExceededRateLimit(): Promise<boolean> {
    const currentMinuteKey = this.getCurrentMinuteKey();
    
    // Get the current usage count for this minute
    const { data, error } = await supabase
      .from('tts_usage_counts')
      .select('count')
      .eq('minute_key', currentMinuteKey)
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
    const currentMinuteKey = this.getCurrentMinuteKey();
    
    // Upsert the usage count for the current minute
    const { error } = await supabase
      .from('tts_usage_counts')
      .upsert(
        { 
          minute_key: currentMinuteKey, 
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
    await supabase.rpc('increment_tts_count', { key: currentMinuteKey });
  }

  // Get the current minute key (used for rate limiting)
  private getCurrentMinuteKey(): string {
    const now = new Date();
    return `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()}-${now.getUTCHours()}-${now.getUTCMinutes()}`;
  }

  // Add a request to the queue
  public async enqueueRequest(
    clientIp: string, 
    payload: { text: string; voice: string }
  ): Promise<ArrayBuffer> {
    return new Promise(async (resolve, reject) => {
      try {
        // Add the request to Supabase
        const { data, error } = await supabase
          .from('tts_requests')
          .insert({
            client_ip: clientIp,
            text: payload.text,
            voice: payload.voice,
            processed: false
          })
          .select()
          .single();
        
        if (error) {
          reject(new Error(`Failed to enqueue request: ${error.message}`));
          return;
        }
        
        if (!data) {
          reject(new Error('Failed to get inserted request data'));
          return;
        }
        
        // Store the resolver and rejecter with the request ID
        const requestId = data.id;
        this.pendingRequests.set(requestId, {
          id: requestId.toString(),
          resolve,
          reject,
          payload
        });
        
        // Trigger queue processing
        if (!this.processingQueue) {
          this.processQueue();
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  // Process the queue
  private async processQueue(): Promise<void> {
    if (this.processingQueue) {
      return;
    }

    this.processingQueue = true;
    
    try {
      // Get the oldest unprocessed request
      const { data, error } = await supabase
        .from('tts_requests')
        .select()
        .eq('processed', false)
        .order('created_at', { ascending: true })
        .limit(1)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') { // No rows found
          this.processingQueue = false;
          return;
        }
        console.error('Error fetching queue:', error);
        this.processingQueue = false;
        return;
      }
      
      if (!data) {
        this.processingQueue = false;
        return;
      }
      
      const request = data as TTSRequestRow;
      
      // Check if we are still under the rate limit
      const isLimitExceeded = await this.hasExceededRateLimit();
      
      if (isLimitExceeded) {
        // Try again later
        this.processingQueue = false;
        return;
      }
      
      // Process the request
      try {
        // Record this request in the rate limiter
        await this.recordRequest();
        
        // Process the TTS request
        const result = await this.processRequest({
          text: request.text,
          voice: request.voice
        });
        
        // Mark as processed in Supabase
        await supabase
          .from('tts_requests')
          .update({ processed: true })
          .eq('id', request.id);
        
        // Resolve the promise for any waiting client
        const pendingRequest = this.pendingRequests.get(request.id);
        if (pendingRequest) {
          pendingRequest.resolve(result);
          this.pendingRequests.delete(request.id);
        }
      } catch (error) {
        console.error('Error processing request:', error);
        
        // Mark as processed anyway to avoid stuck queue
        await supabase
          .from('tts_requests')
          .update({ processed: true })
          .eq('id', request.id);
        
        // Reject the promise for any waiting client
        const pendingRequest = this.pendingRequests.get(request.id);
        if (pendingRequest) {
          pendingRequest.reject(error instanceof Error ? error : new Error('Unknown error occurred during processing'));
          this.pendingRequests.delete(request.id);
        }
      }
    } finally {
      this.processingQueue = false;
      
      // Check if there are more items to process
      const { count } = await supabase
        .from('tts_requests')
        .select('id', { count: 'exact', head: true })
        .eq('processed', false);
      
      if (count && count > 0) {
        // Process next item after a short delay
        setTimeout(() => this.processQueue(), 1000);
      }
    }
  }

  // Method to process a TTS request - can be overridden from outside
  public async processRequest(payload: { text: string; voice: string }): Promise<ArrayBuffer> {
    return this._processRequestImpl(payload);
  }

  // Setter to allow the process implementation to be changed from the API route
  public set processRequestImpl(impl: (payload: { text: string; voice: string }) => Promise<ArrayBuffer>) {
    this._processRequestImpl = impl;
  }

  // Get the total number of unprocessed requests in the queue
  public async getQueueLength(): Promise<number> {
    const { count, error } = await supabase
      .from('tts_requests')
      .select('id', { count: 'exact', head: true })
      .eq('processed', false);
    
    if (error) {
      console.error('Error getting queue length:', error);
      return 0;
    }
    
    return count || 0;
  }

  // Get the position of a client in the queue
  public async getPositionInQueue(clientIp: string): Promise<number> {
    // First, check if the client has a request in the queue
    const { data, error } = await supabase
      .from('tts_requests')
      .select('id, created_at')
      .eq('client_ip', clientIp)
      .eq('processed', false)
      .order('created_at', { ascending: true })
      .limit(1)
      .single();
    
    if (error || !data) {
      return 0; // No request in queue
    }
    
    // Count how many requests are ahead of this one
    const { count, error: countError } = await supabase
      .from('tts_requests')
      .select('id', { count: 'exact', head: true })
      .eq('processed', false)
      .lt('created_at', data.created_at);
    
    if (countError) {
      console.error('Error getting queue position:', countError);
      return 0;
    }
    
    return (count || 0) + 1; // Add 1 because position is 1-indexed
  }
}

// 导出单例实例
export default TTSRateLimiter.getInstance(); 