import { Moon, SunMedium } from "lucide-react";
import { useUiStore } from "../../store/ui-store";

function ThemeToggle() {
  const theme = useUiStore((state) => state.theme);
  const toggleTheme = useUiStore((state) => state.toggleTheme);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Przełącz motyw kolorystyczny"
      className="inline-flex size-11 items-center justify-center rounded-full border border-white/50 bg-white/70 text-ink-900 transition duration-300 hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/5 dark:text-ivory-50"
    >
      {theme === "light" ? <Moon className="size-5" /> : <SunMedium className="size-5" />}
    </button>
  );
}

export default ThemeToggle;
