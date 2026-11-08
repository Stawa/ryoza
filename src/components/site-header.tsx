"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ArrowUpRight, Bot, ChevronDown, Database, Gamepad2, Globe, MapPin, Menu, X } from "lucide-react";
import { useUser } from "@/lib/firebase";
import type { Lang } from "@/lib/i18n";
import { catalogFor, catalogSize, nav, type NavItem } from "@/lib/site";
import { LangMenu, LangSegment, useLang } from "./lang";
import { Logo } from "./logo";
import { ThemeButton } from "./theme-toggle";

const icons = {
  game: Gamepad2,
  bot: Bot,
  web: Globe,
  db: Database,
  map: MapPin,
};
// a few of each kind for the "browse all" row
const sample = ["Minecraft", "Palworld", "Rust", "Discord bots", "Telegram bots", "WordPress", "MySQL"].map((n) => catalogFor("en").find((c) => c.name === n)!);
const ease = [0.2, 0.7, 0, 1] as const;

const OFFSET = 120; // header height plus a little: where a section "starts" for the reader
// home-page sections, in page order, and the nav item (by href) each one lights up
const spyMap: Record<string, string> = {
  games: "/#games",
  features: "/#features",
  panel: "/#features",
  reviews: "/#reviews",
  pricing: "/#pricing",
  locations: "/#pricing",
  faq: "/#faq",
};

const copy = {
  id: { main: "Navigasi utama", account: "Akun", login: "Masuk", start: "Daftar", open: "Buka menu", close: "Tutup menu", browse: (n: number) => `Lihat semua ${n} game, bot & aplikasi` },
  en: { main: "Main", account: "Account", login: "Log in", start: "Get started", open: "Open menu", close: "Close menu", browse: (n: number) => `Browse all ${n} games, bots and apps` },
};

