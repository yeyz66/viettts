'use client';

import { useTranslations } from 'next-intl';
import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

export default function FAQ() {
  const t = useTranslations('faq');

  // 获取所有可用的 FAQ 键进行调试
  const allKeys = [];
  for (let i = 1; i <= 10; i++) {
    try {
      const key = `q${i}`;
      const value = t(key);
      if (value !== key) {
        allKeys.push({ key, value });
      }
    } catch {
      // 如果键不存在，会抛出错误，我们可以忽略它
    }
  }

  console.log('Available FAQ keys:', allKeys);

  // 明确只使用 q1 到 q5，即使 q6 存在也不渲染
  const faqIds = ['q1', 'q2', 'q3', 'q4', 'q5'];
  const faqs = faqIds.map(id => ({
    question: t(id),
    answer: t(id.replace('q', 'a'))
  }));

  console.log('FAQ items being rendered:', faqs);

  return (
    <div id="faq" className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-4xl divide-y divide-gray-900/10 dark:divide-gray-700">
          <h2 className="text-3xl font-bold leading-10 tracking-tight text-gray-900 dark:text-white text-center mb-12">
            {t('title')}
          </h2>
          <motion.dl 
            className="mt-10 space-y-6 divide-y divide-gray-900/10 dark:divide-gray-700"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.1 }}
          >
            {faqs.map((faq, index) => (
              <motion.div 
                key={index} 
                className="pt-6"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Disclosure as="div">
                  {({ open }) => (
                    <>
                      <dt>
                        <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900 dark:text-white">
                          <span className="text-base font-semibold leading-7">{faq.question}</span>
                          <span className="ml-6 flex h-7 items-center">
                            <ChevronDownIcon
                              className={`h-6 w-6 ${
                                open ? 'rotate-180' : ''
                              } duration-200 text-indigo-600 dark:text-indigo-400`}
                              aria-hidden="true"
                            />
                          </span>
                        </Disclosure.Button>
                      </dt>
                      <Disclosure.Panel as="dd" className="mt-2 pr-12">
                        <p className="text-base leading-7 text-gray-600 dark:text-gray-300">{faq.answer}</p>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              </motion.div>
            ))}
          </motion.dl>
        </div>
      </div>
    </div>
  );
} 