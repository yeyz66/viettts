import supabaseClient from './supabaseClient';

// 注意：这个文件现在只是re-export了supabaseClient
// 项目中同时存在两个Supabase客户端文件可能导致问题
// 我们将使用supabaseClient作为标准客户端

// 添加警告，以便后期重构
console.log('[supabase.ts] 注意：这个文件现在直接引用了supabaseClient，以避免创建重复的客户端实例');
console.log('[supabase.ts] 建议将所有引用改为直接使用supabaseClient，并在未来移除此文件');

export default supabaseClient; 