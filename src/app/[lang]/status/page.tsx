import type { Metadata } from "next";
import type { Lang } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import {
  announcements,
  services,
  type Announcement,
  type Status,
} from "@/lib/status";

const DAYS = 90;

const copy = {
  id: {
    title: "Status sistem",
    label: { up: "Normal", degraded: "Melambat", down: "Gangguan", maintenance: "Pemeliharaan" } as Record<Status, string>,
    state: { investigating: "Sedang dicek", identified: "Penyebab ditemukan", monitoring: "Dipantau", scheduled: "Terjadwal", resolved: "Selesai" } as Record<Announcement["state"], string>,
    notices: "Pengumuman",
    services: "Layanan",
    uptimeOver: `Uptime ${DAYS} hari terakhir`,
    uptimeAria: (name: string, uptime: string) => `${name}: uptime ${uptime} selama ${DAYS} hari`,
    day: (n: number) => (n === 0 ? "Hari ini" : `${n} hari lalu`),
    daysAgo: `${DAYS} hari lalu`,
    today: "Hari ini",
    history: "Riwayat insiden",
    historyText: "Semua insiden tercatat di sini lengkap dengan kronologinya: berapa lama terjadi dan apa yang kami perbaiki.",
    maintenance: "Pemeliharaan terjadwal",
    incident: "Insiden",
  },
  en: {
    title: "System status",
    label: { up: "Operational", degraded: "Degraded", down: "Outage", maintenance: "Maintenance" } as Record<Status, string>,
    state: { investigating: "Investigating", identified: "Identified", monitoring: "Monitoring", scheduled: "Scheduled", resolved: "Resolved" } as Record<Announcement["state"], string>,
    notices: "Notices",
    services: "Services",
    uptimeOver: `Uptime over the last ${DAYS} days`,
    uptimeAria: (name: string, uptime: string) => `${name}: ${uptime} uptime over ${DAYS} days`,
    day: (n: number) => (n === 0 ? "Today" : `${n} days ago`),
    daysAgo: `${DAYS} days ago`,
    today: "Today",
    history: "Past incidents",
    historyText: "Every incident stays here with its full timeline, including how long it lasted and what we changed.",
    maintenance: "Scheduled maintenance",
    incident: "Incident",
  },
};
type Copy = (typeof copy)["en"];

export async function generateMetadata(): Promise<Metadata> {
  return { title: copy[await getLang()].title };
}

const bg: Record<Status, string> = {
  up: "bg-up",
  degraded: "bg-degraded",
  down: "bg-down",
  maintenance: "bg-maintenance",
};

const fg: Record<Status, string> = {
  up: "text-up",
  degraded: "text-degraded",
  down: "text-down",
  maintenance: "text-maintenance",
};

const active = announcements.filter((a) => a.state !== "resolved");
const past = announcements.filter((a) => a.state === "resolved");
const groups = [...new Set(services.map((s) => s.group))];

export default async function StatusPage() {
  const lang = await getLang();
  const t = copy[lang];
  const label = t.label;
  return (
    <>
      {active.length > 0 && (
        <section aria-labelledby="now" className="frame pt-10">
          <h2 id="now" className="display text-head">
            {t.notices}
          </h2>
          <div className="mt-8 grid gap-2 lg:grid-cols-2">
            {active.map((a) => (
              <Notice key={a.title.en} a={a} t={t} lang={lang} />
            ))}
          </div>
        </section>
      )}

      <section aria-labelledby="services" className="frame pt-20 md:pt-28">
        <div className="reveal flex flex-wrap items-end justify-between gap-4">
          <h2 id="services" className="display text-head">
            {t.services}
          </h2>
          <p className="text-muted">{t.uptimeOver}</p>
        </div>

        <div className="mt-8 space-y-10">
          {groups.map((g) => (
            <div key={g.en} className="reveal">
              <h3 className="text-lead font-semibold">{g[lang]}</h3>
              <ul className="mt-3 space-y-2">
                {services
                  .filter((s) => s.group === g)
                  .map((s) => (
                    <li key={s.name.en} className="bg-surface p-5">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                        <span className="font-semibold">{s.name[lang]}</span>
                        <span className="flex items-center gap-4 text-small">
                          <span className="text-muted tabular-nums">
                            {s.uptime}
                          </span>
                          <span
                            className={`flex items-center gap-2 font-semibold ${fg[s.status]}`}
                          >
                            <span
                              className={`size-2 rounded-full ${bg[s.status]}`}
                              aria-hidden
                            />
                            {label[s.status]}
                          </span>
                        </span>
                      </div>
                      <div
                        data-ui
                        className="mt-4 flex h-9 gap-[2px]"
                        role="img"
                        aria-label={t.uptimeAria(s.name[lang], s.uptime)}
                      >
                        {Array.from({ length: DAYS }, (_, i) => {
                          const daysAgo = DAYS - 1 - i;
                          const st: Status = s.incidents[daysAgo] ?? "up";
                          return (
                            <span
                              key={i}
                              title={`${t.day(daysAgo)}: ${label[st]}`}
                              className={`flex-1 rounded-[2px] transition-transform hover:scale-y-110 ${bg[st]} ${st === "up" ? "opacity-80 hover:opacity-100" : ""}`}
                            />
                          );
                        })}
                      </div>
                      <div className="mt-2 flex justify-between text-small text-muted">
                        <span>{t.daysAgo}</span>
                        <span>{t.today}</span>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>

        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-small text-muted">
          {(Object.keys(label) as Status[]).map((s) => (
            <li key={s} className="flex items-center gap-2">
              <span className={`size-2.5 rounded-[2px] ${bg[s]}`} aria-hidden />
              {label[s]}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="history" className="frame py-20 md:py-28">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="reveal md:col-span-4">
            <h2 id="history" className="display text-head">
              {t.history}
            </h2>
            <p className="mt-4 max-w-[34ch]">{t.historyText}</p>
          </div>
          <div className="space-y-2 md:col-span-8">
            {past.map((a) => (
              <Notice key={a.title.en} a={a} t={t} lang={lang} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function Notice({ a, t, lang }: { a: Announcement; t: Copy; lang: Lang }) {
  const resolved = a.state === "resolved";
  return (
    <article className="reveal flex bg-surface">
      <span
        aria-hidden
        className={`w-1.5 shrink-0 ${resolved ? "bg-surface-2" : bg[a.severity]}`}
      />
      <div className="p-5 md:p-7">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-small">
          <span
            className={`font-semibold ${resolved ? "text-muted" : fg[a.severity]}`}
          >
            {t.state[a.state]}
          </span>
          <span className="text-muted">
            {a.kind === "maintenance" ? t.maintenance : t.incident} ·{" "}
            {a.affected.map((x) => x[lang]).join(", ")}
          </span>
        </p>
        <h3 className="mt-3 text-lead font-semibold leading-tight">
          {a.title[lang]}
        </h3>
        <ol className="mt-5 space-y-4">
          {a.updates.map((u) => (
            <li key={u.at.en}>
              <p className="text-small text-muted">{u.at[lang]}</p>
              <p className="mt-1">{u.text[lang]}</p>
            </li>
          ))}
        </ol>
      </div>
    </article>
  );
}
