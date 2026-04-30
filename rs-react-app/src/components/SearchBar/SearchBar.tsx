import { Component } from 'react';
import styles from './SearchBar.module.css';

class SearchBar extends Component {
  render() {
    return (
      <div className={styles.topControls}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search Input Field"
        />
        <button className={styles.searchButton}>Search</button>
      </div>
    );
  }
}

export default SearchBar;
