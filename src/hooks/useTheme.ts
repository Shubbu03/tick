"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export function useThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return { theme: "system", setTheme: () => {} };
  }

  return { theme, setTheme };
}
