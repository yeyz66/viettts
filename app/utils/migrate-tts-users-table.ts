/**
 * 此脚本用于将tts_users表从使用id作为主键迁移到使用自增id作为主键，
 * 并使用user_id存储Firebase UID
 * 
 * 迁移步骤:
 * 1. 重命名当前的tts_users表为tts_users_old
 * 2. 创建新的tts_users表，使用新的结构
 * 3. 从老表中复制数据到新表，将id值复制为user_id值
 * 4. 验证数据完整性
 * 5. 如果一切正常，可以后续手动删除tts_users_old表
 * 
 * 如何运行: npx ts-node -r dotenv/config app/utils/migrate-tts-users-table.ts
 */

import supabase from './supabase';

async function migrateUserTable() {
  console.log('开始迁移tts_users表...');
  
  try {
    // 1. 备份当前表为tts_users_old
    const { error: renameError } = await supabase.rpc('exec_sql', {
      query: `
        -- 重命名现有表
        ALTER TABLE IF EXISTS tts_users RENAME TO tts_users_old;
      `
    });
    
    if (renameError) {
      console.error('重命名表失败:', renameError);
      throw renameError;
    }
    
    console.log('✅ 成功将现有表重命名为tts_users_old');
    
    // 2. 创建新表结构
    const { error: createTableError } = await supabase.rpc('exec_sql', {
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
    
    if (createTableError) {
      console.error('创建新表失败:', createTableError);
      throw createTableError;
    }
    
    console.log('✅ 成功创建新的tts_users表');
    
    // 3. 复制数据
    const { error: migrateDataError } = await supabase.rpc('exec_sql', {
      query: `
        -- 将旧表数据复制到新表，将id列的值复制到user_id列
        INSERT INTO tts_users (user_id, email, display_name, photo_url, email_verified, created_at, updated_at)
        SELECT 
          id, 
          email, 
          display_name, 
          photo_url, 
          email_verified, 
          created_at, 
          updated_at
        FROM tts_users_old;
      `
    });
    
    if (migrateDataError) {
      console.error('数据迁移失败:', migrateDataError);
      throw migrateDataError;
    }
    
    console.log('✅ 成功将数据从旧表迁移到新表');
    
    // 4. 验证数据
    // 获取旧表中的记录数
    const { error: countOldError, count: oldRecordCount } = await supabase
      .from('tts_users_old')
      .select('*', { count: 'exact', head: true });
    
    if (countOldError) {
      console.error('获取旧表记录数失败:', countOldError);
      throw countOldError;
    }
    
    // 获取新表中的记录数
    const { error: countNewError, count: newRecordCount } = await supabase
      .from('tts_users')
      .select('*', { count: 'exact', head: true });
    
    if (countNewError) {
      console.error('获取新表记录数失败:', countNewError);
      throw countNewError;
    }
    
    // 确认记录数匹配
    if (oldRecordCount === newRecordCount) {
      console.log(`✅ 数据完整性验证通过: 旧表 ${oldRecordCount} 条记录 = 新表 ${newRecordCount} 条记录`);
    } else {
      console.error(`❌ 数据完整性验证失败: 旧表 ${oldRecordCount} 条记录 ≠ 新表 ${newRecordCount} 条记录`);
      console.log('请手动检查数据，然后再继续!');
      throw new Error('数据迁移校验失败');
    }
    
    console.log('迁移成功完成! 建议在确认一切正常后手动删除tts_users_old表。');
    console.log('可以使用以下SQL语句删除旧表:');
    console.log('DROP TABLE IF EXISTS tts_users_old;');
    
  } catch (error) {
    console.error('迁移过程中发生错误:', error);
    console.log('\n恢复步骤:');
    console.log('如果需要回滚，请执行以下SQL:');
    console.log('DROP TABLE IF EXISTS tts_users;');
    console.log('ALTER TABLE IF EXISTS tts_users_old RENAME TO tts_users;');
  }
}

// 运行迁移
if (require.main === module) {
  migrateUserTable()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('迁移失败:', error);
      process.exit(1);
    });
}

export default migrateUserTable; 