'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useLocale } from '../i18n/intl-provider';

// Define a type for rate limit API error responses
type RateLimitErrorResponse = {
  queued?: boolean;
  position?: number;
  message?: string;
};

export default function TextToSpeechConverter() {
  const t = useTranslations('converter');
  const { locale } = useLocale();
  const isVietnamese = locale === 'vi';
  
  const [text, setText] = useState('');
  const [voice, setVoice] = useState('alloy');
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isQueued, setIsQueued] = useState(false);
  const [queuePosition, setQueuePosition] = useState(0);
  const [queueLength, setQueueLength] = useState(0);
  const [globalLimitExceeded, setGlobalLimitExceeded] = useState(false);
  const [queueCheckInterval, setQueueCheckInterval] = useState<NodeJS.Timeout | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const MAX_LENGTH = 1000;
  
  // Poll intervals in milliseconds
  const NORMAL_POLL_INTERVAL = 10000; // 10 seconds
  const ACTIVE_POLL_INTERVAL = 3000;  // 3 seconds when queue is active

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
    a.download = `voicegenius-${voice}-${Date.now()}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Function to format the last update time
  const formatUpdateTime = () => {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - lastUpdateTime.getTime()) / 1000);
    
    if (seconds < 5) return 'just now';
    if (seconds < 60) return `${seconds} seconds ago`;
    
    const minutes = Math.floor(seconds / 60);
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  };

  // Function to reset queue status (if the UI gets stuck)
  const resetQueueStatus = () => {
    setIsQueued(false);
    if (queueCheckInterval) {
      clearInterval(queueCheckInterval);
      setQueueCheckInterval(null);
    }
    checkQueueStatus();
  };

  // Generate speech function - defined first to avoid circular dependencies
  const generateSpeech = useCallback(async () => {
    if (!text.trim()) {
      toast.error(t('errorMessages.emptyText'));
      return;
    }

    if (text.length > MAX_LENGTH) {
      toast.error(t('errorMessages.tooLongText'));
      return;
    }

    try {
      setIsGenerating(true);
      
      // Clear previous audio if it exists
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
      }

      // Make API request to backend
      const response = await axios.post('/api/text-to-speech', {
        text,
        voice,
      }, {
        responseType: 'arraybuffer',
      });

      // Create a blob from the audio data
      const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(audioBlob);
      
      setAudioUrl(url);
      
      // If this was a queued request that completed, reset queue status
      setIsQueued(false);
      
      // Automatically play the audio
      if (audioRef.current) {
        audioRef.current.play();
      }
    } catch (error: unknown) {
      console.error('Error generating speech:', error);
      
      // Check if this is a rate limit error with queue information
      if (error instanceof AxiosError && error.response?.status === 429) {
        const data = error.response.data as RateLimitErrorResponse;
        
        if (data && data.queued) {
          setIsQueued(true);
          setQueuePosition(data.position || 0);
          toast.info(data.message || 'Your request has been queued due to rate limiting.');
          
          // We'll set up queue checking in the effect
          setLastUpdateTime(new Date());
        } else {
          toast.error('Rate limit exceeded. Please try again later.');
        }
      } else {
        toast.error(t('errorMessages.failedGeneration'));
        // Reset isQueued if there's an error
        setIsQueued(false);
      }
    } finally {
      setIsGenerating(false);
    }
  }, [text, voice, audioUrl, t]);

  // Start queue checking more frequently - also wrapped in useCallback
  const startQueueCheck = useCallback(() => {
    // Clear any existing interval
    if (queueCheckInterval) {
      clearInterval(queueCheckInterval);
    }
    
    // Start a new interval to check queue status more frequently
    const interval = setInterval(async () => {
      try {
        const response = await axios.get('/api/text-to-speech/queue-status');
        const { position, queueLength, globalLimitExceeded } = response.data;
        
        setQueuePosition(position);
        setQueueLength(queueLength);
        setGlobalLimitExceeded(globalLimitExceeded);
        
        // If position is 0, we're no longer in the queue
        if (position === 0) {
          // Reset queue status
          setIsQueued(false);
          clearInterval(interval);
          setQueueCheckInterval(null);
          
          // If we were queued before and now we're not, auto-generate
          // only if we don't already have audio (to avoid multiple generations)
          if (isQueued && !audioUrl && text.trim()) {
            // We'll trigger the auto-generate through the useEffect
            setLastUpdateTime(new Date()); // Trigger a re-render
          }
        }
        
        // If queue is empty and no global limit, stop polling
        if (queueLength === 0 && !globalLimitExceeded) {
          clearInterval(interval);
          setQueueCheckInterval(null);
        }
      } catch (error) {
        console.error('Error checking queue status:', error);
      }
    }, ACTIVE_POLL_INTERVAL);
    
    setQueueCheckInterval(interval);
  }, [queueCheckInterval, isQueued, audioUrl, text]);

  // Function to check queue status wrapped in useCallback
  const checkQueueStatus = useCallback(async () => {
    try {
      const response = await axios.get('/api/text-to-speech/queue-status');
      const { position, queueLength, globalLimitExceeded } = response.data;
      
      setQueuePosition(position);
      setQueueLength(queueLength);
      setGlobalLimitExceeded(globalLimitExceeded);
      setLastUpdateTime(new Date());
      
      if (position > 0) {
        setIsQueued(true);
        // Start more frequent polling if user is in queue
        startQueueCheck();
      } else if (queueLength > 0 || globalLimitExceeded) {
        // If there are others in queue but not us, or if global limit is exceeded,
        // we still want more frequent updates
        startQueueCheck();
      }
    } catch (error) {
      console.error('Error checking queue status:', error);
    }
  }, [startQueueCheck]);

  // Check queue status on component mount
  useEffect(() => {
    checkQueueStatus();
    
    // Start with the normal polling interval
    const interval = setInterval(checkQueueStatus, NORMAL_POLL_INTERVAL);
    
    return () => {
      clearInterval(interval);
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      if (queueCheckInterval) {
        clearInterval(queueCheckInterval);
      }
    };
  }, [audioUrl, checkQueueStatus, queueCheckInterval]);

  // Add a useEffect to ensure queue status is cleaned up properly
  // and to handle auto-generation when queue position reaches 0
  useEffect(() => {
    // If we have audio and are still marked as queued, fix this inconsistent state
    if (audioUrl && isQueued) {
      setIsQueued(false);
    }
    
    // Auto-generate when we're no longer queued
    if (!isQueued && queuePosition === 0 && !audioUrl && text.trim()) {
      generateSpeech();
    }
  }, [audioUrl, isQueued, queuePosition, generateSpeech, text]);

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
              VoiceGenius Text-to-Speech
            </div>
          </div>
          
          <div className="p-6 sm:p-10">
            <div className="space-y-6">
              {/* Global rate limit status */}
              {globalLimitExceeded && !isQueued && (
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3 w-full">
                      <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">{t('rateLimitActive')}</h3>
                      <div className="mt-2 text-sm text-amber-700 dark:text-amber-300">
                        <p>{t.rich('maxRequestsMessage', { limit: process.env.FREE_USER_TTS_LIMIT_PER_MINUTE || '5' })}</p>
                        <p className="mt-1">{t('queueAddedMessage')}</p>
                        <div className="mt-2 py-2 px-3 bg-amber-100 dark:bg-amber-800/30 rounded">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{t('currentQueue')}</span> 
                            <span className="bg-amber-200 dark:bg-amber-700 px-2 py-1 rounded-full text-amber-800 dark:text-amber-100 font-semibold">
                              {queueLength} {queueLength === 1 ? t('user') : t('users')}
                            </span>
                          </div>
                          <div className="mt-2 text-xs text-amber-600 dark:text-amber-400 text-right">
                            {t.rich('lastUpdated', { time: formatUpdateTime() })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* User's queued request status */}
              {isQueued && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3 w-full">
                      <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">{t('requestQueued')}</h3>
                      <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                        <p>{t('queuedMessage')}</p>
                        <div className="mt-2 py-2 px-3 bg-yellow-100 dark:bg-yellow-800/30 rounded">
                          <div className="mb-2 flex items-center justify-between">
                            <span className="font-medium">{t('yourPosition')}</span>
                            <span className="bg-yellow-200 dark:bg-yellow-700 px-2 py-1 rounded-full text-yellow-800 dark:text-yellow-100 font-semibold">
                              {queuePosition} {t('of')} {queueLength}
                            </span>
                          </div>
                          
                          {/* Progress bar */}
                          <div className="w-full h-2 bg-yellow-200 dark:bg-yellow-600 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-yellow-500 dark:bg-yellow-300"
                              initial={{ width: 0 }}
                              animate={{ 
                                width: queueLength > 0 
                                  ? `${100 - ((queuePosition - 1) / queueLength * 100)}%` 
                                  : '0%' 
                              }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                          
                          <div className="mt-2 flex justify-between items-center">
                            <button 
                              onClick={resetQueueStatus}
                              className="text-xs text-yellow-600 dark:text-yellow-400 hover:underline focus:outline-none"
                            >
                              {t('resetQueueStatus')}
                            </button>
                            <span className="text-xs text-yellow-600 dark:text-yellow-400">
                              {t.rich('lastUpdated', { time: formatUpdateTime() })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Queue status indicator (always visible when there are pending requests) */}
              {!isQueued && !globalLimitExceeded && queueLength > 0 && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3 w-full">
                      <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">{t('systemStatus')}</h3>
                      <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                        <div className="py-2 px-3 bg-blue-100 dark:bg-blue-800/30 rounded">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{t('currentQueue')}</span>
                            <span className="bg-blue-200 dark:bg-blue-700 px-2 py-1 rounded-full text-blue-800 dark:text-blue-100 font-semibold">
                              {queueLength} {queueLength === 1 ? t('user') : t('users')}
                            </span>
                          </div>
                          <div className="mt-2 text-xs text-blue-600 dark:text-blue-400 text-right">
                            {t.rich('lastUpdated', { time: formatUpdateTime() })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="text" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100">
                  {t('inputPlaceholder')}
                </label>
                <div className="mt-2">
                  <textarea
                    id="text"
                    name="text"
                    rows={6}
                    className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-indigo-500 dark:bg-gray-800 sm:text-sm sm:leading-6"
                    placeholder={t('inputPlaceholder')}
                    value={text}
                    onChange={handleInputChange}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {t.rich('characterCount', { count: text.length })}
                </p>
              </div>

              <div>
                <label htmlFor="voice" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100">
                  {t('voiceLabel')}
                </label>
                <select
                  id="voice"
                  name="voice"
                  className="mt-2 block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 dark:text-gray-100 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 dark:bg-gray-800 sm:text-sm sm:leading-6"
                  value={voice}
                  onChange={(e) => setVoice(e.target.value)}
                >
                  {Object.entries(voices).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  onClick={generateSpeech}
                  disabled={isGenerating || isQueued}
                  className="flex-1 rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating 
                    ? t('processing') 
                    : isQueued 
                      ? `Queued (${queuePosition} of ${queueLength})` 
                      : t('generateButton')
                  }
                </button>
                
                {audioUrl && (
                  <button
                    type="button"
                    onClick={downloadAudio}
                    className="flex-1 rounded-md bg-white dark:bg-gray-800 px-3.5 py-2.5 text-center text-sm font-semibold text-indigo-600 dark:text-indigo-400 shadow-sm ring-1 ring-inset ring-indigo-600 dark:ring-indigo-500 hover:bg-indigo-50 dark:hover:bg-gray-700"
                  >
                    {t('downloadButton')}
                  </button>
                )}
              </div>

              {audioUrl && (
                <div className="mt-4">
                  <audio controls ref={audioRef} className="w-full" src={audioUrl}>
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
            </div>
          </div>
        </motion.div>
        
        <div className="mx-auto max-w-3xl mt-8 p-6 bg-white dark:bg-gray-900 rounded-xl shadow-sm">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {t('instructions')}
          </div>
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-xs text-gray-500 dark:text-gray-400">
            <p>{t.rich('rateLimitNotice', { limit: process.env.FREE_USER_TTS_LIMIT_PER_MINUTE || '5' })}</p>
            <p className="mt-1">{t('queueNotice')}</p>
          </div>
        </div>

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