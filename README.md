# VoiceGenius - AI Text-to-Speech

A modern text-to-speech web application that leverages OpenAI's TTS models to convert text into natural-sounding speech.

## Features

- Convert text to natural-sounding speech in seconds
- Multiple voice options with different styles and characteristics
- Multilingual interface (English, Chinese, Vietnamese)
- Modern, responsive Apple-like design
- Download audio files in MP3 format
- Complete landing page with features, pricing, testimonials, and FAQ sections

## Technology Stack

- **Frontend**: Next.js, TypeScript, TailwindCSS, Framer Motion
- **API**: Next.js API Routes
- **Text-to-Speech**: OpenAI TTS API
- **Internationalization**: next-intl
- **UI Components**: Headless UI, Heroicons

## Getting Started

### Prerequisites

- Node.js (v18 or newer)
- An OpenAI API key (get one at https://platform.openai.com/api-keys)

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

4. Edit `.env.local` and add your OpenAI API key:
```
OPENAI_API_KEY=your_openai_api_key_here
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
