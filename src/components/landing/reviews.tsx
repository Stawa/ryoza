import { Star } from "lucide-react";
import type { Lang } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import { reviews } from "@/lib/site";
import { SectionHead } from "./section-head";

type Review = (typeof reviews)[number];

const copy = {
  id: {
    kicker: "Kata mereka",
    title: "Langsung dari para pemilik server.",
    text: "Komunitas game, pembuat bot, sampai situs kecil, semuanya jalan di Ryoza.",
    sample: "Contoh ulasan untuk tata letak. Ganti dengan ulasan pelanggan asli sebelum launch.",
    stars: (n: number) => `${n} dari 5 bintang`,
  },
  en: {
    kicker: "What people say",
    title: "Server owners, in their own words.",
    text: "Game communities, bot builders and small sites, all running on Ryoza.",
    sample: "Sample reviews for layout. Replace with real customer feedback before launch.",
    stars: (n: number) => `${n} out of 5 stars`,
  },
};

function Card({ r, lang, hidden = false }: { r: Review; lang: Lang; hidden?: boolean }) {
  const logo = r.icon.endsWith(".svg");
  return (
    <li aria-hidden={hidden || undefined} className="flex w-[320px] shrink-0 flex-col rounded-2xl border border-line bg-surface p-6 sm:w-[360px]">
      <p className="flex gap-0.5" role="img" aria-label={copy[lang].stars(r.stars)}>
        {Array.from({ length: 5 }, (_, i) => (
          <Star key={i} className={`size-4 ${i < r.stars ? "fill-accent text-accent" : "fill-line text-line"}`} aria-hidden />
        ))}
      </p>
      <blockquote className="mt-4 flex-1 leading-relaxed">&ldquo;{r.text[lang]}&rdquo;</blockquote>
      <p className="mt-6 flex items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-surface-2">
          {logo ? (
            <span aria-hidden className="size-[18px] bg-current" style={{ mask: `url(${r.icon}) center / contain no-repeat`, WebkitMask: `url(${r.icon}) center / contain no-repeat` }} />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element -- tiny decorative icon, repeated in a marquee
            <img src={r.icon} alt="" width={40} height={40} className="size-full object-cover" />
          )}
        </span>
        <span>
          <span className="block font-semibold">{r.name}</span>
          <span className="block text-small text-muted">{r.hosts[lang]}</span>
        </span>
      </p>
    </li>
  );
}

function Row({ items, lang, reverse = false }: { items: Review[]; lang: Lang; reverse?: boolean }) {
  return (
    <div className="group overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
      <ul className={`${reverse ? "marquee-rev" : "marquee"} flex w-max gap-4 [animation-duration:60s] group-hover:[animation-play-state:paused]`}>
        {items.map((r) => <Card key={r.name} r={r} lang={lang} />)}
        {items.map((r) => <Card key={`${r.name}-2`} r={r} lang={lang} hidden />)}
      </ul>
    </div>
  );
}

export async function Reviews() {
  const lang = await getLang();
  const t = copy[lang];
  const half = Math.ceil(reviews.length / 2);
  return (
    <section id="reviews" aria-labelledby="reviews-title" className="scroll-mt-24 py-24 md:py-32">
      <div className="frame">
        <SectionHead
          id="reviews-title"
          kicker={t.kicker}
          title={t.title}
          text={t.text}
        />
        {/* placeholder: remove this note once the reviews in src/lib/site.ts are real */}
        <p className="mt-6 inline-block rounded-lg border border-dashed border-degraded/60 px-3 py-2 text-small text-degraded">
          {t.sample}
        </p>
      </div>
      <div className="mt-12 space-y-4">
        <Row items={reviews.slice(0, half)} lang={lang} />
        <Row items={reviews.slice(half)} lang={lang} reverse />
      </div>
    </section>
  );
}
