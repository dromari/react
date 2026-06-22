'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { usePokemonStore } from '../../store/usePokemonStore';
import styles from './Flyout.module.css';

export default function Flyout() {
  const { selectedPokemons, unselectAll } = usePokemonStore();
  const t = useTranslations('Flyout');

  useEffect(() => {
    if (selectedPokemons.length === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') unselectAll();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPokemons, unselectAll]);

  if (selectedPokemons.length === 0) return null;

  const handleDownloadCSV = async () => {
    try {
      const response = await fetch('/api/download-csv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: selectedPokemons }),
      });

      if (!response.ok) throw new Error('Failed to generate CSV');

      const blob = await response.blob();

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result as string;

        const downloadUrl = base64Data.replace(
          /^data:text\/csv;base64,/,
          'data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename%3Dpokemons.csv;base64,'
        );

        window.open(downloadUrl, '_self');
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('CSV Error:', error);
    }
  };

  return (
    <div className={styles.flyoutSticky}>
      <div className={styles.info}>
        {t.rich('selectedItems', {
          count: selectedPokemons.length,
          strong: (chunks) => <strong>{chunks}</strong>,
        })}
      </div>
      <div className={styles.actions}>
        <button onClick={unselectAll} className={styles.clearBtn}>
          {t('unselectAll')}
        </button>
        <button onClick={handleDownloadCSV} className={styles.downloadBtn}>
          {t('download')}
        </button>
      </div>
    </div>
  );
}
