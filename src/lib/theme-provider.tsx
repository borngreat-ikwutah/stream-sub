import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
};

const initialState: ThemeProviderState = {
  theme: "dark",
  setTheme: () => null,
  isDark: true,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = "stream-sub-theme",
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [isDark, setIsDark] = useState(defaultTheme === "dark");

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    const root = window.document.documentElement;

    // Get stored theme or use default
    const storedTheme = localStorage.getItem(storageKey) as Theme | null;
    const initialTheme = storedTheme || defaultTheme;

    setTheme(initialTheme);

    // Apply theme logic
    const applyTheme = (currentTheme: Theme) => {
      root.classList.remove("light", "dark");

      if (currentTheme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
          .matches
          ? "dark"
          : "light";

        root.classList.add(systemTheme);
        setIsDark(systemTheme === "dark");
      } else {
        root.classList.add(currentTheme);
        setIsDark(currentTheme === "dark");
      }
    };

    applyTheme(initialTheme);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, storageKey, defaultTheme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      if (typeof window === "undefined") return;

      localStorage.setItem(storageKey, theme);
      setTheme(theme);

      const root = window.document.documentElement;
      root.classList.remove("light", "dark");

      if (theme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
          .matches
          ? "dark"
          : "light";

        root.classList.add(systemTheme);
        setIsDark(systemTheme === "dark");
      } else {
        root.classList.add(theme);
        setIsDark(theme === "dark");
      }
    },
    isDark,
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};

// Theme initialization script for preventing flash
export const themeScript = `
  (function() {
    const storageKey = 'stream-sub-theme';
    const defaultTheme = 'dark';

    try {
      const theme = localStorage.getItem(storageKey) || defaultTheme;
      const root = document.documentElement;

      root.classList.remove('light', 'dark');

      if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        root.classList.add(systemTheme);
      } else {
        root.classList.add(theme);
      }
    } catch (e) {
      // Fallback to default theme
      document.documentElement.classList.add(defaultTheme);
    }
  })();
`;
