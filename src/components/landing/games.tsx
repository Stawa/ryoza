"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronDown, Globe, Lock, Search, X } from "lucide-react";
import type { Lang } from "@/lib/i18n";
import { catalogFor, links, subdomainRoot, type CatalogItem, type HostKind } from "@/lib/site";
import { useLang } from "../lang";
import { SectionHead } from "./section-head";

const filterIds = ["all", "game", "bot", "web", "db"] as const;
const copy = {
  id: {
    filters: { all: "Semua", game: "Game", bot: "Bot & aplikasi", web: "Website", db: "Database" },
    kind: { game: "Game", bot: "Bot", web: "Website", db: "Database" },
    kicker: "Yang bisa kamu host",
    title: "Utamanya game. Bot, situs, dan database juga bisa.",
    text: "Cari apa saja yang bisa jalan di Ryoza. Tiap layanan sudah punya setup yang disetel, jadi kamu tinggal pilih, sisanya biar kami yang urus.",
    searchLabel: "Cari game, bot, website, dan database",
    searchPlaceholder: "Cari Minecraft, Discord, MySQL…",
    clear: "Hapus pencarian",
    filterLabel: "Saring berdasarkan jenis",
    results: (n: number) => `${n} hasil`,
    none: (q: string) => <>Belum ada yang cocok dengan &ldquo;{q}&rdquo;.</>,
    ask: "Request lewat Discord",
    askRest: ", game baru kami tambahkan sesuai permintaan.",
    showAll: (n: number) => `Tampilkan semua ${n}`,
    subTitle: "Alamat gratis buat setiap situs dan bot.",
    subText: (root: string) => `Langsung online di subdomain ${root} begitu deploy, atau pakai domain yang sudah kamu punya. SSL sudah termasuk.`,
    subTry: "Coba nama subdomain",
    free: "Gratis",
    yourDomain: "Domainmu",
    subHint: "Ketik nama di atas buat coba. Boleh huruf, angka, dan tanda hubung.",
    trademark: "Nama dan gambar game adalah merek dagang milik pemiliknya masing-masing.",
  },
  en: {
    filters: { all: "All", game: "Games", bot: "Bots & apps", web: "Websites", db: "Databases" },
    kind: { game: "Game", bot: "Bot", web: "Website", db: "Database" },
    kicker: "What you can host",
    title: "Games first. Bots, sites and databases too.",
    text: "Search everything that runs on Ryoza. Each one comes with its own tuned setup, so you pick it and we handle the rest.",
    searchLabel: "Search games, bots, websites and databases",
    searchPlaceholder: "Search Minecraft, Discord, MySQL…",
    clear: "Clear search",
    filterLabel: "Filter by type",
    results: (n: number) => `${n} results`,
    none: (q: string) => <>Nothing matches &ldquo;{q}&rdquo; yet.</>,
    ask: "Ask us on Discord",
    askRest: ", new games are added as people ask for them.",
    showAll: (n: number) => `Show all ${n}`,
    subTitle: "A free address for every site and bot.",
    subText: (root: string) => `Go live on a ${root} subdomain the moment you deploy, or point a domain you already own. SSL is included either way.`,
    subTry: "Try a subdomain name",
    free: "Free",
    yourDomain: "Your domain",
    subHint: "Type above to try a name. Letters, numbers and dashes.",
    trademark: "Game names and artwork are trademarks of their respective owners.",
  },
};

