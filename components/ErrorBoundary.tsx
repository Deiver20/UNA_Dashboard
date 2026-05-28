"use client";

import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="p-6 text-center" style={{ color: "var(--warning)" }}>
            <p className="font-semibold mb-2">Algo salió mal al renderizar esta sección.</p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {this.state.error?.message || "Error desconocido"}
            </p>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
