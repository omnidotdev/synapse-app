import { MoonIcon, SunIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/providers/ThemeProvider";

/**
 * Theme toggle.
 */
const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <Button variant="ghost" onClick={toggleTheme} aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}>
      {theme === "light" ? <MoonIcon /> : <SunIcon />}
    </Button>
  );
};

export default ThemeToggle;
