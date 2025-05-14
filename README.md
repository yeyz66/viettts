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
