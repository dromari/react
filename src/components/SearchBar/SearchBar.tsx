import { Component, ChangeEvent, KeyboardEvent } from 'react';
import styles from './SearchBar.module.css';

interface Props {
  onSearch: (term: string) => void;
  initialValue: string;
}

interface State {
  inputValue: string;
}

class SearchBar extends Component<Props, State> {
  state: State = {
    inputValue: this.props.initialValue,
  };

  handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ inputValue: e.target.value });
  };

  handleBtnClick = () => {
    this.props.onSearch(this.state.inputValue.trim());
  };

  handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      this.handleBtnClick();
    }
  };

  render() {
    return (
      <div className={styles.topControls}>
        <input
          type="text"
          className={styles.searchInput}
          value={this.state.inputValue}
          onChange={this.handleInputChange}
          onKeyDown={this.handleKeyDown}
          placeholder="Search Pokemon..."
        />
        <button className={styles.searchButton} onClick={this.handleBtnClick}>
          Search
        </button>
      </div>
    );
  }
}

export default SearchBar;
