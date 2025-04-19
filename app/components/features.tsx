'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import {
  SpeakerWaveIcon,
  GlobeAltIcon,
  ArrowDownTrayIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

export default function Features() {
  const t = useTranslations('features');

  const features = [
    {
      name: t('feature1.title'),
      description: t('feature1.description'),
      icon: SpeakerWaveIcon,
    },
    {
      name: t('feature2.title'),
      description: t('feature2.description'),
      icon: GlobeAltIcon,
    },
    {
      name: t('feature3.title'),
      description: t('feature3.description'),
      icon: ArrowDownTrayIcon,
    },
    {
      name: t('feature4.title'),
      description: t('feature4.description'),
      icon: AdjustmentsHorizontalIcon,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div id="features" className="bg-white dark:bg-gray-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600 dark:text-indigo-400">
            Text-to-Speech
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            {t('title')}
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            {t('subtitle')}
          </p>
        </div>
        <motion.div 
          className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            {features.map((feature) => (
              <motion.div key={feature.name} className="flex flex-col" variants={itemVariants}>
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  <feature.icon className="h-5 w-5 flex-none text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-300">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </motion.div>
            ))}
          </dl>
        </motion.div>
      </div>
    </div>
  );
} 