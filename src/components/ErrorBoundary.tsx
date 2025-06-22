import React from 'react';
import { Alert, AlertTitle, Button, Typography, Box } from '@mui/material';

interface Props {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorInfo>;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorInfo {
  error?: Error;
  errorInfo?: React.ErrorInfo;
  resetError: () => void;
}

const DefaultErrorFallback: React.FC<ErrorInfo> = ({ error, resetError }) => (
  <Box sx={{ p: 3 }}>
    <Alert severity="error">
      <AlertTitle>Something went wrong</AlertTitle>
      <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
        {error?.message || 'An unexpected error occurred'}
      </Typography>
      <Button variant="outlined" onClick={resetError} size="small" data-testid="error-retry-button" aria-label="Try again">
        Try again
      </Button>
    </Alert>
  </Box>
);

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      const ErrorComponent = this.props.fallback || DefaultErrorFallback;
      return (
        <ErrorComponent
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          resetError={this.resetError}
        />
      );
    }

    return this.props.children;
  }
}
