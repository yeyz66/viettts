'use client';

import { useState } from 'react';
import { Dialog, Popover } from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import LanguageSwitcher from './language-switcher';
import { useTranslations } from 'next-intl';
import { useLocale } from '../i18n/intl-provider';
import { defaultLocale } from '../i18n/config';
// Auth imports
import { useAuthStore } from '@/app/store/authStore';
import { auth } from '@/app/utils/firebase';
import { signOut } from 'firebase/auth';
// 导入确认组件
import ConfirmPopover from './ConfirmPopover';

export default function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = useTranslations('nav');
  const logoutT = useTranslations('logout_confirmation');
  const { locale: rawLocale } = useLocale();
  const locale = rawLocale || defaultLocale;

  // Get Auth State - CORRECTED: Select individual state pieces
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const logoutAction = useAuthStore((state) => state.logout);

  // Define the text-to-speech link text based on locale
  const textToSpeechText = locale === 'vi' 
    ? 'Chuyển văn bản thành giọng nói'
    : t('textToSpeech');

  // 移除常见问题，单独处理
  const navigation = [
    { name: t('home'), href: `/${locale === 'en' ? '' : locale}` },
    { name: t('features'), href: `/${locale === 'en' ? '' : locale}#features` },
    { name: t('pricing'), href: `/${locale === 'en' ? '' : locale}/pricing` },
    { name: t('howItWorks'), href: `/${locale === 'en' ? '' : locale}/how-it-works` },
    { name: textToSpeechText, href: `${locale === 'en' ? '/en' : `/${locale}`}/text-to-speech` },
  ];

  // Logout Handler
  async function handleLogout(): Promise<void> {
    try {
      await signOut(auth);
      logoutAction();
      console.log('User logged out from NavBar.');
      // Navigation to login page will be handled by AuthGuard if needed
      // or could be explicitly done here if preferred: router.push('/login');
    } catch (error) {
      console.error('NavBar Logout failed:', error);
    }
  }

  // Helper for basic Tailwind spinner
  const renderSpinner = () => (
    <div
      className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 dark:border-gray-100"
      role="status"
      aria-label="loading"
    />
  );

  return (
    <header className="bg-white dark:bg-gray-900 sticky top-0 z-50 shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href={`/${locale === 'en' ? '' : locale}`} className="-m-1.5 p-1.5">
            <span className="sr-only">viettts</span>
            <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">viettts</div>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-300"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <Popover.Group className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              {item.name}
            </Link>
          ))}
          {/* 单独处理常见问题链接，加上右侧边距 */}
          <Link
            href={`/${locale === 'en' ? '' : locale}/faq`}
            className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 mr-8"
          >
            {t('faq')}
          </Link>
        </Popover.Group>
        <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end">
          <div className="mr-6">
            <LanguageSwitcher />
          </div>
          <div className="h-6 flex items-center">
            {isLoading ? (
              renderSpinner()
            ) : isAuthenticated ? (
              <>
                <span className="text-sm font-semibold leading-6 text-gray-700 dark:text-gray-300 mr-4">
                  {user?.displayName || user?.email || '用户'}
                </span>
                <ConfirmPopover
                  onConfirm={handleLogout}
                  title={logoutT('title')}
                  description={logoutT('description')}
                  confirmText={logoutT('confirm')}
                  cancelText={logoutT('cancel')}
                  confirmColor="red"
                  placement="bottom"
                >
                  <button
                    className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 whitespace-nowrap min-w-[60px] cursor-pointer"
                  >
                    {t('logout')}
                  </button>
                </ConfirmPopover>
              </>
            ) : (
              <Link
                href={`/${locale === 'en' ? '' : locale}/login`}
                className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 whitespace-nowrap"
              >
                {t('login')}
              </Link>
            )}
          </div>
        </div>
      </nav>

      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-50" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white dark:bg-gray-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href={`/${locale === 'en' ? '' : locale}`} className="-m-1.5 p-1.5">
              <span className="sr-only">viettts</span>
              <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">viettts</div>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <Link
                  href={`/${locale === 'en' ? '' : locale}/faq`}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('faq')}
                </Link>
              </div>

              <div className="py-6 space-y-4">
                <div className="min-h-[2.5rem] flex items-center px-3">
                  {isLoading ? (
                    renderSpinner()
                  ) : isAuthenticated ? (
                    <div className="w-full">
                      <div className="block py-2.5 text-base font-semibold leading-7 text-gray-700 dark:text-gray-300">
                        {user?.displayName || user?.email || '用户'}
                      </div>
                      <ConfirmPopover
                        onConfirm={handleLogout}
                        title={logoutT('title')}
                        description={logoutT('description')}
                        confirmText={logoutT('confirm')}
                        cancelText={logoutT('cancel')}
                        confirmColor="red"
                        placement="bottom"
                      >
                        <button
                          className="block w-full text-left rounded-lg py-2.5 text-base font-semibold leading-7 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 whitespace-nowrap cursor-pointer"
                        >
                          {t('logout')}
                        </button>
                      </ConfirmPopover>
                    </div>
                  ) : (
                    <Link
                      href={`/${locale === 'en' ? '' : locale}/login`}
                      className="block rounded-lg py-2.5 text-base font-semibold leading-7 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 whitespace-nowrap"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('login')}
                    </Link>
                  )}
                </div>
                <div className="-mx-3 mt-4">
                  <LanguageSwitcher />
                </div>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
} 