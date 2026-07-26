"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "./Icons";

type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "research-with-ai:theme";

function currentTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function storedTheme(): Theme | null {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : null;
  } catch {
    return null;
  }
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  document
    .querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
    .forEach((meta) => {
      meta.content = theme === "dark" ? "#10110f" : "#ffffff";
    });
}

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => setTheme(currentTheme());
    const followSystem = (event: MediaQueryListEvent) => {
      if (storedTheme()) return;
      applyTheme(event.matches ? "dark" : "light");
      window.dispatchEvent(new Event("research-with-ai-theme"));
    };

    sync();
    window.addEventListener("research-with-ai-theme", sync);
    media.addEventListener("change", followSystem);
    return () => {
      window.removeEventListener("research-with-ai-theme", sync);
      media.removeEventListener("change", followSystem);
    };
  }, []);

  const nextTheme = theme === "dark" ? "light" : "dark";
  const label = `Switch to ${nextTheme} mode`;

  return (
    <button
      aria-label={label}
      aria-pressed={theme === "dark"}
      className={`theme-toggle ${compact ? "theme-toggle-compact" : ""}`}
      onClick={() => {
        applyTheme(nextTheme);
        try {
          window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
        } catch {
          // The theme still applies for the current page view.
        }
        setTheme(nextTheme);
        window.dispatchEvent(new Event("research-with-ai-theme"));
      }}
      title={label}
      type="button"
    >
      {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
      <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>
    </button>
  );
}
