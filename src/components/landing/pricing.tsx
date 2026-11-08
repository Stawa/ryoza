"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Bot, Check, Database, Gamepad2, Globe } from "lucide-react";
import { planCategories } from "@/lib/site";
import { useLang } from "../lang";
import { PaymentLogos } from "../payment-logos";
import { SectionHead } from "./section-head";

const copy = {
  id: {
    pageTitle: "Paket yang simpel.",
    pageText: "Fokus di server game, plus bot, website, dan database. Upgrade kapan saja tanpa kehilangan world-mu.",
    kicker: "Harga",
    title: "Paket simpel. Upgrade kapan pun komunitasmu makin ramai.",
    text: "Semua paket game dapat proteksi, backup, dan panel yang sama. Tambah website atau database kalau komunitasmu butuh.",
    product: "Produk",
    popular: "Paling laris",
    month: "/ bulan",
    choose: (name: string) => `Pilih ${name}`,
    payTitle: "Bayar pakai cara yang biasa kamu pakai.",
    payText: "QRIS, virtual account, e-wallet, sampai kripto. Semua terkonfirmasi otomatis. ShopeePay dan LinkAja juga bisa.",
  },
  en: {
    pageTitle: "Simple plans.",
    pageText: "Game servers first, with bots, websites and databases alongside. Upgrade any time without losing your world.",
    kicker: "Pricing",
    title: "Simple plans. Upgrade whenever your world grows.",
    text: "Every game plan includes the same protection, backups and panel. Add a website or database when your community needs one.",
    product: "Product",
    popular: "Most popular",
    month: "/ month",
    choose: (name: string) => `Choose ${name}`,
    payTitle: "Pay the way you already pay.",
    payText: "QRIS, virtual accounts, e-wallets and crypto, all confirmed automatically. ShopeePay and LinkAja work too.",
  },
};

/** A visibly marked slot for a value that has not been decided yet. */
function Ph({ children }: { children: React.ReactNode }) {
  return (
    <span title="Placeholder: set the real value in src/lib/site.ts" className="rounded-md border border-dashed border-muted/60 px-1.5 py-0.5 text-muted">
      {children}
    </span>
  );
}

const icons = { game: Gamepad2, bot: Bot, web: Globe, db: Database };

export function Pricing({ asPage = false }: { asPage?: boolean }) {
  const [cat, setCat] = useState<(typeof planCategories)[number]["id"]>("game");
  const c = planCategories.find((x) => x.id === cat)!;
  const lang = useLang();
  const t = copy[lang];

  // "/#pricing-web" or "/#pricing-db" opens that tab
  useEffect(() => {
    const sync = () => {
      const id = window.location.hash.replace("#pricing-", "");
      const match = planCategories.find((x) => x.id === id);
      if (match) setCat(match.id);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  return (
    <section id="pricing" aria-labelledby="pricing-title" className="frame scroll-mt-24 py-24 md:py-32">
      {asPage ? (
        <div className="rise max-w-3xl">
          <h1 id="pricing-title" className="display text-display">{t.pageTitle}</h1>
          <p className="mt-6 text-lead leading-snug text-muted">{t.pageText}</p>
        </div>
      ) : (
        <SectionHead
          id="pricing-title"
          kicker={t.kicker}
          title={t.title}
          text={t.text}
        />
      )}

      <span id="pricing-web" className="block scroll-mt-24" aria-hidden />
      <span id="pricing-bot" className="block scroll-mt-24" aria-hidden />
      <span id="pricing-db" className="block scroll-mt-24" aria-hidden />
      <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
        <div role="tablist" aria-label={t.product} className="inline-flex flex-wrap gap-1 rounded-full border border-line bg-surface p-1">
          {planCategories.map((x) => {
            const Icon = icons[x.id];
            return (
              <button
                key={x.id}
                type="button"
                role="tab"
                aria-selected={cat === x.id}
                aria-controls="plans-panel"
                onClick={() => setCat(x.id)}
                className={`press flex items-center gap-2 rounded-full px-4 py-2.5 text-small font-semibold ${cat === x.id ? "bg-accent text-accent-ink" : "text-muted hover:text-ink"}`}
              >
                <Icon className="size-4" aria-hidden />
                {x.label[lang]}
              </button>
            );
          })}
        </div>
      </div>

      <div id="plans-panel" role="tabpanel" aria-label={c.label[lang]} className="mt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
            className="grid gap-4 md:grid-cols-3"
          >
            {c.plans.map((p) => (
              <article
                key={p.name}
                className={`relative flex flex-col rounded-2xl border p-6 md:p-7 ${p.popular ? "border-accent bg-surface shadow-[0_0_0_1px_var(--accent)]" : "card"}`}
              >
                {p.popular && (
                  <span className="absolute -top-3 left-6 rounded-full bg-accent px-3 py-1 text-[12px] font-semibold text-accent-ink">{t.popular}</span>
                )}
                <h3 className="text-lead font-semibold">{p.name}</h3>
                <p className="mt-1 text-small text-muted">{p.for[lang]}</p>
                <p className="mt-6 flex items-baseline gap-2">
                  <span className="display text-head"><Ph>Rp —</Ph></span>
                  <span className="text-small text-muted">{t.month}</span>
                </p>

                <dl className="mt-6 space-y-3 border-y border-line py-5">
                  {c.specs.map((label) => (
                    <div key={label.en} className="flex items-center justify-between gap-4 text-small">
                      <dt className="text-muted">{label[lang]}</dt>
                      <dd><Ph>TBD</Ph></dd>
                    </div>
                  ))}
                </dl>

                <ul className="mt-5 flex-1 space-y-2.5 text-small">
                  {c.includes.map((f) => (
                    <li key={f.en} className="flex items-center gap-2.5">
                      <Check className="size-4 shrink-0 text-accent-text" aria-hidden />
                      {f[lang]}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/register"
                  className={`press mt-7 rounded-full py-3 text-center font-semibold ${p.popular ? "bg-accent text-accent-ink hover:brightness-95" : "border border-line hover:border-muted"}`}
                >
                  {t.choose(p.name)}
                </Link>
              </article>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="reveal mt-16 border-y border-line">
        <div className="flex flex-wrap items-end justify-between gap-3 pt-8">
          <h3 className="display text-[clamp(1.5rem,1.1rem+1.6vw,2.25rem)]">{t.payTitle}</h3>
          <p className="max-w-[44ch] text-small text-muted">{t.payText}</p>
        </div>
        <div className="py-6 md:py-8">
          <PaymentLogos />
        </div>
      </div>
    </section>
  );
}
