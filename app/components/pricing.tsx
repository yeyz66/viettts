'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { CheckIcon } from '@heroicons/react/20/solid';
import { motion } from 'framer-motion';

export default function Pricing() {
  const t = useTranslations('pricing');
  const [frequency, setFrequency] = useState('monthly');

  // Extract feature arrays directly from the messages
  const basicFeatures = [
    '10,000 characters per month',
    '5 voice options',
    'Standard quality audio',
    'Email support'
  ];
  
  const proFeatures = [
    '100,000 characters per month',
    'All voice options',
    'High-quality audio',
    'Priority support',
    'API access'
  ];
  
  const enterpriseFeatures = [
    'Unlimited characters',
    'Custom voice development',
    'Ultra high-quality audio',
    'Dedicated account manager',
    'Advanced API integration',
    'On-premise options'
  ];

  const tiers = [
    {
      name: t('basic.title'),
      id: 'tier-basic',
      price: { monthly: t('basic.price'), yearly: t('basic.price').replace('9', '7') },
      period: t('basic.period'),
      description: t('basic.description'),
      features: basicFeatures,
      cta: t('basic.button'),
      mostPopular: false,
    },
    {
      name: t('pro.title'),
      id: 'tier-pro',
      price: { monthly: t('pro.price'), yearly: t('pro.price').replace('29', '24') },
      period: t('pro.period'),
      description: t('pro.description'),
      features: proFeatures,
      cta: t('pro.button'),
      mostPopular: true,
    },
    {
      name: t('enterprise.title'),
      id: 'tier-enterprise',
      price: { monthly: t('enterprise.price'), yearly: t('enterprise.price') },
      period: '',
      description: t('enterprise.description'),
      features: enterpriseFeatures,
      cta: t('enterprise.button'),
      mostPopular: false,
    },
  ];

  return (
    <div id="pricing" className="bg-gray-50 dark:bg-gray-950 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            {t('title')}
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            {t('subtitle')}
          </p>
        </div>

        <div className="mt-16 flex justify-center">
          <div className="grid grid-cols-2 gap-x-1 rounded-full p-1 text-center text-xs font-semibold leading-5 bg-white dark:bg-gray-800 ring-1 ring-inset ring-gray-200 dark:ring-gray-700">
            <button
              type="button"
              className={`rounded-full px-8 py-2 ${
                frequency === 'monthly'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              onClick={() => setFrequency('monthly')}
            >
              {t('monthly')}
            </button>
            <button
              type="button"
              className={`rounded-full px-8 py-2 ${
                frequency === 'yearly'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              onClick={() => setFrequency('yearly')}
            >
              {t('yearly')}
            </button>
          </div>
        </div>

        <motion.div 
          className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.15 }}
        >
          {tiers.map((tier, tierIdx) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.5, 
                delay: tierIdx * 0.2 
              }}
              className={`flex flex-col justify-between rounded-3xl bg-white dark:bg-gray-900 p-8 ring-1 xl:p-10 ${
                tier.mostPopular
                  ? 'ring-2 ring-indigo-600 dark:ring-indigo-500 shadow-xl'
                  : 'ring-gray-200 dark:ring-gray-700'
              }`}
            >
              <div>
                {tier.mostPopular ? (
                  <div className="mb-4">
                    <span className="inline-flex items-center rounded-full bg-indigo-100 dark:bg-indigo-900 px-3 py-1 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                      {t('pro.popular')}
                    </span>
                  </div>
                ) : null}
                <h3 id={tier.id} className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {tier.name}
                </h3>
                <div className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {tier.price[frequency as keyof typeof tier.price]}
                  </span>
                  {tier.period && (
                    <span className="text-sm font-semibold leading-6 text-gray-600 dark:text-gray-400">
                      {tier.period}
                    </span>
                  )}
                </div>
                <p className="mt-4 text-sm leading-6 text-gray-600 dark:text-gray-400">{tier.description}</p>
                <ul className="mt-8 space-y-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                  {Array.isArray(tier.features) && tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <CheckIcon className="h-6 w-5 flex-none text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <a
                href="#"
                aria-describedby={tier.id}
                className={`mt-8 block rounded-md px-3 py-3 text-center text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  tier.mostPopular
                    ? 'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600'
                    : 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 ring-1 ring-inset ring-indigo-200 dark:ring-indigo-700 hover:ring-indigo-300 dark:hover:ring-indigo-600'
                }`}
              >
                {tier.cta}
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
} 