export function Games() {
  const lang = useLang();
  const t = copy[lang];
  const catalog = catalogFor(lang);
  const [kind, setKind] = useState<HostKind | "all">("all");
  const [q, setQ] = useState("");
  const [sub, setSub] = useState("");
  const [all, setAll] = useState(false);

  // "/#host-bot" and friends open that filter, "/#games" shows all (links from the navbar and footer)
  useEffect(() => {
    const sync = () => {
      const hash = window.location.hash;
      if (hash === "#games") return setKind("all");
      const id = hash.replace("#host-", "");
      if (filterIds.some((f) => f === id)) setKind(id as HostKind);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const term = q.trim().toLowerCase();
  const shown = catalog.filter(
    (c) => (kind === "all" || c.kind === kind) && (!term || `${c.name} ${c.detail[lang]} ${t.kind[c.kind]}`.toLowerCase().includes(term)),
  );
  // the full list is long: start with the first rows unless the visitor is searching or filtering
  const cut = !all && !term && kind === "all" && shown.length > 12;
  const visible = cut ? shown.slice(0, 12) : shown;

  return (
    <section id="games" aria-labelledby="games-title" className="frame scroll-mt-24 py-24 md:py-32">
      {(["game", "bot", "web", "db"] as const).map((k) => (
        <span key={k} id={`host-${k}`} className="block scroll-mt-24" aria-hidden />
      ))}
      <SectionHead
        id="games-title"
        kicker={t.kicker}
        title={t.title}
        text={t.text}
      />

      <div className="mt-12 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <label className="relative block lg:w-[380px]">
          <span className="sr-only">{t.searchLabel}</span>
          <Search className="pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-muted" aria-hidden />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="h-12 w-full rounded-full border border-line bg-surface pr-11 pl-11 outline-none placeholder:text-muted focus:border-accent [&::-webkit-search-cancel-button]:hidden"
          />
          {q && (
            <button type="button" onClick={() => setQ("")} aria-label={t.clear} className="absolute top-1/2 right-2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-muted hover:bg-surface-2 hover:text-ink">
              <X className="size-4" aria-hidden />
            </button>
          )}
        </label>

        <div role="group" aria-label={t.filterLabel} className="-mx-[var(--m)] flex gap-1.5 overflow-x-auto px-[var(--m)] lg:mx-0 lg:px-0">
          {filterIds.map((f) => {
            const n = f === "all" ? catalog.length : catalog.filter((c) => c.kind === f).length;
            const on = kind === f;
            return (
              <button
                key={f}
                type="button"
                aria-pressed={on}
                onClick={() => {
                  setKind(f);
                  // keep the hash in step, so the navbar link for this filter (or another) fires hashchange next time
                  history.replaceState(history.state, "", f === "all" ? "#games" : `#host-${f}`);
                }}
                className={`press flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-small font-semibold transition-colors ${
                  on ? "border-accent bg-accent text-accent-ink" : "border-line text-muted hover:border-muted hover:text-ink"
                }`}
              >
                {t.filters[f]}
                <span className={`tabular-nums ${on ? "opacity-70" : "opacity-60"}`}>{n}</span>
              </button>
            );
          })}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">{t.results(shown.length)}</p>
      {shown.length ? (
        <ul className="mt-8 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((c) => <Row key={c.name} c={c} lang={lang} />)}
        </ul>
      ) : (
        <p className="mt-8 border-t border-line pt-10 text-muted">
          {t.none(q)}{" "}
          <a href={links.discord} className="font-semibold text-ink underline decoration-line underline-offset-4 hover:decoration-accent">{t.ask}</a>{t.askRest}
        </p>
      )}

      {cut && (
        <button type="button" onClick={() => setAll(true)} className="press mt-6 flex items-center gap-2 rounded-full border border-line px-5 py-2.5 font-semibold hover:border-muted">
          {t.showAll(shown.length)}
          <ChevronDown className="size-4" aria-hidden />
        </button>
      )}

      {/* free subdomain: type a name and watch the address change */}
      <div className="mt-16 grid gap-10 border-t border-line pt-12 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-5">
          <h3 className="display text-head leading-tight">{t.subTitle}</h3>
          <p className="mt-4 max-w-[40ch] text-muted">{t.subText(subdomainRoot)}</p>
        </div>

        <div className="space-y-3 lg:col-span-7">
          <label className="flex h-16 items-center gap-3 rounded-full border border-line bg-surface pr-3 pl-5 transition-colors focus-within:border-accent">
            <Lock className="size-4 shrink-0 text-up" aria-hidden />
            <span className="flex min-w-0 flex-1 items-baseline overflow-hidden text-lead">
              <span className="hidden text-muted sm:inline">https://</span>
              <span className="sr-only">{t.subTry}</span>
              <input
                value={sub}
                onChange={(e) => setSub(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 32))}
                placeholder="yourname"
                size={Math.max(sub.length, 8)}
                className="min-w-0 bg-transparent font-semibold text-accent-text outline-none [field-sizing:content] placeholder:text-accent-text/50"
              />
              <span className="truncate">.{subdomainRoot}</span>
            </span>
            <span className="shrink-0 rounded-full bg-accent px-3 py-1.5 text-small font-semibold text-accent-ink">{t.free}</span>
          </label>
          <div className="flex h-16 items-center gap-3 rounded-full border border-dashed border-line pr-3 pl-5 text-muted">
            <Globe className="size-4 shrink-0" aria-hidden />
            <span className="min-w-0 flex-1 truncate text-lead">
              <span className="hidden sm:inline">https://</span>yourclan.com
            </span>
            <span className="shrink-0 rounded-full border border-line px-3 py-1.5 text-small font-semibold">{t.yourDomain}</span>
          </div>
          <p className="pl-5 text-small text-muted">{t.subHint}</p>
        </div>
      </div>

      <p className="mt-8 text-small text-muted">{t.trademark}</p>
    </section>
  );
}

function Row({ c, lang }: { c: CatalogItem; lang: Lang }) {
  return (
    <li className="flex items-center gap-4 border-t border-line py-4">
      {c.logo ? (
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-surface-2 text-ink">
          <span aria-hidden className="size-5 bg-current" style={{ mask: `url(${c.icon}) center / contain no-repeat`, WebkitMask: `url(${c.icon}) center / contain no-repeat` }} />
        </span>
      ) : (
        <Image src={c.icon} alt="" width={44} height={44} className="size-11 shrink-0 rounded-xl object-cover" />
      )}
      <span className="min-w-0 flex-1">
        <span className="block truncate font-semibold">{c.name}</span>
        <span className="block truncate text-small text-muted">{c.detail[lang]}</span>
      </span>
      <span className="shrink-0 rounded-full border border-line px-2.5 py-0.5 text-[12px] text-muted">{copy[lang].kind[c.kind]}</span>
    </li>
  );
}
