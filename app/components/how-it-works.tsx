'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { PencilSquareIcon, SpeakerWaveIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

export default function HowItWorks() {
  const t = useTranslations('howItWorks');

  const steps = [
    {
      name: t('step1.title'),
      description: t('step1.description'),
      icon: PencilSquareIcon,
    },
    {
      name: t('step2.title'),
      description: t('step2.description'),
      icon: SpeakerWaveIcon,
    },
    {
      name: t('step3.title'),
      description: t('step3.description'),
      icon: ArrowDownTrayIcon,
    },
  ];

  return (
    <div id="how-it-works" className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600 dark:text-indigo-400">
            Simple Process
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            {t('title')}
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            {t('subtitle')}
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <div className="grid grid-cols-1 gap-y-16 gap-x-8 lg:grid-cols-3">
            {steps.map((step, stepIdx) => (
              <motion.div 
                key={step.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: stepIdx * 0.2 }}
                className="flex flex-col items-center"
              >
                <div className="relative mb-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-indigo-600">
                    <step.icon className="h-8 w-8 text-white" aria-hidden="true" />
                  </div>
                  <span className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 ring-1 ring-indigo-600 dark:ring-indigo-400">
                    {stepIdx + 1}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center">{step.name}</h3>
                <p className="mt-2 text-base text-gray-600 dark:text-gray-300 text-center">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div 
          className="relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-md mt-16 mx-auto max-w-5xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="flex items-center justify-start space-x-1.5 px-4 py-2 bg-gray-100 dark:bg-gray-700">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">{t('step1.title')}</h4>
                <div className="h-28 bg-white dark:bg-gray-950 rounded border border-gray-200 dark:border-gray-700 p-3">
                  <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="w-2/3 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">{t('step2.title')}</h4>
                <div className="h-28 flex items-center justify-center bg-white dark:bg-gray-950 rounded border border-gray-200 dark:border-gray-700 p-3">
                  <div className="w-full flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-indigo-500"></div>
                      <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                      <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                      <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">{t('step3.title')}</h4>
                <div className="h-28 bg-white dark:bg-gray-950 rounded border border-gray-200 dark:border-gray-700 p-3 flex flex-col justify-center items-center">
                  <div className="w-12 h-12 rounded-full mb-2 bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                    <ArrowDownTrayIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="w-1/2 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 