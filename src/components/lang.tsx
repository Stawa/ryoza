"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown, Globe } from "lucide-react";
import { defaultLang, langCookie, langs, type Lang } from "@/lib/i18n";

const LangContext = createContext<Lang>(defaultLang);

/** Set in the root layout from the [lang] route segment. */
export function LangProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return <LangContext.Provider value={lang}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);

const names: Record<Lang, string> = { id: "Bahasa Indonesia", en: "English" };
const short: Record<Lang, string> = { id: "Indonesia", en: "English" };
const copy = {
  id: { label: "Bahasa", change: "Ganti bahasa" },
  en: { label: "Language", change: "Change language" },
};

// The language is part of the root route (src/proxy.ts rewrites by cookie), so switching reloads the page.
function switchTo(next: Lang) {
  document.cookie = `${langCookie}=${next}; path=/; max-age=31536000; samesite=lax`;
  location.reload();
}

/** Desktop: globe button that opens a small language menu. */
export function LangMenu() {
  const lang = useLang();
  const t = copy[lang];
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls="lang-menu"
        aria-label={`${t.change}: ${names[lang]}`}
        onClick={() => setOpen(!open)}
        className={`press flex h-10 items-center gap-1.5 rounded-full pr-2.5 pl-3 text-small font-semibold transition-colors hover:bg-surface-2 hover:text-ink ${open ? "bg-surface-2 text-ink" : "text-muted"}`}
      >
        <Globe className="size-4" aria-hidden />
        <span className="uppercase">{lang}</span>
        <ChevronDown className={`size-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id="lang-menu"
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.2, 0.7, 0, 1] }}
            className="absolute top-full right-0 z-50 mt-3 w-56 origin-top-right rounded-2xl border border-line bg-surface p-1.5 shadow-[0_24px_60px_-20px_rgba(0,0,0,.6)]"
          >
            <p className="px-3 pt-1.5 pb-2 text-[12px] font-semibold text-muted">{t.label}</p>
            <ul>
              {langs.map((x) => (
                <li key={x}>
                  <button
                    type="button"
                    lang={x}
                    aria-current={x === lang ? "true" : undefined}
                    onClick={() => (x === lang ? setOpen(false) : switchTo(x))}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-small transition-colors hover:bg-surface-2 ${x === lang ? "font-semibold text-ink" : "text-muted hover:text-ink"}`}
                  >
                    <span className="grid h-6 w-8 shrink-0 place-items-center rounded-md bg-surface-2 text-[11px] font-bold tracking-wide uppercase">{x}</span>
                    <span className="flex-1">{names[x]}</span>
                    {x === lang && <Check className="size-4 text-accent-text" aria-hidden />}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Mobile menu: a labelled, full-width two-way switch. */
export function LangSegment() {
  const lang = useLang();
  return (
    <div role="group" aria-label={copy[lang].label}>
      <p className="mb-3 flex items-center gap-2 text-small font-semibold text-muted">
        <Globe className="size-4" aria-hidden />
        {copy[lang].label}
      </p>
      <div className="grid grid-cols-2 gap-1 rounded-full border border-line bg-surface p-1">
        {langs.map((x) => (
          <button
            key={x}
            type="button"
            lang={x}
            aria-pressed={x === lang}
            onClick={() => x !== lang && switchTo(x)}
            className={`press h-11 rounded-full text-small font-semibold transition-colors ${x === lang ? "bg-surface-2 text-ink shadow-[inset_0_0_0_1px_var(--line)]" : "text-muted hover:text-ink"}`}
          >
            {short[x]}
          </button>
        ))}
      </div>
    </div>
  );
}
