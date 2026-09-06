import React, { Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface Props {
  children: ReactNode;
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
    console.error("Uncaught SkyPulse App Error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          backgroundColor: "#07090e",
          color: "#00f0ff",
          fontFamily: "monospace",
          padding: "30px",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <div style={{
            maxWidth: "700px",
            background: "rgba(15, 23, 42, 0.95)",
            border: "1px solid #ef4444",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 0 30px rgba(239, 68, 68, 0.3)"
          }}>
            <h2 style={{ color: "#ef4444", fontSize: "18px", fontWeight: "bold", marginBottom: "12px" }}>
              ⚠️ SkyPulse Avionics Initializing Alert
            </h2>
            <p style={{ color: "#e2e8f0", fontSize: "13px", marginBottom: "16px" }}>
              {this.state.error?.message || "An unexpected error occurred during rendering."}
            </p>
            <pre style={{
              background: "#000",
              color: "#38bdf8",
              padding: "12px",
              borderRadius: "8px",
              fontSize: "11px",
              overflowX: "auto",
              maxHeight: "300px"
            }}>
              {this.state.error?.stack || String(this.state.error)}
            </pre>
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: "16px",
                padding: "10px 20px",
                background: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              🔄 Reload SkyPulse Radar
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
