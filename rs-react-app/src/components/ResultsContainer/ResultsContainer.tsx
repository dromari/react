import { Component } from 'react';
import styles from './Results.module.css';

class Results extends Component {
  render() {
    return (
      <div className={styles.resultsArea}>
        <div className={styles.tableHeader}>
          <div className={styles.cell}>Item Name</div>
          <div className={styles.cell}>Status/Type</div>
        </div>
        <div className={styles.resultsBody}>
          <div className={styles.tableRow}>
            <div className={styles.cell}>Pikachu</div>
            <div className={styles.cell}>Electric</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Results;
