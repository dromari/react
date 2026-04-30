import { Component, ChangeEvent } from 'react';
import styles from './SearchBar.module.css';

interface Props {
  onSearch: (term: string) => void;
}

interface State {
  inputValue: string;
}

class SearchBar extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const savedTerm = localStorage.getItem('pokeSearch') || '';
    this.state = {
      inputValue: savedTerm,
    };
  }

  handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ inputValue: e.target.value });
  };

  handleBtnClick = () => {
    this.props.onSearch(this.state.inputValue.trim());
  };
  render() {
    return (
      <div className={styles.topControls}>
        <input
          type="text"
          className={styles.searchInput}
          value={this.state.inputValue}
          onChange={this.handleInputChange}
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
