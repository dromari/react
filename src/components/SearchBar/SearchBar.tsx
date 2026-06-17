'use client';

import { useState, ChangeEvent } from 'react';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  initialQuery: string;
}

export default function SearchBar({ initialQuery }: SearchBarProps) {
  const [inputValue, setInputValue] = useState(initialQuery);
  const router = useRouter();
  const t = useTranslations('Search');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim().toLowerCase();

    if (trimmed) {
      router.push(`/?query=${encodeURIComponent(trimmed)}&page=1`);
    } else {
      router.push('/?page=1');
    }
  };

  return (
    <form onSubmit={handleSearchSubmit} className={styles.topControls}>
      <input
        type="text"
        className={styles.searchInput}
        value={inputValue}
        onChange={handleInputChange}
        placeholder={t('placeholder')}
      />
      <button type="submit" className={styles.searchButton}>
        {t('buttonText')}
      </button>
    </form>
  );
}
