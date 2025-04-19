import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // For API routes that require OpenAI
  if (request.nextUrl.pathname.startsWith('/api/text-to-speech')) {
    // Check if OpenAI API key is set
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error: 'OpenAI API key is not configured. Please add your API key to .env.local',
        },
        { status: 500 }
      );
    }
  }

  return NextResponse.next();
} 