"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, LayoutGrid, Database, ShieldCheck, Wifi } from "lucide-react";
import { useLang } from "../lang";

const ease = [0.2, 0.7, 0, 1] as const;

// The headline is "<pre><word>." over "<last>.": English puts "Your" first, Indonesian puts "Kamu" after the word.
const copy = {
  id: {
    badge: "Fokus di server game. Bot, website, dan database juga bisa.",
    srTitle: "Game kamu, bot kamu, website kamu, database kamu. Server kamu.",
    pre: "",
    words: ["Game Kamu", "Bot Kamu", "Website Kamu", "Database Kamu"],
    last: "Server Kamu.",
    lead: "Hosting server game yang tangguh buat komunitas, kreator, dan tongkronganmu. Bikin server, ajak teman, langsung main. Butuh bot, website, atau database? Taruh sekalian di sini.",
    plans: "Lihat Paket",
    browse: "Cek Semua Layanan",
    stage: "Ilustrasi: satu node server Ryoza yang terhubung ke empat server game",
    strip: ["Terlindungi dari DDoS", "Ping rendah", "Bot, situs & database juga"],
    online: "Online",
    memory: "RAM",
    saving: "Menyimpan world…",
    saved: "Backup selesai",
  },
  en: {
    badge: "Game servers first. Bots, websites and databases too.",
    srTitle: "Your game, your website, your database. Your server.",
    pre: "Your ",
    words: ["Game", "Bot", "Website", "Database"],
    last: "Your Server.",
    lead: "Powerful game server hosting built for communities, creators, and friends. Launch your server, invite your people, and start playing. Need a bot, website or database for it? Host them right alongside.",
    plans: "Explore Plans",
    browse: "See What You Can Host",
    stage: "Illustration: one Ryoza server node connected to four game servers",
    strip: ["DDoS filtered", "Low-latency routes", "Bots, sites & databases too"],
    online: "Online",
    memory: "Memory",
    saving: "Saving world…",
    saved: "Backup complete",
  },
};
type Copy = (typeof copy)["en"];

// Widgets orbiting the node. Positions are % of the stage; values are illustrative UI, not metrics.
const widgets = [
  { side: "left", x: 4, y: 8, w: "w-[230px]", delay: 0.5, hideSm: false },
  { side: "right", x: 4, y: 6, w: "w-[220px]", delay: 0.65, hideSm: false },
  { side: "left", x: 3, y: 66, w: "w-[210px]", delay: 0.8, hideSm: true },
  { side: "right", x: 3, y: 62, w: "w-[230px]", delay: 0.95, hideSm: true },
];

