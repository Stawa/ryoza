import type { Metadata, Viewport } from "next";
import { Figtree, League_Spartan } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LangProvider } from "@/components/lang";
import { langs } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import "../globals.css";

const display = League_Spartan({ variable: "--font-league-spartan", subsets: ["latin"], weight: "700" });
const text = Figtree({ variable: "--font-figtree", subsets: ["latin"], weight: ["400", "500", "600"] });

const meta = {
  id: {
    title: "Ryoza: Hosting Server Game, Web & Database",
    description:
      "Hosting server game Minecraft, Terraria, Palworld, ARK, Valheim, dan Counter-Strike 2, lengkap dengan web hosting dan database. Server yang selalu online.",
    ogTitle: "Ryoza: Hosting Server Game",
    ogText: "Bikin server, ajak teman, langsung main.",
    skip: "Lewati ke konten",
  },
  en: {
    title: "Ryoza: game server hosting, plus web and databases",
    description:
      "Game server hosting for Minecraft, Terraria, Palworld, ARK, Valheim and Counter-Strike 2, with web hosting and databases alongside. Servers that stay online.",
    ogTitle: "Ryoza: game server hosting",
    ogText: "Launch your server, invite your people, and start playing.",
    skip: "Skip to content",
  },
};

// every page is prerendered once per language; src/proxy.ts picks which one a visitor gets
export function generateStaticParams() {
  return langs.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const t = meta[await getLang()];
  return {
    title: { default: t.title, template: "%s · Ryoza" },
    description: t.description,
    openGraph: { title: t.ogTitle, description: t.ogText, type: "website" },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0b0c10" },
    { media: "(prefers-color-scheme: light)", color: "#f2f0ea" },
  ],
};

// Runs before paint so a saved light theme never flashes dark.
const themeScript = `try{var t=localStorage.getItem("theme");if(t==="light")document.documentElement.dataset.theme="light"}catch(e){}`;

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const lang = await getLang();
  return (
    <html lang={lang} data-theme="dark" data-scroll-behavior="smooth" suppressHydrationWarning className={`${display.variable} ${text.variable} antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-svh flex-col font-sans">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-ink">
          {meta[lang].skip}
        </a>
        <LangProvider lang={lang}>
          <SiteHeader />
          <main id="main" className="flex flex-1 flex-col">{children}</main>
          <SiteFooter />
        </LangProvider>
      </body>
    </html>
  );
}
