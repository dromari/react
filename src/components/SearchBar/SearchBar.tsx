import { useState, ChangeEvent, KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SearchBar.module.css';
import { SearchBarProps } from '../../types/pokemonTypes';

export default function SearchBar({ onSearch, initialValue }: SearchBarProps) {
  const [inputValue, setInputValue] = useState(initialValue);
  const navigate = useNavigate();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleBtnClick = () => {
    const trimmedValue = inputValue.trim();
    onSearch(trimmedValue);

    navigate('/?page=1');
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