export function Hero() {
  const reduce = useReducedMotion();
  const t = copy[useLang()];
  const up = (d: number) => ({
    initial: reduce ? false : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay: d, ease },
  });

  return (
    <section className="relative overflow-hidden pb-16 md:pb-24">
      <div aria-hidden className="dot-grid drift-bg pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_50%_40%,black,transparent_75%)]" />

      <div className="frame relative grid gap-10 pt-10 md:pt-16 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <motion.p {...up(0)} className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-small text-muted">
            <span className="relative flex size-2">
              <span className="blink absolute inset-0 rounded-full bg-up" />
              <span className="relative size-2 rounded-full bg-up" />
            </span>
            {t.badge}
          </motion.p>
          <motion.h1 {...up(0.08)} className="display text-display">
            <span className="sr-only">{t.srTitle}</span>
            <span aria-hidden className="block">
              {t.pre}
              <RotatingWord words={t.words} />
            </span>
            <span aria-hidden className="block text-accent-text">{t.last}</span>
          </motion.h1>
        </div>
        <div className="lg:col-span-5 lg:pb-3">
          <motion.p {...up(0.18)} className="max-w-[44ch] text-lead leading-snug text-muted">
            {t.lead}
          </motion.p>
          <motion.div {...up(0.26)} className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/#pricing"
              className="press group flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 font-semibold text-accent-ink hover:brightness-95"
            >
              {t.plans}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
            <Link href="/#games" className="press flex items-center gap-2 rounded-full border border-line bg-surface px-6 py-3.5 font-semibold hover:border-muted">
              <LayoutGrid className="size-4" aria-hidden />
              {t.browse}
            </Link>
          </motion.div>
        </div>
      </div>

      {/* the stage: one node, its connections, and the worlds it runs */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.3, ease }}
        className="frame relative mt-12 md:mt-16"
      >
        <div className="relative h-[420px] overflow-hidden sm:h-[460px] lg:h-[520px]" role="img" aria-label={t.stage}>

          {/* connection lines */}
          <svg aria-hidden className="absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {[
              "M50 52 C 35 40, 25 30, 16 22",
              "M50 52 C 62 38, 74 26, 84 16",
              "M50 52 C 36 62, 24 70, 14 76",
              "M50 52 C 64 64, 76 70, 86 72",
            ].map((d, i) => (
              <g key={d} className={i > 1 ? "hidden sm:inline" : ""}>
                <path d={d} fill="none" stroke="var(--line)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                <path d={d} fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="2 10" vectorEffect="non-scaling-stroke" className="flow" style={{ animationDelay: `${i * -0.4}s` }} />
              </g>
            ))}
          </svg>

          {/* node */}
          <div className="absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="float">
              <ServerNode />
            </div>
          </div>

          {widgets.map((w, i) => (
            <motion.div
              key={i}
              initial={reduce ? false : { opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: w.delay, ease }}
              className={`absolute ${w.hideSm ? "hidden sm:block" : ""}`}
              style={{ [w.side]: `${w.x}%`, top: `${w.y}%` }}
            >
              <div className={`${w.w} float max-w-[42vw]`} style={{ animationDelay: `${i * -1.5}s` }}>
                <Widget i={i} t={t} />
              </div>
            </motion.div>
          ))}

          {/* strip of what the node gives every server */}
          <div className="absolute inset-x-3 bottom-3 hidden justify-center gap-2 md:flex">
            {[ShieldCheck, Wifi, Database].map((I, k) => (
              <span key={k} className="flex items-center gap-2 rounded-full border border-line bg-bg/80 px-3 py-1.5 text-small text-muted backdrop-blur">
                <I className="size-3.5 text-accent-text" aria-hidden />
                {t.strip[k]}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function Widget({ i, t }: { i: number; t: Copy }) {
  const base = "card rounded-xl p-3.5 text-[13px]";
  if (i === 0)
    return (
      <div className={base}>
        <div className="flex items-center justify-between">
          <span className="font-semibold">Survival SMP</span>
          <Online label={t.online} />
        </div>
        <p className="mt-0.5 text-muted">Minecraft · Paper</p>
        <div className="mt-3 flex items-center gap-1.5">
          {["#FF4B2B", "#7cc4ff", "#f5b84b", "#ff8fb1", "#a0a0a6"].map((c, k) => (
            <span key={c} className={`size-5 rounded-md border-2 border-surface ${k > 2 ? "max-sm:hidden" : ""}`} style={{ background: c }} aria-hidden />
          ))}
          <span className="ml-auto whitespace-nowrap text-muted tabular-nums">14 / 20</span>
        </div>
      </div>
    );
  if (i === 1)
    return (
      <div className={base}>
        <div className="flex items-center justify-between">
          <span className="font-semibold">Clan realm</span>
          <Online label={t.online} />
        </div>
        <p className="mt-0.5 text-muted">Valheim · BepInEx</p>
        <div className="mt-3">
          <div className="flex justify-between text-muted"><span>{t.memory}</span><span className="tabular-nums">62%</span></div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-2"><div className="h-full w-[62%] rounded-full bg-accent" /></div>
        </div>
      </div>
    );
  if (i === 2)
    return (
      <div className={`${base} font-mono text-[12px]`}>
        <p className="text-muted">[19:42:08] {t.saving}</p>
        <p className="text-up">[19:42:09] {t.saved}</p>
      </div>
    );
  return (
    <div className={base}>
      <div className="flex items-center justify-between">
        <span className="font-semibold">Retakes #2</span>
        <Online label={t.online} />
      </div>
      <p className="mt-0.5 text-muted">Counter-Strike 2 · 128 tick</p>
      <div className="mt-3 flex items-end gap-0.5" aria-hidden>
        {[5, 8, 6, 9, 7, 10, 8, 9, 11, 9, 10, 12].map((h, k) => (
          <span key={k} className="w-2 rounded-sm bg-accent/70" style={{ height: h * 2 }} />
        ))}
      </div>
    </div>
  );
}

function Online({ label }: { label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-[12px] text-up">
      <span className="blink size-1.5 rounded-full bg-up" aria-hidden />
      {label}
    </span>
  );
}

/* An isometric stack of three server blades with blinking LEDs. */
function ServerNode() {
  const slab = (y: number, k: number) => (
    <g key={k} transform={`translate(0 ${y})`}>
      <polygon points="100,20 180,60 100,100 20,60" fill="var(--surface-2)" stroke="var(--line)" />
      <polygon points="20,60 100,100 100,124 20,84" fill="var(--surface)" stroke="var(--line)" />
      <polygon points="100,100 180,60 180,84 100,124" fill="var(--bg)" stroke="var(--line)" />
      {[0, 1, 2].map((d) => (
        <circle key={d} cx={116 + d * 14} cy={98 - d * 7} r="2.6" fill="var(--accent)" className="blink" style={{ animationDelay: `${(k * 3 + d) * 0.37}s` }} />
      ))}
      {[0, 1, 2, 3].map((d) => (
        <line key={d} x1={30 + d * 16} y1={73 + d * 8} x2={30 + d * 16} y2={85 + d * 8} stroke="var(--line)" strokeWidth="2" />
      ))}
    </g>
  );
  return (
    <svg viewBox="0 0 200 230" className="w-[150px] drop-shadow-[0_30px_40px_rgba(0,0,0,.45)] sm:w-[190px] lg:w-[220px]" aria-hidden>
      <ellipse cx="100" cy="205" rx="80" ry="18" fill="var(--accent)" opacity="0.12" />
      {[72, 36, 0].map((y, k) => slab(y, k))}
    </svg>
  );
}

/* Cycles through what Ryoza hosts. Holds the first word when motion is reduced. */
function RotatingWord({ words }: { words: string[] }) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setI((n) => (n + 1) % words.length), 2400);
    return () => clearInterval(id);
  }, [reduce, words.length]);

  return (
    <span className="relative inline-flex overflow-hidden align-bottom">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={words[i]}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.2, 0.7, 0, 1] }}
          className="inline-block"
        >
          {words[i]}.
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
