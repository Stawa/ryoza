import { Headset, Rocket, ServerCog, Signal } from "lucide-react";
import { getLang } from "@/lib/i18n-server";

const icons = [ServerCog, Signal, Rocket, Headset];
const copy = {
  id: {
    label: "Kenapa pilih Ryoza",
    items: [
      ["Infrastruktur andal", "Hardware kelas enterprise dengan listrik dan jaringan cadangan."],
      ["Ping rendah", "Region dipilih supaya dekat dengan pemainmu."],
      ["Langsung aktif", "Server diproses begitu pembayaranmu masuk."],
      ["Support dari sesama gamer", "Lewat tiket, email, atau Discord. Yang jawab juga main game."],
    ],
  },
  en: {
    label: "Platform highlights",
    items: [
      ["Reliable infrastructure", "Enterprise hardware with redundant power and network."],
      ["Low-latency connections", "Regions picked to sit close to your players."],
      ["Instant deployment", "Setup starts the moment your payment clears."],
      ["Community-first support", "Tickets, email and Discord, answered by gamers."],
    ],
  },
};

export async function TrustStrip() {
  const t = copy[await getLang()];
  return (
    <section aria-label={t.label} className="frame">
      <ul className="reveal grid overflow-hidden rounded-2xl border border-line sm:grid-cols-2 lg:grid-cols-4">
        {t.items.map(([title, text], i) => {
          const Icon = icons[i];
          return (
            <li key={i} className="group flex gap-4 border-line p-5 not-last:border-b sm:p-6 sm:[&:nth-child(odd)]:border-r sm:[&:nth-child(n+3)]:border-b-0 lg:border-b-0 lg:not-last:border-r">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-surface-2 text-accent-text transition-transform group-hover:-rotate-6">
                <Icon className="size-5" aria-hidden />
              </span>
              <div>
                <h2 className="font-semibold">{title}</h2>
                <p className="mt-1 text-small text-muted">{text}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
