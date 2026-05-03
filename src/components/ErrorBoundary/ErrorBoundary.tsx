import { Component, ErrorInfo, ReactNode } from 'react';
import styles from './ErrorBoundary.module.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.errorScreen}>
          <h2>SYSTEM ERROR</h2>
          <p>Pokédex data corrupted...</p>
          <button
            className={styles.resetButton}
            onClick={() => this.setState({ hasError: false })}
          >
            Reboot System
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
