import { getLang } from "@/lib/i18n-server";
import { locations } from "@/lib/site";
import { SectionHead } from "./section-head";

const copy = {
  id: {
    kicker: "Lokasi",
    title: "Pilih server yang dekat dengan pemainmu.",
    text: "Makin jauh, makin lag. Pilih region terdekat dengan komunitasmu, biar setiap hit, lompatan, dan blok terasa pas.",
    latency: "Latensi",
    latencyValue: "Diumumkan saat rilis",
    status: "Status",
    statusValue: "Contoh region",
    ask: "Butuh lokasi lain?",
    askLink: "Kasih tahu kami pemainmu ada di mana.",
    subject: "Permintaan%20region",
  },
  en: {
    kicker: "Locations",
    title: "Host close to your players.",
    text: "Distance is lag. Pick the region nearest your community and every hit, jump and block lands when it should.",
    latency: "Latency",
    latencyValue: "Published at launch",
    status: "Status",
    statusValue: "Example region",
    ask: "Need somewhere else?",
    askLink: "Tell us where your players are.",
    subject: "Region%20request",
  },
};

export async function Locations() {
  const lang = await getLang();
  const t = copy[lang];
  return (
    <section id="locations" aria-labelledby="locations-title" className="frame scroll-mt-24 py-24 md:py-32">
      <SectionHead id="locations-title" kicker={t.kicker} title={t.title} text={t.text} />

      <ul className="reveal mt-14 grid border-t border-line sm:grid-cols-3">
        {locations.map((loc) => (
          <li key={loc.code} className="group border-b border-line py-8 sm:border-b-0 sm:px-8 sm:first:pl-0 sm:not-first:border-l">
            <p className="flex items-center gap-2 text-small font-semibold text-muted">
              <span className="relative flex size-2">
                <span className="motion-only absolute inset-0 animate-ping rounded-full bg-accent/60" />
                <span className="relative size-2 rounded-full bg-accent" />
              </span>
              {loc.code}
            </p>
            <h3 className="display mt-5 text-head transition-colors group-hover:text-accent-text">{loc.city}</h3>
            <p className="mt-1 text-muted">{loc.country[lang]}</p>
            <dl className="mt-8 grid grid-cols-2 gap-4 text-small">
              <div>
                <dt className="text-muted">{t.latency}</dt>
                <dd className="mt-0.5 font-semibold">{t.latencyValue}</dd>
              </div>
              <div>
                <dt className="text-muted">{t.status}</dt>
                <dd className="mt-0.5 font-semibold">{t.statusValue}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-small text-muted">
        {t.ask} <a href={`mailto:support@ryoza.id?subject=${t.subject}`} className="font-semibold text-ink underline underline-offset-4 hover:text-accent-text">{t.askLink}</a>
      </p>
    </section>
  );
}
