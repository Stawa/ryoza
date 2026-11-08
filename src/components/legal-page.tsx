import Link from "next/link";
import { getLang } from "@/lib/i18n-server";

const copy = {
  id: { updated: "Terakhir diperbarui", onPage: "Di halaman ini", questions: "Ada pertanyaan?", seeAlso: ["Lihat juga ", "Ketentuan Layanan", " dan ", "Kebijakan Privasi", " kami."] },
  en: { updated: "Last updated", onPage: "On this page", questions: "Questions?", seeAlso: ["See also our ", "Terms of Service", " and ", "Privacy Policy", "."] },
};

export type LegalSection = { id: string; title: string; body: React.ReactNode };

export async function LegalPage({ title, intro, updated, sections }: { title: string; intro: string; updated: string; sections: LegalSection[] }) {
  const t = copy[await getLang()];
  return (
    <div className="frame grid gap-12 py-12 md:py-20 lg:grid-cols-12">
      <header className="rise lg:col-span-12">
        <p className="text-small text-muted">{t.updated} {updated}</p>
        <h1 className="display mt-3 text-display">{title}</h1>
        <p className="mt-6 max-w-[60ch] text-lead leading-snug text-muted">{intro}</p>
      </header>

      <nav aria-label={t.onPage} className="lg:col-span-3">
        <div className="lg:sticky lg:top-24">
          <p className="text-small font-semibold">{t.onPage}</p>
          <ol className="mt-4 space-y-2 border-l border-line text-small">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="-ml-px block border-l border-transparent pl-4 text-muted transition-colors hover:border-accent hover:text-ink">
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-small text-muted">
            {t.questions} <a href="mailto:legal@ryoza.id" className="text-ink underline underline-offset-4 hover:text-accent-text">legal@ryoza.id</a>
          </p>
        </div>
      </nav>

      <article className="space-y-12 lg:col-span-8 lg:col-start-5">
        {sections.map((s, i) => (
          <section key={s.id} id={s.id} className="scroll-mt-28">
            <h2 className="flex gap-3 text-lead font-semibold">
              <span className="text-muted tabular-nums">{i + 1}.</span>
              {s.title}
            </h2>
            <div className="mt-4 space-y-4 text-muted [&_a]:text-ink [&_a]:underline [&_a]:underline-offset-4 [&_li]:pl-1 [&_strong]:text-ink [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
              {s.body}
            </div>
          </section>
        ))}
        <p className="border-t border-line pt-8 text-small text-muted">
          {t.seeAlso[0]}
          <Link href="/terms" className="text-ink underline underline-offset-4">{t.seeAlso[1]}</Link>
          {t.seeAlso[2]}
          <Link href="/privacy" className="text-ink underline underline-offset-4">{t.seeAlso[3]}</Link>
          {t.seeAlso[4]}
        </p>
      </article>
    </div>
  );
}
