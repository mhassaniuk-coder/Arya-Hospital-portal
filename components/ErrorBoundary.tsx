import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full text-center border border-slate-100">
            <div className="bg-red-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="text-red-500" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Something went wrong</h1>
            <p className="text-slate-500 mb-6">The application encountered an unexpected error.</p>
            
            {this.state.error && (
              <div className="bg-slate-900 text-slate-200 p-4 rounded-lg text-left text-sm font-mono overflow-auto max-h-48 mb-6">
                <p className="text-red-400 font-bold mb-2">{this.state.error.toString()}</p>
                {this.state.errorInfo && (
                  <pre className="text-xs opacity-70 whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}

            <button
              onClick={() => window.location.reload()}
              className="bg-arya-600 hover:bg-arya-700 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 mx-auto transition-colors w-full"
            >
              <RefreshCw size={18} />
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