/** The current nav item's href: by route on other pages, by the section in view on the home page. */
function useActiveHref(pathname: string) {
  const [spy, setSpy] = useState<string | null>(null);

  useEffect(() => {
    if (pathname !== "/") return;
    const update = () => {
      const inView = Object.keys(spyMap)
        .map((id) => document.getElementById(id))
        .find((el) => {
          if (!el) return false;
          const r = el.getBoundingClientRect();
          return r.top <= OFFSET && r.bottom > OFFSET;
        });
      setSpy(inView ? spyMap[inView.id] : null);
    };
    const raf = requestAnimationFrame(update);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("hashchange", update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update);
      window.removeEventListener("hashchange", update);
    };
  }, [pathname]);

  // other pages light up the item whose home section they expand on ("/pricing" -> "/#pricing")
  if (pathname !== "/") return nav.find((n) => n.href.replace("/#", "/") === pathname)?.href ?? null;
  return spy;
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false); // mobile sheet
  const [menu, setMenu] = useState<string | null>(null); // desktop dropdown
  const pathname = usePathname();
  const user = useUser();
  const active = useActiveHref(pathname);
  const lang = useLang();
  const t = copy[lang];
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape and outside clicks close whatever is open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setMenu(null);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setMenu(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const hoverOpen = (href: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMenu(href);
  };
  const hoverClose = () => {
    closeTimer.current = setTimeout(() => setMenu(null), 140);
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled || open ? "border-b border-line bg-bg/80 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <div className="frame flex h-[72px] items-center justify-between gap-6">
        <Logo />

        <nav ref={navRef} aria-label={t.main} className="hidden lg:block">
          <ul className="flex items-center gap-1 rounded-full border border-line bg-surface/70 p-1">
            {nav.map((n) => (
              <li key={n.href} className="relative" onMouseEnter={() => n.children && hoverOpen(n.href)} onMouseLeave={() => n.children && hoverClose()}>
                {n.children ? (
                  <button
                    type="button"
                    aria-expanded={menu === n.href}
                    aria-controls={`menu-${n.href.slice(2)}`}
                    onClick={() => setMenu(menu === n.href ? null : n.href)}
                    className={pillClass(active === n.href)}
                  >
                    <ActivePill on={active === n.href} />
                    {n.label[lang]}
                    <ChevronDown className={`size-3.5 transition-transform duration-200 ${menu === n.href ? "rotate-180" : ""}`} aria-hidden />
                  </button>
                ) : (
                  <Link href={n.href} aria-current={active === n.href ? (n.href.includes("#") ? "location" : "page") : undefined} className={pillClass(active === n.href)}>
                    <ActivePill on={active === n.href} />
                    {n.label[lang]}
                  </Link>
                )}

                <AnimatePresence>
                  {n.children && menu === n.href && (
                    <motion.div
                      id={`menu-${n.href.slice(2)}`}
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.18, ease }}
                      className="absolute top-full left-1/2 w-[540px] -translate-x-1/2 pt-3"
                    >
                      <DropdownPanel item={n} lang={lang} onPick={() => setMenu(null)} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {/* desktop: language and theme share one pill; below lg the theme button stands alone and language lives in the menu */}
          <div className="hidden items-center rounded-full border border-line bg-surface/70 p-0.5 lg:flex">
            <LangMenu />
            <span aria-hidden className="h-5 w-px bg-line" />
            <ThemeButton />
          </div>
          <ThemeButton className="lg:hidden" />
          <span aria-hidden className="mx-1 hidden h-6 w-px bg-line lg:block" />
          {user ? (
            <Link
              href="/account"
              aria-current={pathname === "/account" ? "page" : undefined}
              className="press group hidden h-[42px] items-center gap-3 rounded-full bg-accent pr-1 pl-5 text-[15px] font-semibold text-accent-ink transition-[filter] hover:brightness-105 lg:flex"
            >
              {t.account}
              <span className="grid size-[34px] place-items-center rounded-full bg-accent-ink text-accent">
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" aria-hidden />
              </span>
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                aria-current={pathname === "/login" ? "page" : undefined}
                className={`press hidden h-[42px] items-center rounded-full px-4 text-[15px] font-medium transition-colors hover:bg-surface-2 lg:flex ${
                  pathname === "/login" ? "bg-surface-2 text-ink" : "text-muted hover:text-ink"
                }`}
              >
                {t.login}
              </Link>
              <Link
                href="/register"
                className="press group hidden h-[42px] items-center gap-3 rounded-full bg-accent pr-1 pl-5 text-[15px] font-semibold text-accent-ink transition-[filter] hover:brightness-105 lg:flex"
              >
                {t.start}
                <span className="grid size-[34px] place-items-center rounded-full bg-accent-ink text-accent">
                  <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" aria-hidden />
                </span>
              </Link>
            </>
          )}
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? t.close : t.open}
            onClick={() => setOpen(!open)}
            className="press grid size-10 place-items-center rounded-full hover:bg-surface-2 lg:hidden"
          >
            {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            aria-label={t.main}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "calc(100svh - 72px)" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease }}
            className="overflow-y-auto bg-bg lg:hidden"
          >
            <div className="frame space-y-8 pt-6 pb-10">
              {nav.map((n, i) =>
                n.children ? (
                  <motion.div key={n.href} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}>
                    <p className="text-small font-semibold text-muted">{n.label[lang]}</p>
                    <ul className="mt-3 grid grid-cols-2 gap-2">
                      {n.children.map((c) => {
                        const Icon = icons[c.icon ?? "game"];
                        return (
                          <li key={c.href}>
                            <a href={c.href} onClick={() => setOpen(false)} className="press flex flex-col gap-3 rounded-2xl border border-line p-4 hover:border-muted">
                              <Icon className="size-5 text-accent-text" aria-hidden />
                              <span className="font-semibold">{c.label[lang]}</span>
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </motion.div>
                ) : (
                  <motion.div key={n.href} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 + i * 0.04 }}>
                    <Link
                      href={n.href}
                      onClick={() => setOpen(false)}
                      aria-current={active === n.href ? "page" : undefined}
                      className={`display flex items-center justify-between text-[2rem] hover:text-accent-text ${active === n.href ? "text-accent-text" : ""}`}
                    >
                      {n.label[lang]}
                      <ArrowRight className="size-5 text-muted" aria-hidden />
                    </Link>
                  </motion.div>
                ),
              )}
              <LangSegment />
              {user ? (
                <Link href="/account" onClick={() => setOpen(false)} className="press mt-2 block rounded-full bg-accent py-3.5 text-center font-semibold text-accent-ink">
                  {t.account}
                </Link>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Link href="/login" onClick={() => setOpen(false)} className="press rounded-full border border-line py-3.5 text-center font-semibold">
                    {t.login}
                  </Link>
                  <Link href="/register" onClick={() => setOpen(false)} className="press rounded-full bg-accent py-3.5 text-center font-semibold text-accent-ink">
                    {t.start}
                  </Link>
                </div>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

const pillClass = (on: boolean) =>
  `press relative isolate flex items-center gap-1 rounded-full px-4 py-1.5 text-[15px] transition-colors ${on ? "text-ink" : "text-muted hover:text-ink"}`;

function ActivePill({ on }: { on: boolean }) {
  if (!on) return null;
  return (
    <motion.span
      layoutId="nav-active"
      transition={{ type: "spring", stiffness: 420, damping: 34 }}
      className="absolute inset-0 -z-10 rounded-full bg-surface-2 shadow-[inset_0_0_0_1px_var(--line)]"
    />
  );
}

function DropdownPanel({ item, lang, onPick }: { item: NavItem; lang: Lang; onPick: () => void }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_24px_60px_-20px_rgba(0,0,0,.6)]">
      <ul className="grid grid-cols-2 gap-1 p-2">
        {item.children!.map((c) => {
          const Icon = icons[c.icon ?? "game"];
          return (
            <li key={c.href}>
              <a href={c.href} onClick={onPick} className="group flex gap-3 rounded-xl p-3 transition-colors hover:bg-surface-2">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-surface-2 text-accent-text transition-colors group-hover:bg-accent group-hover:text-accent-ink">
                  <Icon className="size-4" aria-hidden />
                </span>
                <span>
                  <span className="block text-small font-semibold">{c.label[lang]}</span>
                  <span className="mt-0.5 block text-[13px] leading-snug text-muted">{c.desc?.[lang]}</span>
                </span>
              </a>
            </li>
          );
        })}
      </ul>
      {/* plain <a>, not Link: Next's pushState never fires hashchange, which the catalog filter listens for */}
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a href="/#games" onClick={onPick} className="group flex items-center justify-between border-t border-line bg-bg/40 px-5 py-3.5 text-small hover:bg-surface-2">
        <span className="flex items-center gap-3">
          <span className="flex -space-x-1.5">
            {sample.map((c) =>
              c.logo ? (
                <span key={c.name} className="grid size-6 place-items-center rounded-md border-2 border-surface bg-surface-2 text-ink">
                  <span
                    aria-hidden
                    className="size-3 bg-current"
                    style={{
                      mask: `url(${c.icon}) center / contain no-repeat`,
                      WebkitMask: `url(${c.icon}) center / contain no-repeat`,
                    }}
                  />
                </span>
              ) : (
                <Image key={c.name} src={c.icon} alt="" width={24} height={24} className="size-6 rounded-md border-2 border-surface" />
              ),
            )}
          </span>
          <span className="text-muted group-hover:text-ink">{copy[lang].browse(catalogSize)}</span>
        </span>
        <ArrowRight className="size-4 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-ink" aria-hidden />
      </a>
    </div>
  );
}
