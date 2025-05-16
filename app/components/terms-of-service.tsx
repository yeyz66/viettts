'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import RegionSpecificTerms from './region-specific-terms';

export default function TermsOfService() {
  const t = useTranslations('termsOfService');
  const params = useParams();
  const locale = params.locale as string || 'en';

  // 根据不同的语言展示相应的地区特定条款
  const getRegionByLocale = (locale: string): 'us' | 'china' | 'vietnam' => {
    switch (locale) {
      case 'zh':
        return 'china';
      case 'vi':
        return 'vietnam';
      default:
        return 'us';
    }
  };

  const region = getRegionByLocale(locale);

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {t('title')}
          </h1>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            {t('lastUpdated')}
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-3xl text-base leading-7 text-gray-700">
          <div className="space-y-10">
            <section>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">{t('introduction.title')}</h2>
              <div className="mt-6 space-y-4">
                <p>{t('introduction.p1')}</p>
                <p>{t('introduction.p2')}</p>
                <p>{t('introduction.p3')}</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">{t('serviceDescription.title')}</h2>
              <div className="mt-6 space-y-4">
                <p>{t('serviceDescription.p1')}</p>
                <p>{t('serviceDescription.p2')}</p>
              </div>
            </section>

            {/* 显示特定地区的条款 */}
            <RegionSpecificTerms region={region} />

            <section>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">{t('userAccounts.title')}</h2>
              <div className="mt-6 space-y-4">
                <p>{t('userAccounts.p1')}</p>
                <p>{t('userAccounts.p2')}</p>
                <p>{t('userAccounts.p3')}</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">{t('paymentTerms.title')}</h2>
              <div className="mt-6 space-y-4">
                <p>{t('paymentTerms.p1')}</p>
                <p>{t('paymentTerms.p2')}</p>
                <p>{t('paymentTerms.p3')}</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">{t('contentPolicies.title')}</h2>
              <div className="mt-6 space-y-4">
                <p>{t('contentPolicies.p1')}</p>
                <p>{t('contentPolicies.p2')}</p>
                <p>{t('contentPolicies.p3')}</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">{t('intellectualProperty.title')}</h2>
              <div className="mt-6 space-y-4">
                <p>{t('intellectualProperty.p1')}</p>
                <p>{t('intellectualProperty.p2')}</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">{t('limitations.title')}</h2>
              <div className="mt-6 space-y-4">
                <p>{t('limitations.p1')}</p>
                <p>{t('limitations.p2')}</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">{t('privacy.title')}</h2>
              <div className="mt-6 space-y-4">
                <p>{t('privacy.p1')}</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">{t('termination.title')}</h2>
              <div className="mt-6 space-y-4">
                <p>{t('termination.p1')}</p>
                <p>{t('termination.p2')}</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">{t('changes.title')}</h2>
              <div className="mt-6 space-y-4">
                <p>{t('changes.p1')}</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">{t('contact.title')}</h2>
              <div className="mt-6 space-y-4">
                <p>{t('contact.p1')}</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 