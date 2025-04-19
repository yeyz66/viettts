import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Redirect to the DiceBear API for a generated favicon
    return NextResponse.redirect('https://api.dicebear.com/7.x/bottts/svg?seed=ttl-project', 307);
  } catch (error) {
    console.error('Error serving favicon:', error);
    return new NextResponse(null, { status: 404 });
  }
} 