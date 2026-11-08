import { Cpu, DatabaseBackup, Headset, Puzzle, ShieldCheck, Zap } from "lucide-react";
import { getLang } from "@/lib/i18n-server";
import { SectionHead } from "./section-head";

const icons = [Zap, ShieldCheck, Cpu, Puzzle, DatabaseBackup, Headset];
const copy = {
  id: {
    kicker: "Kenapa Ryoza",
    title: "Semua yang servermu butuhkan.",
    text: "Tool yang gampang dipakai, hardware kencang, dan tim yang benar-benar ngerti.",
    items: [
      ["Online kurang dari semenit", "Pilih game dan region, server langsung diproses setelah kamu bayar."],
      ["Proteksi DDoS", "Serangan disaring sebelum sampai ke servermu. Ada di semua paket."],
      ["Hardware kencang", "CPU high-clock dan SSD NVMe, disetel khusus buat server game."],
      ["Mod dan plugin", "Pasang loader dan plugin sekali klik, atau upload punyamu sendiri."],
      ["Backup otomatis", "Snapshot terjadwal. World rusak? Balikin lagi dengan sekali klik."],
      ["Support beneran", "Tiket, email, dan Discord, dijawab orang yang juga main game."],
    ],
  },
  en: {
    kicker: "Why Ryoza",
    title: "Everything your server needs.",
    text: "Simple tools, fast hardware and real people behind them.",
    items: [
      ["Online in about a minute", "Pick a game and a region. Setup starts the moment your payment clears."],
      ["DDoS protection", "Attacks are filtered before they reach your server, on every plan."],
      ["Fast hardware", "High-clock CPUs and NVMe storage, tuned for game servers."],
      ["Mods and plugins", "Install loaders and plugins in one click, or upload your own."],
      ["Automatic backups", "Scheduled snapshots. Roll back a broken world in one click."],
      ["Real support", "Tickets, email and Discord, answered by people who play too."],
    ],
  },
};

export async function Features() {
  const t = copy[await getLang()];
  return (
    <section id="features" aria-labelledby="features-title" className="frame scroll-mt-24 py-24 md:py-32">
      <SectionHead id="features-title" kicker={t.kicker} title={t.title} text={t.text} />

      <ul className="reveal mt-14 grid gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
        {t.items.map(([title, text], i) => {
          const Icon = icons[i];
          return (
            <li key={i} className="group border-t border-line py-10">
              <span className="grid size-12 place-items-center rounded-2xl bg-accent/10 text-accent-text transition-colors group-hover:bg-accent group-hover:text-accent-ink">
                <Icon className="size-6" aria-hidden />
              </span>
              <h3 className="mt-6 text-lead font-semibold">{title}</h3>
              <p className="mt-2 max-w-[34ch] text-muted">{text}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
