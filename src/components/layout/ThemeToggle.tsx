import { Button } from "@omnidotdev/thornberry/button";
import { MoonIcon, SunIcon } from "lucide-react";

import { useTheme } from "@/providers/ThemeProvider";

/**
 * Theme toggle.
 */
const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <Button
      variant="ghost"
      className="min-h-11 min-w-11"
      onClick={toggleTheme}
      aria-label={
        theme === "light" ? "Switch to dark mode" : "Switch to light mode"
      }
    >
      {theme === "light" ? <MoonIcon /> : <SunIcon />}
    </Button>
  );
};

export default ThemeToggle;
