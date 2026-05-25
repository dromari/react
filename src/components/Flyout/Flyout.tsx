import { usePokemonStore } from '../../store/usePokemonStore';
import styles from './Flyout.module.css';

export default function Flyout() {
  const { selectedPokemons, unselectAll } = usePokemonStore();

  if (selectedPokemons.length === 0) return null;

  const handleDownloadCSV = () => {
    const headers = 'Name,Description,Details URL\n';

    const rows = selectedPokemons
      .map((p) => {
        const cleanDesc = p.description.replace(/"/g, '""');
        return `"${p.name}","${cleanDesc}","${p.detailsUrl}"`;
      })
      .join('\n');

    const blob = new Blob([headers + rows], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;

    link.setAttribute('download', `${selectedPokemons.length}_items.csv`);
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
          Download
        </button>
      </div>
    </div>
  );
}
