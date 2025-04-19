import { NextRequest, NextResponse } from 'next/server';
import { createChatCompletion, openaiConfig } from '@/app/utils/openai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages are required and must be an array' },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!openaiConfig.apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    const completion = await createChatCompletion(messages);
    
    // 确保我们有一个有效的完成响应，而不是流式响应
    if ('model' in completion) {
      return NextResponse.json({
        model: completion.model,
        content: completion.choices[0]?.message?.content || '',
        usage: completion.usage,
      });
    } else {
      throw new Error('Received unexpected stream response');
    }
  } catch (error: unknown) {
    console.error('Error in chat API route:', error);
    const errorMessage = error instanceof Error ? error.message : 'An error occurred during the request';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 