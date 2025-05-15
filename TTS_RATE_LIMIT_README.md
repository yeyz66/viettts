# Text-to-Speech Rate Limiting and Queue System

This document explains how to set up and use the global rate limiting and queue system for the text-to-speech feature.

## Overview

The system implements a global rate limit for text-to-speech operations, allowing only a configurable number of operations per day (default set in environment variables). When the limit is reached, additional requests are placed in a queue and processed in order when capacity becomes available.

## Features

- Global rate limiting for all users
- Queue system for handling excess requests
- Supabase database for persistence and global state
- Real-time queue status updates in the UI
- Fair queue processing (first-come, first-served)

## Setup Instructions

### 1. Configure Supabase

1. Create a Supabase project at [https://supabase.com](https://supabase.com)
2. Once your project is created, get your Supabase URL and anon key from the API settings

### 2. Update Environment Variables

Add the following to your `.env.local` file:

```
# Rate limiting for free users (operations per day)
# Set this to the desired daily limit for free users
FREE_USER_TTS_LIMIT_PER_DAY=10
# This is the public version accessible from the browser
NEXT_PUBLIC_FREE_USER_TTS_LIMIT_PER_DAY=10

# Supabase configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Set Up Supabase Database

Create the required SQL functions and tables in Supabase:

1. First, add the `exec_sql` function in the Supabase SQL Editor:

```sql
CREATE OR REPLACE FUNCTION exec_sql(query TEXT)
RETURNS VOID AS $$
BEGIN
  EXECUTE query;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

2. Then run the database setup script:

```bash
npm install ts-node dotenv --save-dev
npx ts-node -r dotenv/config app/utils/supabase-setup.ts
```

Alternatively, you can manually create the tables and functions in the Supabase SQL Editor:

```sql
-- Create a table to track TTS requests
CREATE TABLE IF NOT EXISTS tts_requests (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  client_ip TEXT NOT NULL,
  processed BOOLEAN DEFAULT FALSE,
  text TEXT NOT NULL,
  voice TEXT NOT NULL
);

-- Create a table to track request counts (for rate limiting)
CREATE TABLE IF NOT EXISTS tts_usage_counts (
  id SERIAL PRIMARY KEY,
  minute_key TEXT NOT NULL UNIQUE,
  count INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a function to increment the TTS count for a given minute key
CREATE OR REPLACE FUNCTION increment_tts_count(key TEXT)
RETURNS void AS $$
BEGIN
  UPDATE tts_usage_counts
  SET count = count + 1,
      updated_at = NOW()
  WHERE minute_key = key;
END;
$$ LANGUAGE plpgsql;
```

### 4. Install Dependencies

Install the Supabase client:

```bash
npm install @supabase/supabase-js
```

### 5. Test the Implementation

1. Start your Next.js application:

```bash
npm run dev
```

2. Navigate to the text-to-speech page
3. Try submitting more requests than your configured daily limit to see the queue system in action

## How It Works

1. **Rate Limiting**: The system tracks the number of TTS operations each day. If the global limit is exceeded, new requests are queued.

2. **Queue System**: 
   - When a user submits a TTS request and the global limit is reached, their request is added to the queue
   - The queue is processed in order (first-come, first-served)
   - Users can see their position in the queue and get real-time updates

3. **Request Processing**:
   - The system polls the queue periodically to check for unprocessed requests
   - When capacity becomes available, the oldest request in the queue is processed
   - The user receives the audio result automatically when their request is processed

## Customization

- To change the rate limit, update the `FREE_USER_TTS_LIMIT_PER_DAY` value in your `.env.local` file
- For frontend display, also update the `NEXT_PUBLIC_FREE_USER_TTS_LIMIT_PER_DAY` value
- To modify the queue processing behavior, see `app/utils/rate-limiter.ts`
- To customize the UI for queue status, see `app/components/text-to-speech-converter.tsx`

## Production Considerations

- The implementation uses Supabase for persistence, making it suitable for production use with multiple server instances
- For high-traffic applications, consider implementing additional caching or optimizing the database queries
- Regular maintenance of the queue table is recommended (e.g., periodically cleaning up old processed requests) 