"use client";

import type { ReactNode } from "react";
import ReactQueryProvider from "@/components/providers/ReactQuery";
import { Toaster } from "@/components/ui/sonner";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "@/components/providers/themeProvider";

// Check if we're in development mode using a client-safe approach
const isDevelopment = process.env.NODE_ENV === "development";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ReactQueryProvider>
        {children}
        {isDevelopment ? <ReactQueryDevtools /> : null}
        <Toaster />
      </ReactQueryProvider>
    </ThemeProvider>
  );
}
