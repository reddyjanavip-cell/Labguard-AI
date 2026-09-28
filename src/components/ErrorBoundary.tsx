import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RotateCcw, Home, ChevronRight } from 'lucide-react';

interface Props {
  children: ReactNode;
  sectionName?: string;
  fallback?: ReactNode;
  onResetToSafeView?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  private handleSafeNavigate = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onResetToSafeView) {
      this.props.onResetToSafeView();
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const section = this.props.sectionName || 'Application View';
      const sanitizedMessage = this.state.error?.message
        ? this.state.error.message.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[redacted]')
        : 'An unexpected runtime condition occurred in this component.';

      return (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-6 sm:p-8 text-slate-800 shadow-sm max-w-3xl mx-auto my-6 animate-fadeIn">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-rose-100 text-rose-700 rounded-xl">
              <AlertOctagon className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-200/80 text-rose-900 font-mono">
                  Protected Sandbox Error Boundary
                </span>
                <span className="text-xs text-slate-400 font-medium">· Section: {section}</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-2">
                Unable to render {section}
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                The application encountered an unexpected issue while rendering this section. State integrity and other application features remain operational.
              </p>

              <div className="mt-4 p-3 bg-white rounded-xl border border-rose-200 text-xs font-mono text-rose-800 break-words">
                {sanitizedMessage}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={this.handleRetry}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retry Component</span>
                </button>

                {this.props.onResetToSafeView && (
                  <button
                    type="button"
                    onClick={this.handleSafeNavigate}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold transition-all"
                  >
                    <Home className="w-3.5 h-3.5" />
                    <span>Return to Dashboard</span>
                  </button>
                )}
              </div>

              {process.env.NODE_ENV !== 'production' && this.state.errorInfo && (
                <details className="mt-5 text-[11px] text-slate-500 cursor-pointer">
                  <summary className="font-semibold text-slate-700 hover:text-slate-900">
                    Component Stack Trace (Diagnostic Details)
                  </summary>
                  <pre className="mt-2 p-3 bg-slate-900 text-slate-100 rounded-xl overflow-x-auto text-[10px] font-mono whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
