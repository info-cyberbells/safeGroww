"use client";
import { useEffect } from "react";

// This page is where Fyers redirects after login.
// It sends a success message to the parent (login) window and closes itself.
export default function AuthCallbackPage() {
  useEffect(() => {
    if (window.opener && !window.opener.closed) {
      window.opener.postMessage(
        { type: "AUTH_SUCCESS" },
        window.location.origin
      );
    }
    window.close();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#1a1c1e",
        color: "#fff",
        fontFamily: "sans-serif",
        gap: "12px",
      }}
    >
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="#4ade80" strokeWidth="2" />
        <path d="M8 12l3 3 5-5" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <p style={{ fontSize: "16px", margin: 0 }}>Login successful!</p>
      <p style={{ fontSize: "13px", color: "#999", margin: 0 }}>
        This window will close automatically...
      </p>
    </div>
  );
}
