'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useLocale } from '../i18n/intl-provider';
import { useAuthStore } from '../store/authStore';
import { useRouter, usePathname } from 'next/navigation';

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
  const [shouldAutoGenerate, setShouldAutoGenerate] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const MAX_LENGTH = parseInt(process.env.NEXT_PUBLIC_TEXT_INPUT_CHAR_LIMIT || '1000');
  
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

  const [needsPolling, setNeedsPolling] = useState(false);

  // 获取当前用户认证状态 - 分别获取以避免无限循环
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isEmailVerified = useAuthStore(state => state.isEmailVerified);
  const user = useAuthStore(state => state.user);
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

  // 修改generateSpeech函数，避免循环依赖
  const generateSpeech = useCallback(async () => {
    if (!text.trim()) {
      toast.error(t('errorMessages.emptyText'));
      return;
    }

    if (text.length > MAX_LENGTH) {
      toast.error(t('errorMessages.tooLongText', { charLimit: MAX_LENGTH.toString() }));
      return;
    }

    // 检查用户是否已登录
    if (!isAuthenticated) {
      toast.error(t('errorMessages.loginRequired'));
      
      const loginPath = `${getCurrentLanguagePath()}/login`;
      router.push(loginPath);
      return;
    }

    // 检查用户是否已登录且邮箱已验证
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
      
      // 成功生成音频后，立即停止所有轮询
      setIsQueued(false);
      setNeedsPolling(false);
      
      // 清除所有轮询间隔
      if (queueCheckInterval) {
        clearInterval(queueCheckInterval);
        setQueueCheckInterval(null);
      }
      
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
      
      // Check if this is a rate limit error with queue information
      if (error instanceof AxiosError && error.response?.status === 429) {
        const data = error.response.data as RateLimitErrorResponse;
        
        if (data && data.queued) {
          setIsQueued(true);
          setQueuePosition(data.position || 0);
          toast.info(data.message || 'Your request has been queued due to rate limiting.');
          setShouldAutoGenerate(true);
          
          // 请求被加入队列时，必须启用轮询
          setNeedsPolling(true);
          
          // 确保立即开始轮询 - 不直接调用startQueueCheck，通过设置状态触发
          setLastUpdateTime(new Date());
          
          // 更新队列长度以确保轮询启动
          if (data.position) {
            setQueueLength(Math.max(data.position, queueLength));
          }
        } else {
          toast.error('Rate limit exceeded. Please try again later.');
          // 仅在不加入队列的情况下才停止轮询
          setNeedsPolling(false);
        }
      } else {
        toast.error(t('errorMessages.failedGeneration'));
        setIsQueued(false);
        setNeedsPolling(false);
      }
    } finally {
      setIsGenerating(false);
    }
  }, [text, voice, audioUrl, t, queueCheckInterval, queueLength, MAX_LENGTH, isAuthenticated, isEmailVerified, router, getCurrentLanguagePath]);

  // Handle explicit generate button click
  const handleGenerateClick = useCallback(() => {
    setShouldAutoGenerate(true);
    generateSpeech();
  }, [generateSpeech]);

  // 调整startQueueCheck函数
  const startQueueCheck = useCallback(() => {
    // 如果已经有轮询在运行，先清除它
    if (queueCheckInterval) {
      clearInterval(queueCheckInterval);
    }
    
    // 只有在以下情况下不启动轮询：已有音频且不在队列中，或者用户没有尝试生成且不在队列中
    if ((audioUrl && !isQueued) || (!shouldAutoGenerate && !isQueued)) {
      setQueueCheckInterval(null);
      setNeedsPolling(false);
      return;
    }
    
    // 创建新的轮询间隔
    const interval = setInterval(async () => {
      // 如果已经有音频且不在队列中，或者用户没有尝试生成且不在队列中，立即停止轮询
      if ((audioUrl && !isQueued) || (!shouldAutoGenerate && !isQueued)) {
        clearInterval(interval);
        setQueueCheckInterval(null);
        setNeedsPolling(false);
        return;
      }
      
      try {
        const response = await axios.get('/api/text-to-speech/queue-status');
        const { position, queueLength, globalLimitExceeded } = response.data;
        
        setQueuePosition(position);
        setQueueLength(queueLength);
        setGlobalLimitExceeded(globalLimitExceeded);
        setLastUpdateTime(new Date());
        
        // 仅当用户不再需要轮询时才停止
        const shouldStopPolling = (audioUrl && !isQueued && position === 0) || 
                                 (!shouldAutoGenerate && !isQueued);
        
        if (shouldStopPolling) {
          clearInterval(interval);
          setQueueCheckInterval(null);
          setNeedsPolling(false);
          return;
        }
        
        // 如果位置为0，用户不再在队列中
        if (position === 0 && isQueued) {
          setIsQueued(false);
          
          // 只有当满足以下所有条件时才自动生成
          if (!audioUrl && text.trim() && shouldAutoGenerate) {
            // 通过useEffect触发自动生成
            setLastUpdateTime(new Date());
          }
        } else if (position > 0) {
          setIsQueued(true);
        }
      } catch (error) {
        console.error('Error checking queue status:', error);
      }
    }, ACTIVE_POLL_INTERVAL);
    
    setQueueCheckInterval(interval);
  }, [audioUrl, isQueued, queueCheckInterval, shouldAutoGenerate, text]);

  // 修改checkQueueStatus函数
  const checkQueueStatus = useCallback(async () => {
    // 如果已经有音频且不在队列中，不检查队列状态
    if (audioUrl && !isQueued) {
      setNeedsPolling(false);
      return;
    }
    
    // 如果用户没有交互过（没有点击生成按钮）且不在队列中，不检查队列状态
    if (!shouldAutoGenerate && !isQueued) {
      setNeedsPolling(false);
      return;
    }
    
    try {
      const response = await axios.get('/api/text-to-speech/queue-status');
      const { position, queueLength, globalLimitExceeded } = response.data;
      
      setQueuePosition(position);
      setQueueLength(queueLength);
      setGlobalLimitExceeded(globalLimitExceeded);
      setLastUpdateTime(new Date());
      
      // 修改轮询条件：只要满足以下任一条件就需要轮询
      // 1. 用户有请求在队列中
      // 2. 存在全局限制且用户尚未生成音频且用户已经尝试生成
      // 3. 队列中有其他请求且用户尚未生成音频且用户已经尝试生成
      const shouldPoll = position > 0 || 
                         (globalLimitExceeded && !audioUrl && shouldAutoGenerate) || 
                         (queueLength > 0 && !audioUrl && isQueued);
      
      setNeedsPolling(shouldPoll);
      
      // 如果需要轮询且没有活跃的轮询，则启动轮询
      if (shouldPoll && !queueCheckInterval) {
        startQueueCheck();
      } else if (!shouldPoll && queueCheckInterval) {
        // 如果不需要轮询但存在活跃的轮询，则停止轮询
        clearInterval(queueCheckInterval);
        setQueueCheckInterval(null);
      }
      
      // 更新是否在队列中
      if (position > 0) {
        setIsQueued(true);
      } else if (position === 0 && isQueued) {
        setIsQueued(false);
      }
    } catch (error) {
      console.error('Error checking queue status:', error);
    }
  }, [startQueueCheck, audioUrl, isQueued, queueCheckInterval, shouldAutoGenerate]);

  // 重写组件挂载时的轮询设置
  useEffect(() => {
    // 只在用户已经点击生成按钮或者已经在队列中的情况下执行初始检查
    if (shouldAutoGenerate || isQueued) {
      checkQueueStatus();
    } else {
      // 如果用户尚未交互，将needsPolling设置为false，禁止轮询
      setNeedsPolling(false);
    }
    
    let interval: NodeJS.Timeout | null = null;
    
    // 只有在特定条件下才启动常规轮询
    if (needsPolling && !audioUrl) {
      interval = setInterval(() => {
        // 再次检查条件，确保即使状态变化也能正确处理
        if (!needsPolling || audioUrl) {
          if (interval) {
            clearInterval(interval);
            interval = null;
          }
          return;
        }
        checkQueueStatus();
      }, NORMAL_POLL_INTERVAL);
    }
    
    return () => {
      // 清理所有轮询
      if (interval) {
        clearInterval(interval);
      }
      if (queueCheckInterval) {
        clearInterval(queueCheckInterval);
      }
      // 释放音频资源
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [checkQueueStatus, needsPolling, audioUrl, queueCheckInterval, shouldAutoGenerate, isQueued]);

  // 确保音频生成后状态一致性，并不再需要轮询
  useEffect(() => {
    // 如果有音频，确保不再轮询
    if (audioUrl) {
      // 重置队列状态
      setIsQueued(false);
      setNeedsPolling(false);
      
      // 清除所有轮询间隔
      if (queueCheckInterval) {
        clearInterval(queueCheckInterval);
        setQueueCheckInterval(null);
      }
    }
  }, [audioUrl, queueCheckInterval]);

  // 处理自动生成的逻辑
  useEffect(() => {
    // 确保只有在满足以下条件才自动生成：
    // 1. 不在队列中
    // 2. 队列位置为0
    // 3. 没有现有音频
    // 4. 有文本内容
    // 5. shouldAutoGenerate标志为true (只在点击按钮或队列处理完成后才设置为true)
    if (!isQueued && queuePosition === 0 && !audioUrl && text.trim() && shouldAutoGenerate) {
      // 确保这个自动生成仅在队列处理完成后触发，不会因为文本变化而触发
      generateSpeech();
      // 生成后重置标志
      setShouldAutoGenerate(false);
    }
  }, [isQueued, queuePosition, audioUrl, shouldAutoGenerate, generateSpeech, text]);

  // 添加一个新的useEffect，确保文本变化不会触发生成
  useEffect(() => {
    // 文本变化时，确保不会自动生成
    // 除非之前已经在队列中，并且队列处理完成
    if (!isQueued) {
      setShouldAutoGenerate(false);
    }
  }, [text, isQueued]);

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
                        <p>{t.rich('maxRequestsMessage', { limit: process.env.NEXT_PUBLIC_FREE_USER_TTS_LIMIT_PER_MINUTE || '1' })}</p>
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
                  {t.rich('inputPlaceholder', { charLimit: MAX_LENGTH.toString() })}
                </label>
                <div className="mt-2">
                  <textarea
                    id="text"
                    name="text"
                    rows={6}
                    className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-indigo-500 dark:bg-gray-800 sm:text-sm sm:leading-6"
                    placeholder={t('inputPlaceholder', { charLimit: MAX_LENGTH.toString() })}
                    value={text}
                    onChange={handleInputChange}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {t.rich('characterCount', { count: text.length.toString(), charLimit: MAX_LENGTH.toString() })}
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
                  onClick={handleGenerateClick}
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
            <p>{t.rich('rateLimitNotice', { limit: process.env.NEXT_PUBLIC_FREE_USER_TTS_LIMIT_PER_MINUTE || '1' })}</p>
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

        {/* 邮箱验证提示 */}
        {showEmailVerificationAlert && isAuthenticated && !isEmailVerified && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">需要验证邮箱</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    您必须先验证邮箱（{user?.email}）才能使用文字转语音功能。
                    <button
                      onClick={goToVerifyEmail}
                      className="ml-2 font-medium text-yellow-700 underline hover:text-yellow-600"
                    >
                      前往验证页面
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 