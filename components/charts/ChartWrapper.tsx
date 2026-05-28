"use client";

import { useState, useEffect } from "react";

interface ChartWrapperProps {
  className?: string;
  children: React.ReactNode;
}

export function ChartWrapper({ className = "h-full w-full", children }: ChartWrapperProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={className}>
      {mounted ? children : null}
    </div>
  );
}
