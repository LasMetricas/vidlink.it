"use client";

import { Component, ErrorInfo, ReactNode } from "react";
import { errorLogger } from "../../../../utils/errorLogger";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to backend
    errorLogger.logComponentError(error, errorInfo);

    // Log to console in dev
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Fail silently - don't show errors to users
      // Error logged to backend for review
      return null;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

