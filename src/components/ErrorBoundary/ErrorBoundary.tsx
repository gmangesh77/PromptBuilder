import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import styles from './ErrorBoundary.module.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Uncaught error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.container} role="alert">
          <p className={styles.eyebrow}>Error</p>
          <h2 className={styles.heading}>Something went wrong</h2>
          <p className={styles.message}>
            An unexpected error occurred. Please try again.
          </p>
          <button
            type="button"
            className={styles.retryButton}
            onClick={this.handleRetry}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
