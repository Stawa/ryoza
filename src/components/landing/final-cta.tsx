import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { getLang } from "@/lib/i18n-server";
import { RMark } from "../logo";

const copy = {
  id: { title: "Siap bikin world barumu?", text: "Komunitasmu sudah menunggu. Nyalakan server dan mulai main.", start: "Mulai Sekarang", docs: "Baca Dokumentasi" },
  en: { title: "Ready to build your next world?", text: "Your community is waiting. Get your server online and start playing.", start: "Get Started", docs: "Read the docs" },
};

export async function FinalCta() {
  const t = copy[await getLang()];
  return (
    <section aria-labelledby="cta-title" className="frame pb-24 md:pb-32">
      <div className="reveal relative overflow-hidden rounded-[28px] bg-accent px-6 py-16 text-accent-ink sm:px-12 md:py-24">
        <div aria-hidden className="drift-bg absolute inset-0 opacity-25 [background-image:radial-gradient(#0c0c0d_1px,transparent_1.2px)] [background-size:22px_22px]" />
        {/* the logo mark at poster size */}
        <RMark className="absolute -right-12 -bottom-16 w-[280px] text-[#0b0c10] opacity-90 md:w-[400px]" />
        <div className="relative max-w-2xl">
          <h2 id="cta-title" className="display text-head">{t.title}</h2>
          <p className="mt-5 max-w-[42ch] text-lead leading-snug">{t.text}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/register" className="press group flex items-center gap-2 rounded-full bg-[#0b0c10] px-6 py-3.5 font-semibold text-[#f2f0ea] hover:bg-[#26262a]">
              {t.start}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
            <Link href="/docs" className="press flex items-center gap-2 rounded-full border border-[#0c0c0d]/30 px-6 py-3.5 font-semibold hover:border-[#0c0c0d]">
              <BookOpen className="size-4" aria-hidden />
              {t.docs}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
