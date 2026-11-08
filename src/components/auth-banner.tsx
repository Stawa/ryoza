"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { games } from "@/lib/site";
import { useLang } from "./lang";
import { RMark } from "./logo";

const ease = [0.2, 0.7, 0, 1] as const;

const copy = {
  id: {
    login: { title: "Selamat datang lagi di world-mu.", text: "Tenang, servermu tetap jalan selama kamu pergi." },
    register: { title: "Mulai world-mu hari ini.", text: "Fokus di server game, plus website dan database." },
    more: "dan masih banyak game lainnya",
  },
  en: {
    login: { title: "Welcome back to your worlds.", text: "Your servers kept running while you were away." },
    register: { title: "Start your world today.", text: "Game servers first, with websites and databases alongside." },
    more: "and more games coming",
  },
};

// Decorative panel beside the auth form; hidden from assistive tech.
export function AuthBanner({ mode }: { mode: "login" | "register" }) {
  const reduce = useReducedMotion();
  const enter = (i: number) => ({
    initial: reduce ? false : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay: 0.1 + i * 0.1, ease },
  });
  const t = copy[useLang()];
  const c = t[mode];

  return (
    <aside
      aria-hidden
      className="relative hidden overflow-hidden rounded-[28px] bg-accent p-12 text-accent-ink lg:flex lg:flex-col lg:justify-between"
    >
      <RMark className="absolute -right-10 -bottom-15 w-[460px] text-[#0b0c10] opacity-[.07]" />

      <motion.span
        {...enter(0)}
        className="relative grid size-12 place-items-center rounded-2xl bg-[#0b0c10]"
      >
        <RMark className="size-6 text-accent" />
      </motion.span>

      <div className="relative">
        <motion.p
          {...enter(1)}
          className="display max-w-[11ch] text-[clamp(2.5rem,1.5rem+2.4vw,4rem)]"
        >
          {c.title}
        </motion.p>
        <motion.p
          {...enter(2)}
          className="mt-5 max-w-[34ch] text-lead leading-snug opacity-80"
        >
          {c.text}
        </motion.p>
      </div>

      <motion.div {...enter(4)} className="relative flex items-center gap-4">
        <div className="flex -space-x-2">
          {games.map((g) => (
            <Image
              key={g.slug}
              src={g.icon}
              alt=""
              width={40}
              height={40}
              className="size-10 rounded-xl border-2 border-accent"
            />
          ))}
        </div>
        <p className="text-small font-semibold opacity-80">
          {t.more}
        </p>
      </motion.div>
    </aside>
  );
}
