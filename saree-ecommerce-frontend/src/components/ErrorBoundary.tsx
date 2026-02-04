import React from 'react';

type State = { hasError: boolean; error?: Error | null };

class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    // Log to console and (optionally) send to collector
    // eslint-disable-next-line no-console
    console.error('Uncaught error in React tree:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="bg-white p-6 rounded shadow text-center max-w-2xl">
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-sm text-gray-600 mb-4">An unexpected error occurred while rendering the application. Details are logged to the console.</p>
            <pre className="text-xs text-left bg-gray-100 p-3 rounded max-h-48 overflow-auto">{String(this.state.error)}</pre>
          </div>
        </div>
      );
    }

    return this.props.children as React.ReactElement;
  }
}

export default ErrorBoundary;
