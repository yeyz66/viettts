/**
 * 检查 tts_users 表的结构
 * 
 * 此脚本用于检查 tts_users 表的结构，特别是确认 user_id 列是否为文本类型
 * 
 * 如何运行: npx ts-node -r dotenv/config app/utils/check-tts-users-schema.ts
 */

import supabase from './supabaseClient';

async function checkTtsUsersSchema() {
  console.log('开始检查 tts_users 表结构...');
  
  try {
    // 查询表结构
    const { data, error } = await supabase.rpc('exec_sql', {
      query: `
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'tts_users'
        ORDER BY ordinal_position;
      `
    });
    
    if (error) {
      console.error('获取表结构失败:', error);
      throw error;
    }
    
    console.log('tts_users 表结构:');
    console.table(data);
    
    // 特别检查 user_id 列
    const userIdColumn = data.find((column: any) => column.column_name === 'user_id');
    
    if (userIdColumn) {
      console.log(`user_id 列的数据类型: ${userIdColumn.data_type}`);
      
      if (userIdColumn.data_type === 'text') {
        console.log('✅ user_id 列是文本类型，符合要求');
      } else {
        console.error(`❌ user_id 列不是文本类型，而是 ${userIdColumn.data_type}，需要迁移表结构`);
        console.log('可以使用 migrate-tts-users-table.ts 脚本迁移表结构');
      }
    } else {
      console.error('❌ 未找到 user_id 列，可能需要迁移表结构');
      console.log('可以使用 migrate-tts-users-table.ts 脚本迁移表结构');
    }
    
  } catch (error) {
    console.error('检查过程中发生错误:', error);
  }
}

// 运行检查
if (require.main === module) {
  checkTtsUsersSchema()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('检查失败:', error);
      process.exit(1);
    });
}

export default checkTtsUsersSchema; 