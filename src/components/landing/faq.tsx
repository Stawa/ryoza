"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { gameFaqs } from "@/lib/site";
import { useLang } from "../lang";

const copy = {
  id: { title: "Ada pertanyaan? Ini jawabannya.", stuck: "Masih bingung?", email: "Email support", reply: ", nanti tim kami yang balas." },
  en: { title: "Questions, answered.", stuck: "Still stuck?", email: "Email support", reply: " and a person will reply." },
};

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();
  const lang = useLang();
  const t = copy[lang];

  return (
    <section id="faq" aria-labelledby="faq-title" className="frame scroll-mt-24 py-24 md:py-32">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="reveal lg:col-span-4">
          <p className="mb-4 text-small font-semibold text-accent-text">FAQ</p>
          <h2 id="faq-title" className="display text-head">{t.title}</h2>
          <p className="mt-5 max-w-[34ch] text-muted">
            {t.stuck} <a href="mailto:support@ryoza.id" className="font-semibold text-ink underline underline-offset-4 hover:text-accent-text">{t.email}</a>{t.reply}
          </p>
        </div>

        <ul className="reveal divide-y divide-line border-y border-line lg:col-span-8">
          {gameFaqs[lang].map(([q, a], i) => {
            const isOpen = open === i;
            return (
              <li key={q}>
                <h3>
                  <button
                    type="button"
                    id={`${base}-q${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`${base}-a${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="group flex w-full items-center justify-between gap-6 py-5 text-left text-lead font-semibold hover:text-accent-text"
                  >
                    {q}
                    <span className={`grid size-8 shrink-0 place-items-center rounded-full border border-line transition-transform duration-300 ${isOpen ? "rotate-45 bg-accent text-accent-ink" : ""}`}>
                      <Plus className="size-4" aria-hidden />
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`${base}-a${i}`}
                      role="region"
                      aria-labelledby={`${base}-q${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.2, 0.7, 0, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-[62ch] pb-6 text-muted">{a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
