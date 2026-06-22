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

  const selectedIds = selectedPokemons
    .map((p) => p.name.toLowerCase())
    .join(',');

  const downloadUrl = `/api/download-csv?ids=${encodeURIComponent(selectedIds)}&count=${selectedPokemons.length}`;

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
        <a
          href={downloadUrl}
          className={styles.downloadBtn}
          style={{ textDecoration: 'none' }}
        >
          {t('download')}
        </a>
      </div>
    </div>
  );
}
