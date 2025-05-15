import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import rateLimiter from '../../utils/rate-limiter';
import { recordTTSUsage, getUserIdFromRequest } from '../../utils/tts-history';
import { createClient } from '@supabase/supabase-js';

// 初始化Supabase客户端
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

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

// 检查用户邮箱是否已验证
async function checkEmailVerified(userId: string | null): Promise<boolean> {
  // 如果没有用户ID，视为未登录或匿名用户
  if (!userId) {
    return false;
  }

  try {
    // 创建Supabase客户端
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // 查询用户验证状态
    const { data, error } = await supabase
      .from('tts_users')
      .select('email_verified')
      .eq('user_id', userId)
      .single();
    
    if (error || !data) {
      console.error('Error checking email verification status:', error);
      return false;
    }
    
    return !!data.email_verified;
  } catch (error) {
    console.error('Exception checking email verification:', error);
    return false;
  }
}

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
    
    // 检查用户邮箱是否已验证
    const isEmailVerified = await checkEmailVerified(userId);
    
    // 如果用户已登录但邮箱未验证，拒绝请求
    if (userId && !isEmailVerified) {
      return NextResponse.json(
        { 
          error: '请先验证您的邮箱后再使用文字转语音功能', 
          code: 'email_not_verified' 
        },
        { status: 403 }
      );
    }
    
    // 检查是否达到速率限制
    const isLimitExceeded = await rateLimiter.hasExceededRateLimit();
    
    if (isLimitExceeded) {
      return NextResponse.json(
        { 
          error: '已达到每天请求数限制，请明天再试',
          code: 'rate_limit_exceeded'
        },
        { status: 429 }
      );
    }
    
    // 如果未达到限制，直接处理请求
    try {
      // 记录此请求用于速率限制
      await rateLimiter.recordRequest();
      
      // 直接处理TTS请求
      const buffer = await processTTSRequest({ text, voice });
      
      // 在成功生成语音后记录TTS使用情况
      recordTTSUsage({
        text,
        voice,
        clientIP,
        userId
      }).catch(error => {
        console.error('Failed to record TTS usage after direct processing:', error);
      });
      
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