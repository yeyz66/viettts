import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import rateLimiter from '../../utils/rate-limiter';
import { recordTTSUsage, getUserIdFromRequest } from '../../utils/tts-history';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

// Helper function to get client IP
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded ? forwarded.split(',')[0] : '127.0.0.1';
}

// Process a TTS request directly
async function processTTSRequest(payload: { text: string; voice: string }): Promise<ArrayBuffer> {
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
}

// Set the process method in rate limiter
rateLimiter.processRequestImpl = processTTSRequest;

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { text, voice } = body;

    // Validate input
    if (!text || !voice) {
      return NextResponse.json(
        { error: 'Text and voice are required' },
        { status: 400 }
      );
    }

    // Limit text length to prevent abuse
    if (text.length > 4000) {
      return NextResponse.json(
        { error: 'Text length exceeds the 4000 character limit' },
        { status: 400 }
      );
    }

    const clientIP = getClientIP(request);
    
    // Get user ID if they are logged in
    const userId = await getUserIdFromRequest();
    
    // Record TTS usage without waiting for completion
    recordTTSUsage({
      text,
      voice,
      clientIP,
      userId
    }).catch(error => {
      // Just log errors but don't fail the request
      console.error('Failed to record TTS usage:', error);
    });
    
    // Check if global rate limit has been exceeded
    const isLimitExceeded = await rateLimiter.hasExceededRateLimit();
    
    if (isLimitExceeded) {
      // Check if user already has a request in the queue
      const queuePosition = await rateLimiter.getPositionInQueue(clientIP);
      
      if (queuePosition > 0) {
        // User already has a request in the queue
        return NextResponse.json(
          { 
            queued: true, 
            position: queuePosition,
            message: `The global rate limit has been reached. Your request is queued (position: ${queuePosition}).`
          },
          { status: 429 }
        );
      }
      
      // Add to queue and start asynchronous processing
      try {
        // Enqueue the request and wait for it to be processed
        const buffer = await rateLimiter.enqueueRequest(clientIP, { text, voice });
        
        // When the queue processes this request, return the result
        return new NextResponse(buffer, {
          headers: {
            'Content-Type': 'audio/mpeg',
            'Content-Length': buffer.byteLength.toString(),
          },
        });
      } catch (error) {
        console.error('Error processing queued TTS request:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to process queued request';
        
        return NextResponse.json(
          { error: errorMessage },
          { status: 500 }
        );
      }
    }
    
    // Process the request directly as the global limit hasn't been exceeded
    try {
      // Record this request for rate limiting
      await rateLimiter.recordRequest();
      
      // Process TTS request directly
      const buffer = await processTTSRequest({ text, voice });
      
      // Return audio as binary data
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Length': buffer.byteLength.toString(),
        },
      });
    } catch (error) {
      console.error('Text-to-speech API error:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during text-to-speech conversion';
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Text-to-speech API error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'An error occurred during text-to-speech conversion';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 