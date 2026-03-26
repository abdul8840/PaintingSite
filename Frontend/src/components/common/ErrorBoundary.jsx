import { Component } from 'react';
import { HiRefresh, HiArrowLeft, HiExclamationCircle } from 'react-icons/hi';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="
            min-h-screen bg-paper
            flex items-center justify-center
            px-4 py-16
          "
        >
          <div className="max-w-md w-full text-center animate-fade-in-up"
            style={{ animationFillMode: 'forwards' }}
          >
            {/* Error Icon */}
            <div
              className="
                inline-flex items-center justify-center
                w-20 h-20 rounded-3xl
                bg-rust/10
                mb-6
              "
            >
              <HiExclamationCircle className="w-10 h-10 text-rust" />
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">
              Something went wrong
            </h1>

            {/* Description */}
            <p className="mt-3 text-sm text-mist leading-relaxed max-w-sm mx-auto">
              We're sorry for the inconvenience. Please try refreshing the page
              or go back to the previous page.
            </p>

            {/* Error detail (development) */}
            {this.state.error && (
              <div
                className="
                  mt-5 p-4 rounded-xl
                  bg-cream/60 border border-cream
                  text-left
                "
              >
                <p className="text-xs font-mono text-rust/70 break-all line-clamp-3">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
              <button
                onClick={() => window.location.reload()}
                className="
                  group w-full sm:w-auto
                  inline-flex items-center justify-center gap-2
                  px-6 py-3 rounded-xl
                  bg-ink text-paper text-sm font-semibold
                  hover:bg-charcoal
                  transition-all duration-300 cursor-pointer
                  active:scale-[0.98]
                  shadow-md shadow-ink/10
                "
              >
                <HiRefresh
                  className="
                    w-4 h-4
                    group-hover:rotate-180
                    transition-transform duration-500
                  "
                />
                Refresh Page
              </button>
              <button
                onClick={() => {
                  this.setState({ hasError: false });
                  window.history.back();
                }}
                className="
                  group w-full sm:w-auto
                  inline-flex items-center justify-center gap-2
                  px-6 py-3 rounded-xl
                  border-2 border-ink text-ink text-sm font-semibold
                  hover:bg-ink hover:text-paper
                  transition-all duration-300 cursor-pointer
                  active:scale-[0.98]
                "
              >
                <HiArrowLeft
                  className="
                    w-4 h-4
                    group-hover:-translate-x-1
                    transition-transform duration-300
                  "
                />
                Go Back
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;