import Link from "next/link";
import { getLang } from "@/lib/i18n-server";
import { links } from "@/lib/site";
import { Logo } from "./logo";

const copy = {
  id: {
    tagline: "Server game yang selalu online, lengkap dengan bot, website, dan database.",
    terms: "Ketentuan",
    privacy: "Privasi",
    cols: [
      { title: "Hosting", items: [["/#host-game", "Server game"], ["/#host-bot", "Hosting bot"], ["/#host-web", "Web hosting"], ["/#locations", "Lokasi"], ["/#pricing", "Harga"]] },
      { title: "Bantuan", items: [["/docs", "Dokumentasi"], [links.support, "Hubungi support"], ["/status", "Status sistem"]] },
    ],
  },
  en: {
    tagline: "Game servers that stay online, with bots, websites and databases alongside.",
    terms: "Terms",
    privacy: "Privacy",
    cols: [
      { title: "Hosting", items: [["/#host-game", "Game servers"], ["/#host-bot", "Bot hosting"], ["/#host-web", "Web hosting"], ["/#locations", "Locations"], ["/#pricing", "Pricing"]] },
      { title: "Help", items: [["/docs", "Documentation"], [links.support, "Support"], ["/status", "System status"]] },
    ],
  },
};

const socials = [
  ["discord", "Discord", links.discord],
  ["youtube", "YouTube", links.youtube],
  ["x", "X", links.x],
  ["instagram", "Instagram", links.instagram],
] as const;

export async function SiteFooter() {
  const t = copy[await getLang()];
  return (
    <footer className="mt-auto border-t border-line">
      <div className="frame grid gap-10 py-14 md:grid-cols-12 md:py-16">
        <div className="md:col-span-6 lg:col-span-5">
          <Logo />
          <p className="mt-4 max-w-[32ch] text-muted">{t.tagline}</p>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 md:col-span-6 lg:col-span-4 lg:col-start-9">
          {t.cols.map((c) => (
            <div key={c.title}>
              <h2 className="text-small font-semibold">{c.title}</h2>
              <ul className="mt-4 space-y-3 text-small">
                {c.items.map(([href, label]) => (
                  <li key={href}>
                    {/* "/#host-*" needs a plain <a>: Next's Link never fires hashchange, which the catalog filter listens for */}
                    {href.startsWith("/#host-") ? (
                      <a href={href} className="text-muted transition-colors hover:text-ink">{label}</a>
                    ) : (
                      <Link href={href} className="text-muted transition-colors hover:text-ink">{label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="frame flex flex-col-reverse gap-6 border-t border-line py-6 text-small text-muted md:flex-row md:items-center md:justify-between">
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span>© 2026 Ryoza</span>
          <Link href={links.terms} className="hover:text-ink">{t.terms}</Link>
          <Link href={links.privacy} className="hover:text-ink">{t.privacy}</Link>
        </p>
        <ul className="flex gap-2">
          {socials.map(([id, name, href]) => (
            <li key={id}>
              <a
                href={href}
                aria-label={name}
                className="press grid size-9 place-items-center rounded-full border border-line text-muted transition-colors hover:border-accent hover:text-accent-text"
              >
                {/* brand icon from public/social (simple-icons, CC0), tinted with currentColor through a mask */}
                <span
                  aria-hidden
                  className="size-4 bg-current"
                  style={{ mask: `url(/social/${id}.svg) center / contain no-repeat`, WebkitMask: `url(/social/${id}.svg) center / contain no-repeat` }}
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
