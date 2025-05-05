# Text-to-Speech Usage History

This document describes the Text-to-Speech (TTS) usage history tracking implementation in the VoiceGenius application.

## Overview

The application tracks each text-to-speech conversion request in a Supabase database table. For authenticated users, we record their user ID along with their request details. For anonymous users, we record their IP address for usage tracking and rate limiting purposes.

This data is not displayed to users and is intended for administrative purposes only, such as:
- Understanding usage patterns
- Monitoring for abuse
- Planning for capacity
- Analyzing popular voice choices and text patterns

## Database Schema

The `tts_history` table has the following structure:

```sql
CREATE TABLE tts_history (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  client_ip TEXT NOT NULL,
  user_id UUID,
  text TEXT NOT NULL,
  voice TEXT NOT NULL
);

-- Indexes for faster queries
CREATE INDEX tts_history_user_id_idx ON tts_history(user_id);
CREATE INDEX tts_history_client_ip_idx ON tts_history(client_ip);
```

## Implementation Details

1. **Recording Process**: When a user makes a TTS request, the API records usage information in the background without blocking the response.

2. **User Identification**: 
   - For authenticated users: We store their Supabase user ID
   - For anonymous users: We store their IP address (from x-forwarded-for header or request IP)

3. **Privacy Considerations**:
   - IP addresses should be treated as personally identifiable information (PII)
   - This data should not be exposed to users
   - Consider implementing a data retention policy to automatically delete old records

## Code Components

- **tts-history.ts**: Contains utility functions for recording TTS usage and retrieving user information
- **supabase-setup.ts**: Sets up necessary database tables including the tts_history table
- **text-to-speech/route.ts**: API endpoint that captures and records usage data

## Admin Queries

Query examples for administrators:

```sql
-- Get total usage count
SELECT COUNT(*) FROM tts_history;

-- Get usage by day
SELECT DATE(created_at), COUNT(*) 
FROM tts_history 
GROUP BY DATE(created_at)
ORDER BY DATE(created_at) DESC;

-- Get most active users (by user_id)
SELECT user_id, COUNT(*) as usage_count
FROM tts_history
WHERE user_id IS NOT NULL
GROUP BY user_id
ORDER BY usage_count DESC
LIMIT 10;

-- Get most active IPs (anonymous users)
SELECT client_ip, COUNT(*) as usage_count
FROM tts_history
WHERE user_id IS NULL
GROUP BY client_ip
ORDER BY usage_count DESC
LIMIT 10;

-- Get most popular voices
SELECT voice, COUNT(*) as usage_count
FROM tts_history
GROUP BY voice
ORDER BY usage_count DESC;
```

## Environment Variables

Ensure these environment variables are set in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

The `SUPABASE_SERVICE_ROLE_KEY` is used for server-side operations and should be kept secure. 