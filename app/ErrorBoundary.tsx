import React from "react";
import { Error, ErrorType } from "../components/common/error";

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
    // You can add more sophisticated logging here, e.g., to a service like Sentry
  }

  render() {
    if (this.state.hasError) {
      return (
        <Error type={ErrorType.UNKNOWN} message={this.state.error.message} />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
