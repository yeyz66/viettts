import { NextRequest, NextResponse } from 'next/server';
import rateLimiter from '../../../utils/rate-limiter';

// Helper function to get client IP
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded ? forwarded.split(',')[0] : '127.0.0.1';
}

export async function GET(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);
    
    // Check global rate limit status
    const isLimitExceeded = await rateLimiter.hasExceededRateLimit();
    
    // Get client's position in queue
    const position = await rateLimiter.getPositionInQueue(clientIP);
    
    // Get total queue length
    const queueLength = await rateLimiter.getQueueLength();
    
    return NextResponse.json({
      position,
      queueLength,
      globalLimitExceeded: isLimitExceeded,
      message: position > 0 
        ? `Your request is queued (position: ${position} of ${queueLength})`
        : isLimitExceeded 
          ? 'Global rate limit exceeded. You can submit a request to be queued.'
          : 'No requests in queue for your IP'
    });
  } catch (error) {
    console.error('Error checking queue status:', error);
    return NextResponse.json(
      { error: 'Failed to check queue status' },
      { status: 500 }
    );
  }
} 