'use client';

import { useEffect } from 'react';
import { usePokemonStore } from '../../store/usePokemonStore';
import styles from './Flyout.module.css';

export default function Flyout() {
  const { selectedPokemons, unselectAll } = usePokemonStore();

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
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${selectedPokemons.length}_items.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('CSV Error:', error);
    }
  };

  return (
    <div className={styles.flyoutSticky}>
      <div className={styles.info}>
        Selected items: <strong>{selectedPokemons.length}</strong>
      </div>
      <div className={styles.actions}>
        <button onClick={unselectAll} className={styles.clearBtn}>
          Unselect all
        </button>
        <button onClick={handleDownloadCSV} className={styles.downloadBtn}>
          Download CSV
        </button>
      </div>
    </div>
  );
}
