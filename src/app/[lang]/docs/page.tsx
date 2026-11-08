import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Database, Puzzle, Rocket, Terminal } from "lucide-react";
import { getLang } from "@/lib/i18n-server";

// shortcut: guide titles only. Replace with real docs (MDX or a docs platform) when written.
const icons = [Rocket, Terminal, Puzzle, BookOpen, Database];
const copy = {
  id: {
    title: "Dokumentasi",
    description: "Panduan menyiapkan dan menjalankan server game-mu di Ryoza.",
    lead: "Panduan lengkapnya masih kami tulis. Ini yang bakal rilis duluan. Sementara itu, tim support siap bantu lewat email.",
    soon: "Segera hadir",
    contact: "Hubungi support",
    guides: [
      ["Mulai dari sini", "Bikin akun, pilih game dan region, lalu sambungkan untuk pertama kali."],
      ["Pakai console", "Jalankan perintah, baca log, dan atur restart terjadwal."],
      ["Mod dan plugin", "Pasang loader, tambah plugin, dan upload file sendiri lewat SFTP."],
      ["Backup dan restore", "Jadwalkan snapshot dan balikin world ke kondisi sebelumnya."],
      ["Website dan database", "Online-kan situs komunitasmu dan sambungkan plugin ke database privat."],
    ],
  },
  en: {
    title: "Documentation",
    description: "Guides for setting up and running your Ryoza game server.",
    lead: "Full guides are being written. Here is what is coming first. Until then, support is one email away.",
    soon: "Coming soon",
    contact: "Contact support",
    guides: [
      ["Getting started", "Create an account, choose a game and region, and connect for the first time."],
      ["Using the console", "Run commands, read logs and set up scheduled restarts."],
      ["Mods and plugins", "Install loaders, add plugins and upload your own files over SFTP."],
      ["Backups and restores", "Schedule snapshots and roll a world back to an earlier point."],
      ["Websites and databases", "Put your community site online and connect plugins to a private database."],
    ],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const t = copy[await getLang()];
  return { title: t.title, description: t.description };
}

export default async function DocsPage() {
  const t = copy[await getLang()];
  return (
    <section className="frame py-16 md:py-24">
      <h1 className="display rise text-display">{t.title}</h1>
      <p className="mt-6 max-w-[48ch] text-lead leading-snug text-muted">{t.lead}</p>
      <ul className="mt-12 grid gap-4 sm:grid-cols-2">
        {t.guides.map(([title, text], i) => {
          const Icon = icons[i];
          return (
            <li key={i} className="card reveal p-6">
              <Icon className="size-5 text-accent-text" aria-hidden />
              <h2 className="mt-4 text-lead font-semibold">{title}</h2>
              <p className="mt-2 text-muted">{text}</p>
              <p className="mt-4 text-small text-muted">{t.soon}</p>
            </li>
          );
        })}
      </ul>
      <Link href="mailto:support@ryoza.id" className="press mt-10 inline-flex rounded-full bg-accent px-6 py-3.5 font-semibold text-accent-ink hover:brightness-95">
        {t.contact}
      </Link>
    </section>
  );
}
