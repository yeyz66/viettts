'use client';

import { useState, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useLocale } from '../i18n/intl-provider';
import { useAuthStore } from '../store/authStore';
import { useRouter, usePathname } from 'next/navigation';

export default function TextToSpeechConverter() {
  const t = useTranslations('converter');
  const { locale } = useLocale();
  const isVietnamese = locale === 'vi';
  
  const [text, setText] = useState('');
  const [voice, setVoice] = useState('alloy');
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const MAX_LENGTH = parseInt(process.env.NEXT_PUBLIC_TEXT_INPUT_CHAR_LIMIT || '1000');
  
  const voices = {
    alloy: t('voices.alloy'),
    echo: t('voices.echo'),
    fable: t('voices.fable'),
    onyx: t('voices.onyx'),
    nova: t('voices.nova'),
    shimmer: t('voices.shimmer'),
    ash: t('voices.ash'),
    ballad: t('voices.ballad'),
    coral: t('voices.coral'),
    sage: t('voices.sage')
  };

  // 获取当前用户认证状态 - 分别获取以避免无限循环
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isEmailVerified = useAuthStore(state => state.isEmailVerified);
  const router = useRouter();
  const pathname = usePathname();
  
  // 添加验证邮箱状态提示标志
  const [showEmailVerificationAlert, setShowEmailVerificationAlert] = useState<boolean>(false);
  
  // 获取当前语言路径
  const getCurrentLanguagePath = useCallback(() => {
    if (pathname.startsWith('/zh/')) return '/zh';
    if (pathname.startsWith('/en/')) return '/en';
    if (pathname.startsWith('/vi/')) return '/vi';
    return '';
  }, [pathname]);
  
  // 构建验证邮箱页面路径
  const verifyEmailPath = `${getCurrentLanguagePath()}/verify-email`;

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    if (newText.length <= MAX_LENGTH) {
      setText(newText);
    }
  };

  const downloadAudio = () => {
    if (!audioUrl) return;
    
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = `VietTts-${voice}-${Date.now()}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // 修改generateSpeech函数，移除排队相关逻辑
  const generateSpeech = useCallback(async () => {
    if (!text.trim()) {
      toast.error(t('errorMessages.emptyText'));
      return;
    }

    if (text.length > MAX_LENGTH) {
      toast.error(t('errorMessages.tooLongText', { charLimit: MAX_LENGTH }));
      return;
    }

    // 如果用户已登录但邮箱未验证，阻止生成语音并提示验证
    if (isAuthenticated && !isEmailVerified) {
      setShowEmailVerificationAlert(true);
      toast.error(t('errorMessages.emailNotVerified'));
      return;
    }

    try {
      setIsGenerating(true);
      
      // Clear previous audio if it exists
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
      }

      // 获取当前用户信息
      const user = useAuthStore.getState().user;
      
      // Make API request to backend
      const response = await axios.post('/api/text-to-speech', {
        text,
        voice,
        // 添加用户ID到请求体，以便后端能够识别用户
        userId: user?.uid || null
      }, {
        responseType: 'arraybuffer',
      });

      // Create a blob from the audio data
      const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(audioBlob);
      
      setAudioUrl(url);
      
      // Automatically play the audio
      if (audioRef.current) {
        audioRef.current.play();
      }
    } catch (error) {
      console.error('Error generating speech:', error);
      
      // 检查特定的邮箱未验证错误
      if (error instanceof AxiosError && error.response?.status === 403 && error.response?.data?.code === 'email_not_verified') {
        setShowEmailVerificationAlert(true);
        toast.error('请先验证您的邮箱后再使用文字转语音功能');
        return;
      }
      
      // 检查速率限制错误
      if (error instanceof AxiosError && error.response?.status === 429) {
        toast.error(t('errorMessages.rateLimitExceeded'));
      } else {
        toast.error(t('errorMessages.failedGeneration'));
      }
    } finally {
      setIsGenerating(false);
    }
  }, [text, voice, audioUrl, t, MAX_LENGTH, isAuthenticated, isEmailVerified]);

  // Handle explicit generate button click
  const handleGenerateClick = useCallback(() => {
    generateSpeech();
  }, [generateSpeech]);

  // 处理前往验证邮箱页面
  const goToVerifyEmail = () => {
    router.push(verifyEmailPath);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-950 py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            {isVietnamese ? 'Chuyển Văn Bản Thành Giọng Nói' : t('title')}
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300">
            {t('subtitle')}
          </p>
        </div>

        <motion.div 
          className="mx-auto max-w-3xl rounded-2xl bg-white dark:bg-gray-900 shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-start space-x-1.5 px-4 py-3 bg-gray-100 dark:bg-gray-800">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <div className="mx-auto text-center text-sm text-gray-500 dark:text-gray-400">
              VietTts Text-to-Speech
            </div>
          </div>
          
          <div className="p-6 sm:p-10">
            <div className="space-y-6">
              {/* Email verification notice */}
              {showEmailVerificationAlert && isAuthenticated && !isEmailVerified && (
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">验证邮箱</h3>
                      <div className="mt-2 text-sm text-amber-700 dark:text-amber-300">
                        <p>请先验证您的邮箱才能使用文字转语音功能。我们已向您的邮箱发送了验证链接。</p>
                        <button 
                          onClick={goToVerifyEmail}
                          className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                        >
                          前往验证邮箱页面
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Text input */}
              <div>
                <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  {t.rich('inputPlaceholder', { charLimit: MAX_LENGTH.toString() })}
                </label>
                <div className="mt-1 relative">
                  <textarea
                    id="text-input"
                    name="text-input"
                    rows={5}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md"
                    value={text}
                    onChange={handleInputChange}
                    placeholder={t.rich('inputPlaceholder', { charLimit: MAX_LENGTH.toString() }) as string}
                  />
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex justify-end">
                    {t.rich('characterCount', { 
                      count: text.length, 
                      charLimit: MAX_LENGTH.toString(),
                    })}
                  </div>
                </div>
              </div>

              {/* Voice selection */}
              <div>
                <label htmlFor="voice-select" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  {t('voiceLabel')}
                </label>
                <select
                  id="voice-select"
                  name="voice-select"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={voice}
                  onChange={(e) => setVoice(e.target.value)}
                >
                  {Object.entries(voices).map(([id, label]) => (
                    <option key={id} value={id}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Generation & Download buttons */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={handleGenerateClick}
                  disabled={isGenerating || !text.trim()}
                  className={`flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                    isGenerating || !text.trim()
                      ? 'bg-indigo-300 dark:bg-indigo-900 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('processing')}
                    </>
                  ) : (
                    t('generateButton')
                  )}
                </button>
                
                {audioUrl && (
                  <button
                    onClick={downloadAudio}
                    className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    {t('downloadButton')}
                  </button>
                )}
              </div>

              {/* Audio player */}
              {audioUrl && (
                <div className="mt-4">
                  <audio 
                    ref={audioRef}
                    controls 
                    className="w-full" 
                    src={audioUrl}
                  />
                </div>
              )}

              {/* Instructions */}
                              <div className="mt-6 bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Instructions</h3>
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <p>{t('instructions')}</p>
                  <p className="mt-2">{t.rich('rateLimitNotice', { limit: process.env.NEXT_PUBLIC_FREE_USER_TTS_LIMIT_PER_DAY || '10' })}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 仅在越南语环境下显示SEO内容 */}
        {isVietnamese && (
          <div className="mx-auto max-w-3xl mt-16 rounded-2xl bg-white dark:bg-gray-900 shadow-lg p-8">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Chuyển văn bản thành giọng nói - Công cụ hàng đầu tại Việt Nam
            </h3>
            <div className="prose prose-indigo dark:prose-invert max-w-none">
              <p>
                Công cụ <strong>chuyển văn bản thành giọng nói</strong> của chúng tôi giúp người dùng Việt Nam dễ dàng tạo ra audio chất lượng cao từ văn bản. Với nhiều giọng đọc tự nhiên, bạn có thể nhanh chóng tạo ra nội dung âm thanh cho video, podcast, học tập và nhiều mục đích khác.
              </p>
              <p>
                Tại sao nên sử dụng công cụ <strong>chuyển văn bản thành giọng nói</strong> của chúng tôi:
              </p>
              <ul>
                <li>Chất lượng giọng đọc cực kỳ tự nhiên, khó phân biệt với giọng người thật</li>
                <li>Dễ dàng sử dụng, chỉ cần dán văn bản và nhấn tạo</li>
                <li>Nhiều tùy chọn giọng đọc khác nhau</li>
                <li>Hoàn toàn miễn phí cho người dùng cơ bản</li>
                <li>Tạo file âm thanh nhanh chóng trong vài giây</li>
              </ul>
              <p>
                Công nghệ <strong>chuyển văn bản thành giọng nói</strong> đã trở thành một công cụ không thể thiếu cho người sáng tạo nội dung, giáo viên, học sinh và doanh nghiệp. Hãy trải nghiệm ngay hôm nay!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 