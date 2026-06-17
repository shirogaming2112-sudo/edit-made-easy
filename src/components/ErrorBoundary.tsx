import { Component, ErrorInfo, ReactNode } from "react";
import ErrorFallback from "./ErrorFallback";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
  info: ErrorInfo | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null, info: null };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error("[ErrorBoundary]", error, info);
    this.setState({ info });
  }

  handleReset = () => {
    this.setState({ error: null, info: null });
  };

  render() {
    if (this.state.error) {
      return (
        <ErrorFallback
          error={this.state.error}
          info={this.state.info}
          onReset={this.handleReset}
        />
      );
    }
    return this.props.children;
  }
}
