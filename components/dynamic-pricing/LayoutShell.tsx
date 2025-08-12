"use client";

import type React from "react";

import { ThemeToggle } from "./ThemeToggle";

interface LayoutShellProps {
  children: React.ReactNode;
}

export function LayoutShell({ children }: LayoutShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Price Sensitivity Dashboard
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Explore demand, revenue & profit trade-offs across segments
              </p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
