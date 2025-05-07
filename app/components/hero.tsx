'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLocale } from '../i18n/intl-provider';

export default function Hero() {
  const t = useTranslations('hero');
  const { locale } = useLocale();

  // Determine text and links based on locale
  const isVietnamese = locale === 'vi';
  const textToSpeechLink = `/${locale === 'en' ? '' : locale}/text-to-speech`;
  const howItWorksLink = `/${locale === 'en' ? '' : locale}/how-it-works`;
  
  // Text for CTA button
  const ctaButtonText = isVietnamese 
    ? 'Chuyển văn bản thành giọng nói ngay'
    : t('ctaButton');
  
  // Text for text-to-speech heading
  const ttsHeadingText = isVietnamese
    ? 'Chuyển văn bản thành giọng nói dễ dàng'
    : 'VietTts Text-to-Speech';

  return (
    <div className="relative isolate overflow-hidden bg-white dark:bg-gray-900">
      <svg
        className="absolute inset-0 -z-10 h-full w-full stroke-gray-200 dark:stroke-gray-800 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="83fd4e5a-9d52-42fc-97b6-718e5d7ee527"
            width={200}
            height={200}
            x="50%"
            y={-1}
            patternUnits="userSpaceOnUse"
          >
            <path d="M100 200V.5M.5 .5H200" fill="none" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" strokeWidth={0} fill="url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)" />
      </svg>
      <div
        className="absolute left-[max(-7rem,calc(50%-52rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-3xl sm:left-[calc(50%-30rem)] sm:right-[calc(50%-30rem)]"
        aria-hidden="true"
      >
        <div
          className="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20"
          style={{
            clipPath:
              'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)',
          }}
        />
      </div>
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <motion.div 
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            {isVietnamese && <span className="block text-indigo-600">Chuyển Văn Bản Thành Giọng Nói</span>}
            {t('title')}
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            {t('subtitle')}
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href={textToSpeechLink}
              className="rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {ctaButtonText}
            </Link>
            <Link href={howItWorksLink} className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100">
              {t('secondaryButton')} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </motion.div>

        <motion.div 
          className="mt-16 sm:mt-24 relative mx-auto max-w-5xl overflow-hidden rounded-xl shadow-2xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-2">
            <div className="flex items-center justify-start space-x-1.5 px-4 py-3 bg-gray-200 dark:bg-gray-700 rounded-t-lg">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div className="mx-auto text-center text-sm text-gray-500 dark:text-gray-400">
                {ttsHeadingText}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-b-lg p-6 shadow-inner">
              <div className="flex flex-col space-y-4">
                <div className="h-32 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 animate-pulse">
                  <div className="w-3/4 h-4 bg-indigo-200 dark:bg-indigo-700 rounded mb-2"></div>
                  <div className="w-2/4 h-4 bg-indigo-200 dark:bg-indigo-700 rounded mb-2"></div>
                  <div className="w-5/6 h-4 bg-indigo-200 dark:bg-indigo-700 rounded"></div>
                </div>
                <div className="flex gap-4">
                  <div className="w-1/2 h-10 bg-indigo-500 rounded-lg shadow-sm"></div>
                  <div className="w-1/2 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                </div>
                <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                  <div className="w-8 h-8 bg-indigo-500 rounded-full animate-pulse"></div>
                  <div className="w-2/3 h-2 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                  <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 