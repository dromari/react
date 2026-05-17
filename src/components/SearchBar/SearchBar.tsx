import { useState, ChangeEvent, KeyboardEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import styles from './SearchBar.module.css';

interface Props {
  onSearch: (term: string) => void;
  initialValue: string;
}

export default function SearchBar({ onSearch, initialValue }: Props) {
  const [inputValue, setInputValue] = useState(initialValue);
  const [, setSearchParams] = useSearchParams();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleBtnClick = () => {
    const trimmedValue = inputValue.trim();
    onSearch(trimmedValue);
    setSearchParams({ page: '1' });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleBtnClick();
    }
  };

  return (
    <div className={styles.topControls}>
      <input
        type="text"
        className={styles.searchInput}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Search Pokemon..."
      />
      <button className={styles.searchButton} onClick={handleBtnClick}>
        Search
      </button>
    </div>
  );
}
