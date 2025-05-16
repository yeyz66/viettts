'use client';

import { useTranslations } from 'next-intl';

interface RegionSpecificTermsProps {
  region: 'us' | 'china' | 'vietnam';
}

export default function RegionSpecificTerms({ region }: RegionSpecificTermsProps) {
  const t = useTranslations('regionSpecificTerms');

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${region}.title`)}</h2>
      <div className="mt-6 space-y-4">
        {Array.from({ length: 5 }, (_, i) => i + 1).map((num) => {
          const key = `${region}.p${num}`;
          try {
            // 尝试获取翻译文本，如果不存在则跳过
            const text = t(key);
            return <p key={key}>{text}</p>;
          } catch {
            return null;
          }
        })}
      </div>
    </section>
  );
} 