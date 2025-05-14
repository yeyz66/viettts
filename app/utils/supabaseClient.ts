import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl: string | undefined = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey: string | undefined = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 打印环境变量状态（不打印具体值以保护安全）
console.log('Supabase URL 是否存在:', !!supabaseUrl);
console.log('Supabase Anon Key 是否存在:', !!supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase 配置缺失: 环境变量未正确设置");
  throw new Error("Supabase URL or Anon Key is missing from environment variables.");
}

// Create a single Supabase client for use throughout the application
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

console.log('Supabase 客户端初始化完成');

export default supabase; 