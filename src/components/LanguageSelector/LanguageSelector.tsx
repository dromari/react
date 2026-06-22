'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import styles from './LanguageSelector.module.css';

export default function LanguageSelector() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <div className={styles.selectorWrapper}>
      <select
        value={locale}
        onChange={handleLanguageChange}
        className={styles.selectInput}
      >
        <option value="en">EN</option>
        <option value="ru">RU</option>
      </select>
    </div>
  );
}
