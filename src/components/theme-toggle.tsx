"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useLang } from "./lang";

type Theme = "light" | "dark";

// <html data-theme> is the source of truth (set before paint by the script in the root layout).
const read = (): Theme => (document.documentElement.dataset.theme === "light" ? "light" : "dark");
const subscribe = (cb: () => void) => {
  const o = new MutationObserver(cb);
  o.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => o.disconnect();
};

export const useTheme = () => useSyncExternalStore(subscribe, read, () => "dark" as Theme);

function setTheme(next: Theme) {
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem("theme", next);
  } catch {
    /* storage blocked: theme still switches for this visit */
  }
}

const copy = {
  id: { toLight: "Ganti ke tema terang", toDark: "Ganti ke tema gelap" },
  en: { toLight: "Switch to light theme", toDark: "Switch to dark theme" },
};

/** Round icon button: shows the current theme, flips to the other one. */
export function ThemeButton({ className = "" }: { className?: string }) {
  const t = copy[useLang()];
  const theme = useTheme();
  return (
    <button
      type="button"
      onClick={() => setTheme(read() === "light" ? "dark" : "light")}
      aria-label={theme === "light" ? t.toDark : t.toLight}
      className={`press relative grid size-10 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-ink ${className}`}
    >
      {/* icons swap through CSS, so the server render never mismatches a saved light theme */}
      <Sun className="absolute size-[18px] transition-[rotate,scale,opacity] duration-300 motion-reduce:transition-none dark:-rotate-90 dark:scale-50 dark:opacity-0" aria-hidden />
      <Moon className="absolute size-[18px] rotate-90 scale-50 opacity-0 transition-[rotate,scale,opacity] duration-300 motion-reduce:transition-none dark:rotate-0 dark:scale-100 dark:opacity-100" aria-hidden />
    </button>
  );
}
