'use client';

import { useTranslations } from 'next-intl';

export default function PrivacyPolicy() {
  const t = useTranslations('privacyPolicy');

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
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">{t('infoCollected.title')}</h2>
              <div className="mt-6 space-y-4">
                <p>{t('infoCollected.p1')}</p>
                <h3 className="text-xl font-semibold tracking-tight text-gray-900 mt-6">{t('infoCollected.personalInfo.title')}</h3>
                <p>{t('infoCollected.personalInfo.p1')}</p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>{t('infoCollected.personalInfo.item1')}</li>
                  <li>{t('infoCollected.personalInfo.item2')}</li>
                  <li>{t('infoCollected.personalInfo.item3')}</li>
                  <li>{t('infoCollected.personalInfo.item4')}</li>
                </ul>
                <h3 className="text-xl font-semibold tracking-tight text-gray-900 mt-6">{t('infoCollected.usageData.title')}</h3>
                <p>{t('infoCollected.usageData.p1')}</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">{t('dataSecurity.title')}</h2>
              <div className="mt-6 space-y-4">
                <p>{t('dataSecurity.p1')}</p>
                <p>{t('dataSecurity.p2')}</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">{t('dataUse.title')}</h2>
              <div className="mt-6 space-y-4">
                <p>{t('dataUse.p1')}</p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>{t('dataUse.item1')}</li>
                  <li>{t('dataUse.item2')}</li>
                  <li>{t('dataUse.item3')}</li>
                  <li>{t('dataUse.item4')}</li>
                  <li>{t('dataUse.item5')}</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">{t('cookies.title')}</h2>
              <div className="mt-6 space-y-4">
                <p>{t('cookies.p1')}</p>
                <p>{t('cookies.p2')}</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">{t('thirdParty.title')}</h2>
              <div className="mt-6 space-y-4">
                <p>{t('thirdParty.p1')}</p>
                <p>{t('thirdParty.p2')}</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">{t('dataSharingDisclosure.title')}</h2>
              <div className="mt-6 space-y-4">
                <p>{t('dataSharingDisclosure.p1')}</p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>{t('dataSharingDisclosure.item1')}</li>
                  <li>{t('dataSharingDisclosure.item2')}</li>
                  <li>{t('dataSharingDisclosure.item3')}</li>
                  <li>{t('dataSharingDisclosure.item4')}</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">{t('userRights.title')}</h2>
              <div className="mt-6 space-y-4">
                <p>{t('userRights.p1')}</p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>{t('userRights.item1')}</li>
                  <li>{t('userRights.item2')}</li>
                  <li>{t('userRights.item3')}</li>
                  <li>{t('userRights.item4')}</li>
                  <li>{t('userRights.item5')}</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">{t('californiaPrivacy.title')}</h2>
              <div className="mt-6 space-y-4">
                <p>{t('californiaPrivacy.p1')}</p>
                <p>{t('californiaPrivacy.p2')}</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">{t('internationalUsers.title')}</h2>
              <div className="mt-6 space-y-4">
                <p>{t('internationalUsers.p1')}</p>
                <h3 className="text-xl font-semibold tracking-tight text-gray-900 mt-6">{t('internationalUsers.vietnam.title')}</h3>
                <p>{t('internationalUsers.vietnam.p1')}</p>
                <p>{t('internationalUsers.vietnam.p2')}</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">{t('childrenPrivacy.title')}</h2>
              <div className="mt-6 space-y-4">
                <p>{t('childrenPrivacy.p1')}</p>
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
                <p>{t('contact.p2')}</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 