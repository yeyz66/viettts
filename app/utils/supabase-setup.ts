import supabase from './supabase';

/**
 * Sets up the Supabase database with the necessary tables and functions
 * for the text-to-speech rate limiting and queue system.
 * 
 * To run this script:
 * 1. Make sure you have configured your Supabase credentials in .env.local
 * 2. Use the following command: npx ts-node -r dotenv/config app/utils/supabase-setup.ts
 */
export async function setupDatabase() {
  console.log('Setting up Supabase database for TTS rate limiting and queue...');
  
  try {
    // Create tts_users table
    const { error: createUsersTableError } = await supabase.rpc('exec_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS tts_users (
          id SERIAL PRIMARY KEY,
          user_id TEXT UNIQUE NOT NULL, -- Firebase UID
          email TEXT,
          display_name TEXT,
          photo_url TEXT,
          email_verified BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Add index on email for faster queries
        CREATE INDEX IF NOT EXISTS tts_users_email_idx ON tts_users(email);
        
        -- Add index on user_id for faster queries
        CREATE INDEX IF NOT EXISTS tts_users_user_id_idx ON tts_users(user_id);
      `
    });
    
    if (createUsersTableError) {
      console.error('Error creating tts_users table:', createUsersTableError);
      throw createUsersTableError;
    }
    
    console.log('✅ tts_users table created successfully');
    
    // Create tts_requests table
    const { error: createRequestsTableError } = await supabase.rpc('exec_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS tts_requests (
          id SERIAL PRIMARY KEY,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          client_ip TEXT NOT NULL,
          processed BOOLEAN DEFAULT FALSE,
          text TEXT NOT NULL,
          voice TEXT NOT NULL
        );
      `
    });
    
    if (createRequestsTableError) {
      console.error('Error creating tts_requests table:', createRequestsTableError);
      throw createRequestsTableError;
    }
    
    console.log('✅ tts_requests table created successfully');
    
    // Create tts_usage_counts table
    const { error: createCountsTableError } = await supabase.rpc('exec_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS tts_usage_counts (
          id SERIAL PRIMARY KEY,
          minute_key TEXT NOT NULL UNIQUE,
          count INTEGER DEFAULT 0,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (createCountsTableError) {
      console.error('Error creating tts_usage_counts table:', createCountsTableError);
      throw createCountsTableError;
    }
    
    console.log('✅ tts_usage_counts table created successfully');
    
    // Create tts_history table
    const { error: createHistoryTableError } = await supabase.rpc('exec_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS tts_history (
          id SERIAL PRIMARY KEY,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          client_ip TEXT NOT NULL,
          user_id UUID,
          text TEXT NOT NULL,
          voice TEXT NOT NULL
        );
        
        -- Add index on user_id for faster queries
        CREATE INDEX IF NOT EXISTS tts_history_user_id_idx ON tts_history(user_id);
        
        -- Add index on client_ip for faster queries
        CREATE INDEX IF NOT EXISTS tts_history_client_ip_idx ON tts_history(client_ip);
      `
    });
    
    if (createHistoryTableError) {
      console.error('Error creating tts_history table:', createHistoryTableError);
      throw createHistoryTableError;
    }
    
    console.log('✅ tts_history table created successfully');
    
    // Create increment_tts_count function
    const { error: createFunctionError } = await supabase.rpc('exec_sql', {
      query: `
        CREATE OR REPLACE FUNCTION increment_tts_count(key TEXT)
        RETURNS void AS $$
        BEGIN
          UPDATE tts_usage_counts
          SET count = count + 1,
              updated_at = NOW()
          WHERE minute_key = key;
        END;
        $$ LANGUAGE plpgsql;
      `
    });
    
    if (createFunctionError) {
      console.error('Error creating increment_tts_count function:', createFunctionError);
      throw createFunctionError;
    }
    
    console.log('✅ increment_tts_count function created successfully');
    
    // Create exec_sql function (if it doesn't exist yet)
    // This is needed for the above RPC calls to work
    try {
      const { error: createExecSqlError } = await supabase.rpc('exec_sql', {
        query: `
          -- This should never execute because we're using the function to create itself
          SELECT 1;
        `
      });
      
      if (createExecSqlError && !createExecSqlError.message.includes('function not found')) {
        console.error('Unexpected error with exec_sql:', createExecSqlError);
      } else {
        console.log('✅ exec_sql function already exists');
      }
    } catch {
      // If exec_sql doesn't exist, this will fail
      // You'll need to create this function manually in the Supabase SQL editor:
      console.log('⚠️ You need to create the exec_sql function manually in Supabase SQL editor:');
      console.log(`
CREATE OR REPLACE FUNCTION exec_sql(query TEXT)
RETURNS VOID AS $$
BEGIN
  EXECUTE query;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
      `);
    }
    
    console.log('✅ Database setup completed successfully!');
  } catch (error) {
    console.error('Failed to set up database:', error);
  }
}

// Run the setup if this file is executed directly
if (require.main === module) {
  setupDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Setup failed:', error);
      process.exit(1);
    });
}

export default setupDatabase; 