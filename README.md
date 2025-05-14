# VoiceGenius - AI Text-to-Speech

A modern text-to-speech web application that leverages OpenAI's TTS models to convert text into natural-sounding speech.

## Features

- Convert text to natural-sounding speech in seconds
- Multiple voice options with different styles and characteristics
- Multilingual interface (English, Chinese, Vietnamese)
- Modern, responsive Apple-like design
- Download audio files in MP3 format
- Complete landing page with features, pricing, testimonials, and FAQ sections
- Tracks usage history in Supabase database (user ID for logged-in users, IP address for anonymous users)

## Technology Stack

- **Frontend**: Next.js, TypeScript, TailwindCSS, Framer Motion
- **API**: Next.js API Routes
- **Text-to-Speech**: OpenAI TTS API
- **Database**: Supabase (PostgreSQL)
- **Internationalization**: next-intl
- **UI Components**: Headless UI, Heroicons

## Getting Started

### Prerequisites

- Node.js (v18 or newer)
- An OpenAI API key (get one at https://platform.openai.com/api-keys)
- A Supabase account and project (create one at https://supabase.com)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/voicegenius.git
cd voicegenius
```

2. Install dependencies:
```bash
cnpm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Edit `.env.local` and add your API keys:
```
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

5. Set up the Supabase database tables:
```bash
npx ts-node -r dotenv/config app/utils/supabase-setup.ts
```

### Running the Development Server

```bash
cnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

```bash
cnpm run build
cnpm start
```

## Usage

1. Enter the text you want to convert to speech
2. Select a voice from the dropdown menu
3. Click "Generate Speech" to convert your text
4. Listen to the audio
5. Click "Download MP3" to save the audio file

## Supported Voices

- Allison (Female, Casual)
- Echo (Male, Deep)
- Fable (Female, Warm)
- Onyx (Male, Authoritative)
- Nova (Female, Energetic)
- Shimmer (Female, Gentle)

## Languages

The user interface is available in:
- English
- Chinese (Simplified)
- Vietnamese

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## 数据库初始化

要设置必要的Supabase数据库表，请按照以下步骤操作：

1. 确保你已经创建了一个Supabase项目，并获取了URL和anon key。

2. 在Supabase SQL编辑器中添加`exec_sql`函数：

```sql
CREATE OR REPLACE FUNCTION exec_sql(query TEXT)
RETURNS VOID AS $$
BEGIN
  EXECUTE query;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

3. 然后执行初始化脚本：

```bash
npm install -D typescript ts-node dotenv
npx ts-node -r dotenv/config app/utils/supabase-setup.ts
```

这个脚本将创建以下表：
- `tts_users` - 存储用户信息
- `tts_requests` - 跟踪TTS请求队列
- `tts_usage_counts` - 用于速率限制
- `tts_history` - 记录TTS使用历史

如果执行脚本时遇到问题，可以通过Supabase界面手动创建这些表。表结构定义位于`app/utils/supabase-setup.ts`文件中。

## Google 登录配置

要启用Google登录功能，需要进行以下配置：

1. 在Firebase控制台中启用Google身份验证服务:
   - 登录Firebase控制台 (https://console.firebase.google.com/)
   - 进入你的项目
   - 导航到"Authentication" > "Sign-in method"
   - 启用Google登录方式
   - 配置OAuth重定向域名

2. 确保以下环境变量已经正确设置在`.env.local`文件中:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

3. 在Google Cloud Platform配置OAuth同意屏幕:
   - 登录Google Cloud Console (https://console.cloud.google.com/)
   - 选择与Firebase项目关联的GCP项目
   - 导航到"API和服务" > "OAuth同意屏幕"
   - 配置应用名称、用户支持电子邮件和开发者联系信息
   - 添加必要的范围(如email, profile)
   - 添加测试用户(如处于测试状态)

4. 创建OAuth客户端ID:
   - 导航到"API和服务" > "凭据"
   - 点击"创建凭据" > "OAuth客户端ID"
   - 选择应用类型为"Web应用"
   - 添加授权的JavaScript源(如http://localhost:3000和你的生产域名)
   - 添加授权的重定向URI(必须与Firebase配置中的重定向URI匹配)

登录功能配置完成后，用户将能够使用Google账号进行快速登录。
