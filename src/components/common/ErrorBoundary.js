"use client";

import React from "react";
import ErrorDisplay from "./ErrorDisplay";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to console for debugging
    console.error("Error Boundary caught an error:", error, errorInfo);

    // You can also log to an error reporting service here
    // logErrorToService(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });

    // Call parent retry function if provided
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleRetry);
      }

      return (
        <ErrorDisplay
          error={this.state.error}
          onRetry={this.handleRetry}
          context={this.props.context || "rendering this section"}
          className={this.props.className}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
