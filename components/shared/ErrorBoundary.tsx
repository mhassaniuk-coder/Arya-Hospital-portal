import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary component that catches JavaScript errors anywhere in the child
 * component tree, logs those errors, and displays a fallback UI.
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    
    // Log error to console in development
    console.error('ErrorBoundary caught an error:', error);
    console.error('Error info:', errorInfo);
    
    // In production, you would send this to an error reporting service
    // Example: logErrorToService(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleGoHome = (): void => {
    window.location.href = '/';
  };

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      // Custom fallback provided
      if (fallback) {
        return fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-[400px] flex items-center justify-center p-4">
          <div className="flex flex-col items-center justify-center text-center space-y-6 animate-fade-in p-8 bg-white rounded-3xl border border-slate-100 shadow-sm max-w-lg w-full">
            {/* Error Icon */}
            <div className="relative">
              <div className="absolute inset-0 bg-red-400 blur-2xl opacity-20 rounded-full"></div>
              <div className="bg-gradient-to-br from-red-50 to-white p-8 rounded-full border border-red-100 relative shadow-sm">
                <AlertTriangle size={64} className="text-red-500" />
              </div>
            </div>

            {/* Error Message */}
            <div className="max-w-md space-y-3">
              <h2 className="text-3xl font-bold text-slate-800">
                Something went wrong
              </h2>
              <p className="text-slate-500 leading-relaxed text-lg">
                We encountered an unexpected error. Please try again or return to the home page.
              </p>
              
              {/* Error Details (Development only) */}
              {process.env.NODE_ENV === 'development' && error && (
                <div className="mt-4 p-4 bg-slate-50 rounded-xl text-left overflow-auto max-h-40">
                  <p className="text-xs font-mono text-red-600 break-all">
                    {error.toString()}
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
              <button
                onClick={this.handleReset}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl hover:translate-y-[-2px] flex items-center justify-center gap-2"
              >
                <RefreshCw size={18} />
                Try Again
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Home size={18} />
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;

/**
 * Higher-order component to wrap a component with an ErrorBoundary
 */
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
): React.FC<P> {
  return function WithErrorBoundaryWrapper(props: P) {
    return (
      <ErrorBoundary {...errorBoundaryProps}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
}
