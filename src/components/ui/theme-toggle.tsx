import React from "react";
import { useTheme } from "../../lib/theme-provider";

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = "" }) => {
  const { theme, setTheme, isDark } = useTheme();

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className={`
        inline-flex items-center justify-center
        w-10 h-10 p-2
        bg-background border border-border rounded-lg
        hover:bg-accent hover:text-accent-foreground
        focus:outline-none focus:ring-2 focus:ring-ring
        transition-colors duration-200
        ${className}
      `}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {isDark ? (
        // Sun icon for light mode
        <svg
          className="w-5 h-5 text-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      ) : (
        // Moon icon for dark mode
        <svg
          className="w-5 h-5 text-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
};

// Simple theme toggle with system preference option
export const ThemeSelect: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  const { theme, setTheme } = useTheme();

  return (
    <select
      value={theme}
      onChange={(e) => setTheme(e.target.value as "light" | "dark" | "system")}
      className={`
        px-3 py-2 bg-background border border-border rounded-lg
        text-foreground focus:outline-none focus:ring-2 focus:ring-ring
        ${className}
      `}
    >
      <option value="dark">Dark</option>
      <option value="light">Light</option>
      <option value="system">System</option>
    </select>
  );
};
