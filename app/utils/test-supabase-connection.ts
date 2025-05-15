/**
 * 这个脚本用于测试并比较两个Supabase客户端的连接情况
 * 运行方式: npx ts-node -r dotenv/config app/utils/test-supabase-connection.ts
 */

import supabaseA from './supabaseClient';
import supabaseB from './supabaseClient';

// 定义测试用户（不包含id，因为id是自增主键）
const testUser = {
  user_id: 'test-user-' + Date.now(),
  email: 'test@example.com',
  display_name: 'Test User',
  photo_url: null,
  email_verified: true,
  updated_at: new Date().toISOString()
};

async function testSupabaseConnections() {
  console.log('===== 测试 Supabase 连接 =====');
  
  // 测试 supabase.ts
  console.log('\n----- 测试 supabase.ts -----');
  try {
    console.log('尝试从tts_users表中读取数据...');
    const { data: dataA, error: errorA } = await supabaseA
      .from('tts_users')
      .select('count(*)', { count: 'exact' });
    
    if (errorA) {
      console.error('supabase.ts 查询失败:', errorA);
    } else {
      console.log('supabase.ts 连接成功! 当前记录数:', dataA);
      
      // 尝试插入测试用户
      console.log('\n尝试通过supabase.ts插入测试用户:', testUser.user_id);
      const { data: insertDataA, error: insertErrorA } = await supabaseA
        .from('tts_users')
        .upsert({...testUser, user_id: `${testUser.user_id}-A`})
        .select();
      
      if (insertErrorA) {
        console.error('supabase.ts 插入失败:', insertErrorA);
      } else {
        console.log('supabase.ts 插入成功:', insertDataA);
      }
    }
  } catch (err) {
    console.error('supabase.ts 发生异常:', err);
  }
  
  // 测试 supabaseClient.ts
  console.log('\n----- 测试 supabaseClient.ts -----');
  try {
    console.log('尝试从tts_users表中读取数据...');
    const { data: dataB, error: errorB } = await supabaseB
      .from('tts_users')
      .select('count(*)', { count: 'exact' });
    
    if (errorB) {
      console.error('supabaseClient.ts 查询失败:', errorB);
    } else {
      console.log('supabaseClient.ts 连接成功! 当前记录数:', dataB);
      
      // 尝试插入测试用户
      console.log('\n尝试通过supabaseClient.ts插入测试用户:', testUser.user_id);
      const { data: insertDataB, error: insertErrorB } = await supabaseB
        .from('tts_users')
        .upsert({...testUser, user_id: `${testUser.user_id}-B`})
        .select();
      
      if (insertErrorB) {
        console.error('supabaseClient.ts 插入失败:', insertErrorB);
      } else {
        console.log('supabaseClient.ts 插入成功:', insertDataB);
      }
    }
  } catch (err) {
    console.error('supabaseClient.ts 发生异常:', err);
  }
  
  console.log('\n===== 测试完成 =====');
}

testSupabaseConnections(); 