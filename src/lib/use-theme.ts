"use client";

import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    // Reading the class the beforeInteractive theme-init script (layout.tsx)
    // already applied to <html>, so React's state matches the real DOM theme
    // post-mount. Doing this in a lazy useState initializer instead causes a
    // hydration mismatch, since the script runs (and can flip the class)
    // between the server render and client hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(
      document.documentElement.classList.contains("dark") ? "dark" : "light"
    );
  }, []);

  const applyTheme = (next: Theme) => {
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem("theme", next);
    setTheme(next);
  };

  return { theme, setTheme: applyTheme };
}
