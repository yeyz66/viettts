'use client';

import { useTranslations } from 'next-intl';

export default function MinutesPricing() {
  const t = useTranslations('minutesPricing');

  const pricingTiers = [
    {
      minutes: '30 minutes',
      rate: '$0.20 per minute',
      totalPrice: 'USD 6'
    },
    {
      minutes: '300 minutes',
      rate: '$0.15 per minute',
      totalPrice: 'USD 45'
    },
    {
      minutes: '1000 minutes',
      rate: '$0.10 per minute',
      totalPrice: 'USD 100'
    },
    {
      minutes: '2500 minutes',
      rate: '$0.08 per minute',
      totalPrice: 'USD 200'
    },
    {
      minutes: '10000 minutes',
      rate: '$0.05 per minute',
      totalPrice: 'USD 500'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-900 px-6 py-8 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            {t('title')}
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300">
            {t('subtitle')}
          </p>
          <p className="mt-6 text-base leading-7 text-gray-600 dark:text-gray-400">
            {t('description')}
          </p>
        </div>
        
        <div className="mt-10 overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                  {t('durationHeader')}
                </th>
                <th scope="col" className="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                  {t('priceHeader')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {pricingTiers.map((tier, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {tier.minutes} @ {tier.rate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900 dark:text-white">
                    {tier.totalPrice}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm italic text-gray-600 dark:text-gray-400">
            {t('guide')}
          </p>
        </div>
      </div>
    </div>
  );
} 