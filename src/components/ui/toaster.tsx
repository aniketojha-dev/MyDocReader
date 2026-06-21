"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        style: {
          background: "white",
          border: "1px solid #e2e8f0",
          color: "#1e293b",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
        },
      }}
    />
  );
}
