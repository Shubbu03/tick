"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export function useThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, systemTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return {
      theme: undefined,
      setTheme: () => null,
      systemTheme: undefined,
    };
  }

  return { theme, setTheme, systemTheme };
}
