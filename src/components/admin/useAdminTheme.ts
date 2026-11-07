import { useEffect, useState } from "react";

const KEY = "admin_theme";

export type AdminTheme = "light" | "dark";

export function useAdminTheme() {
  const [theme, setTheme] = useState<AdminTheme>("light");

  useEffect(() => {
    const stored = (window.localStorage.getItem(KEY) as AdminTheme | null) ?? "light";
    setTheme(stored);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    window.localStorage.setItem(KEY, theme);
    return () => root.classList.remove("dark");
  }, [theme]);

  return { theme, setTheme };
}