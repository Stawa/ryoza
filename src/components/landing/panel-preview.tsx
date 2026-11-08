"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Copy,
  Cpu,
  Database,
  DatabaseBackup,
  File,
  Folder,
  FolderOpen,
  Globe,
  HardDrive,
  MemoryStick,
  Play,
  RotateCw,
  Square,
  Terminal,
  UserX,
  Users,
} from "lucide-react";
import { useLang } from "../lang";
import { RMark } from "../logo";
import { SectionHead } from "./section-head";

type State = "online" | "restarting" | "stopped";
type Tab = "console" | "files" | "backups" | "players";
type Service = { name: string; meta: string; icon?: string; Icon?: typeof Globe; status: "up" | "down" | "degraded"; active?: boolean };

const names = ["Ayu", "Bima", "Raka", "Sari", "Dewi", "Fajar", "Putri", "Yoga", "Nadia", "Rizky"];
const colors = ["#ff4b2b", "#7cc4ff", "#f5b84b", "#ff8fb1", "#b9a5ff", "#3ddc84", "#ffd166", "#9ad1d4"];
const color = (n: string) => colors[names.indexOf(n) % colors.length];
const time = () => new Date().toTimeString().slice(0, 8);

const files = [
  { name: "world", dir: true, size: "2.1 GB" },
  { name: "world_nether", dir: true, size: "412 MB" },
  { name: "plugins", dir: true, size: "86 MB" },
  { name: "server.properties", dir: false, size: "1.4 KB" },
  { name: "ops.json", dir: false, size: "312 B" },
  { name: "paper.jar", dir: false, size: "48 MB" },
];

// Panel chrome is translated; console lines stay English, the way the game server prints them.
const copy = {
  id: {
    kicker: "Control panel",
    title: "Semua servermu, dalam satu layar.",
    text: "Server game, website, dan database dalam satu tempat. Start, stop, cek console, dan atur pemain. Silakan coba, tombol di bawah ini beneran berfungsi.",
    fileWhen: ["2 menit lalu", "2 menit lalu", "Kemarin", "3 hari lalu", "3 hari lalu", "1 minggu lalu"],
    backups: ["Hari ini 21:00", "Hari ini 18:00", "Hari ini 15:00", "Kemarin 21:00"],
    state: { online: "Online", restarting: "Restart…", stopped: "Offline" },
    groups: ["Server game", "Website", "Database"],
    services: "Layananmu (pratinjau)",
    copyAddress: "Salin alamat server",
    copied: "Tersalin",
    start: "Start",
    restart: "Restart",
    stop: "Stop",
    cpu: "CPU",
    memory: "RAM",
    storage: "Storage",
    players: "Pemain",
    tools: "Tool server",
    tabs: { console: "Console", files: "File", backups: "Backup", players: "Pemain" },
    consoleOutput: "Output console server",
    consoleInput: "Perintah console",
    consoleHint: 'Coba ketik "list" atau "say hello"',
    automatic: "otomatis",
    restore: "Pulihkan",
    nobody: "Belum ada yang online. Nyalakan server, lalu ajak teman-temanmu.",
    kick: (n: string) => `Kick ${n}`,
    perks: [
      ["Console real-time", "Lihat log dan jalankan perintah saat itu juga."],
      ["Power sekali klik", "Start, restart, dan stop tanpa perlu SSH."],
      ["File & SFTP", "Edit config dari browser atau pakai client favoritmu."],
      ["Pemain & sub-user", "Atur pemain dan kasih moderator akses login sendiri."],
    ],
  },
  en: {
    kicker: "Control panel",
    title: "Every server you run, on one screen.",
    text: "Game servers, websites and databases side by side. Start, stop, read the console and manage players. Try it: the controls below work.",
    fileWhen: ["2 min ago", "2 min ago", "Yesterday", "3 days ago", "3 days ago", "1 week ago"],
    backups: ["Today 21:00", "Today 18:00", "Today 15:00", "Yesterday 21:00"],
    state: { online: "Online", restarting: "Restarting", stopped: "Stopped" },
    groups: ["Game servers", "Websites", "Databases"],
    services: "Your services (preview)",
    copyAddress: "Copy server address",
    copied: "Copied",
    start: "Start",
    restart: "Restart",
    stop: "Stop",
    cpu: "CPU",
    memory: "Memory",
    storage: "Storage",
    players: "Players",
    tools: "Server tools",
    tabs: { console: "Console", files: "Files", backups: "Backups", players: "Players" },
    consoleOutput: "Server console output",
    consoleInput: "Console command",
    consoleHint: 'Type "list" or "say hello"',
    automatic: "automatic",
    restore: "Restore",
    nobody: "Nobody is online. Start the server and invite your friends.",
    kick: (n: string) => `Kick ${n}`,
    perks: [
      ["Live console", "Read logs and run commands as they happen."],
      ["One-click power", "Start, restart and stop without SSH."],
      ["Files and SFTP", "Edit configs in the browser or your own client."],
      ["Players and sub-users", "Manage players and give your mods their own logins."],
    ],
  },
};

// sample panel data for the preview, not live metrics
export function PanelPreview() {
  const t = copy[useLang()];
  const [state, setState] = useState<State>("online");
  const [tab, setTab] = useState<Tab>("console");
  const [cpu, setCpu] = useState<number[]>(() => Array.from({ length: 32 }, (_, i) => 30 + Math.round(10 * Math.sin(i / 3))));
  const [online, setOnline] = useState<string[]>(names.slice(0, 6));
  const [log, setLog] = useState<string[]>([
    '[19:40:02 INFO]: Done (3.214s)! For help, type "help"',
    "[19:40:31 INFO]: Ayu joined the game",
    "[19:41:12 INFO]: Bima joined the game",
    "[19:42:08 INFO]: Saving the game (this may take a moment!)",
    "[19:42:09 INFO]: Saved the game",
  ]);
  const [cmd, setCmd] = useState("");
  const [copied, setCopied] = useState(false);
  const consoleRef = useRef<HTMLDivElement>(null);

  const push = (line: string) => setLog((l) => [...l.slice(-60), `[${time()} INFO]: ${line}`]);

  useEffect(() => {
    if (state !== "online") return;
    const id = setInterval(() => {
      setCpu((c) => [...c.slice(1), Math.max(8, Math.min(92, c[c.length - 1] + Math.round((Math.random() - 0.5) * 14)))]);
      if (Math.random() < 0.22) {
        setOnline((o) => {
          const away = names.filter((n) => !o.includes(n));
          if ((Math.random() < 0.5 && away.length) || o.length < 2) {
            const n = away[Math.floor(Math.random() * away.length)];
            push(`${n} joined the game`);
            return [...o, n];
          }
          const n = o[Math.floor(Math.random() * o.length)];
          push(`${n} left the game`);
          return o.filter((x) => x !== n);
        });
      }
    }, 1400);
    return () => clearInterval(id);
  }, [state]);

  useEffect(() => {
    const el = consoleRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [log, tab]);

  function power(next: "start" | "restart" | "stop") {
    if (next === "stop") {
      push("Stopping server");
      setState("stopped");
      setOnline([]);
      return;
    }
    push(next === "restart" ? "Restarting server" : "Starting server");
    setState("restarting");
    setTimeout(() => {
      setState("online");
      setOnline(names.slice(0, 2));
      push('Done (2.981s)! For help, type "help"');
    }, 1800);
  }

  function restore(b: string) {
    setTab("console");
    push(`Restoring backup "${b}"…`);
    setTimeout(() => push(`Backup "${b}" restored. World reloaded.`), 900);
  }

  function kick(n: string) {
    setOnline((o) => o.filter((x) => x !== n));
    push(`Kicked ${n}: Kicked by an operator`);
  }

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText("play.ryoza.id");
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard blocked: the address stays visible */
    }
  }

  const players = state === "online" ? online.length : 0;
  const last = state === "online" ? cpu[cpu.length - 1] : 0;
  const path = cpu.map((v, i) => `${(i / (cpu.length - 1)) * 100},${100 - v}`).join(" ");
  const pill = { online: ["bg-up", "text-up"], restarting: ["bg-degraded", "text-degraded"], stopped: ["bg-down", "text-down"] }[state];

  const sidebar: [string, Service[]][] = [
    [t.groups[0], [
      { name: "Survival SMP", meta: "Minecraft", icon: "/games/minecraft-icon.jpg", status: state === "online" ? "up" : state === "stopped" ? "down" : "degraded", active: true },
      { name: "Clan realm", meta: "Valheim", icon: "/games/valheim-icon.jpg", status: "up" },
    ]],
    [t.groups[1], [{ name: "yourclan.id", meta: "WordPress", Icon: Globe, status: "up" }]],
    [t.groups[2], [{ name: "smp-db", meta: "MySQL 8", Icon: Database, status: "up" }]],
  ];

  return (
    <section id="panel" aria-labelledby="panel-title" className="relative scroll-mt-24 py-24 md:py-32">
      <div className="frame">
        <SectionHead
          id="panel-title"
          kicker={t.kicker}
          title={t.title}
          text={t.text}
        />

        {/* the stage */}
        <div className="reveal relative mt-12 overflow-hidden ">   
          {/* the window */}
          <div className="relative overflow-hidden rounded-[18px] border border-line bg-bg text-ink shadow-[0_40px_80px_-30px_rgba(11,12,16,.7)]">
            <div className="flex items-center justify-between gap-4 border-b border-line bg-surface px-4 py-3">
              <div className="flex items-center gap-2.5">
                <span className="grid size-7 place-items-center rounded-lg bg-accent">
                  <RMark className="size-4 text-accent-ink" />
                </span>
                <span className="text-small font-semibold">Ryoza Panel</span>
              </div>
              <span className="hidden rounded-md bg-surface-2 px-3 py-1 text-[12px] text-muted sm:block">panel.ryoza.id/servers/survival-smp</span>
              <span className="grid size-7 place-items-center rounded-full bg-[#7cc4ff] text-[12px] font-semibold text-black" aria-hidden>A</span>
            </div>

            <div className="grid lg:grid-cols-[240px_1fr]">
              {/* sidebar: every service */}
              <aside className="hidden border-r border-line bg-surface/50 p-3 lg:block" aria-label={t.services}>
                {sidebar.map(([group, items]) => (
                  <div key={group} className="mb-4">
                    <p className="px-2 pb-1.5 text-[12px] font-semibold text-muted">{group}</p>
                    <ul className="space-y-0.5">
                      {items.map((s) => (
                        <li key={s.name} className={`flex items-center gap-2.5 rounded-lg px-2 py-2 ${s.active ? "bg-surface-2" : ""}`}>
                          {s.icon ? (
                            <Image src={s.icon} alt="" width={28} height={28} className="size-7 rounded-md" />
                          ) : s.Icon ? (
                            <span className="grid size-7 place-items-center rounded-md bg-surface-2 text-accent-text"><s.Icon className="size-3.5" aria-hidden /></span>
                          ) : null}
                          <span className="min-w-0 flex-1">
                            <span className={`block truncate text-small ${s.active ? "font-semibold" : ""}`}>{s.name}</span>
                            <span className="block truncate text-[12px] text-muted">{s.meta}</span>
                          </span>
                          <span className={`size-1.5 rounded-full ${s.status === "up" ? "bg-up" : s.status === "down" ? "bg-down" : "bg-degraded"}`} aria-hidden />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </aside>

              <div className="min-w-0 p-4 sm:p-6">
                {/* header */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Image src="/games/minecraft-icon.jpg" alt="" width={44} height={44} className="size-11 rounded-xl" />
                    <div>
                      <p className="flex items-center gap-2.5 font-semibold">
                        Survival SMP
                        <span className={`flex items-center gap-1.5 rounded-full bg-surface-2 px-2 py-0.5 text-[12px] ${pill[1]}`}>
                          <span className={`size-1.5 rounded-full ${pill[0]} ${state === "restarting" ? "blink" : ""}`} aria-hidden />
                          <span aria-live="polite">{t.state[state]}</span>
                        </span>
                      </p>
                      <button type="button" onClick={copyAddress} className="mt-0.5 flex items-center gap-1.5 text-small text-muted hover:text-ink">
                        play.ryoza.id · Paper 1.21
                        <Copy className="size-3" aria-hidden />
                        <span className="sr-only">{t.copyAddress}</span>
                        {copied && <span className="text-up">{t.copied}</span>}
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Ctrl onClick={() => power("start")} disabled={state !== "stopped"} icon={Play} label={t.start} tone="accent" />
                    <Ctrl onClick={() => power("restart")} disabled={state !== "online"} icon={RotateCw} label={t.restart} />
                    <Ctrl onClick={() => power("stop")} disabled={state !== "online"} icon={Square} label={t.stop} tone="danger" />
                  </div>
                </div>

                {/* stats */}
                <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line xl:grid-cols-4">
                  <Stat icon={Cpu} label={t.cpu} value={`${last}%`}>
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-9 w-full" aria-hidden>
                      <polyline points={path} fill="none" stroke="var(--accent)" strokeWidth="2.5" vectorEffect="non-scaling-stroke" className={state === "online" ? "" : "opacity-30"} />
                    </svg>
                  </Stat>
                  <Stat icon={MemoryStick} label={t.memory} value={state === "stopped" ? "0 / 6 GB" : "3.4 / 6 GB"}>
                    <Bar pct={state === "stopped" ? 0 : 57} />
                  </Stat>
                  <Stat icon={HardDrive} label={t.storage} value="12.8 / 40 GB">
                    <Bar pct={32} />
                  </Stat>
                  <Stat icon={Users} label={t.players} value={`${players} / 20`}>
                    <div className="flex -space-x-1.5 pt-1.5" aria-hidden>
                      {online.slice(0, 6).map((n) => (
                        <span key={n} className="grid size-6 place-items-center rounded-full border-2 border-surface text-[10px] font-semibold text-black" style={{ background: color(n) }}>
                          {n[0]}
                        </span>
                      ))}
                    </div>
                  </Stat>
                </div>

                {/* tabs */}
                <div role="tablist" aria-label={t.tools} className="mt-6 flex gap-1 overflow-x-auto border-b border-line">
                  {([
                    ["console", Terminal],
                    ["files", FolderOpen],
                    ["backups", DatabaseBackup],
                    ["players", Users],
                  ] as const).map(([id, Icon]) => (
                    <button
                      key={id}
                      type="button"
                      role="tab"
                      aria-selected={tab === id}
                      aria-controls="panel-tab"
                      onClick={() => setTab(id)}
                      className={`relative flex items-center gap-2 px-3.5 py-2.5 text-small font-semibold whitespace-nowrap transition-colors ${tab === id ? "text-ink" : "text-muted hover:text-ink"}`}
                    >
                      <Icon className="size-4" aria-hidden />
                      {t.tabs[id]}
                      {tab === id && <motion.span layoutId="panel-tab-line" className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-accent" />}
                    </button>
                  ))}
                </div>

                <div id="panel-tab" role="tabpanel" className="mt-4 min-h-[300px]">
                  <AnimatePresence mode="wait">
                    <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
                      {tab === "console" && (
                        <div className="overflow-hidden rounded-xl border border-line bg-[#07080b] text-[#d7d7d2]">
                          <div ref={consoleRef} className="h-60 overflow-y-auto px-4 py-3 font-mono text-[12px] leading-relaxed" role="log" aria-label={t.consoleOutput}>
                            {log.map((l, i) => (
                              <p
                                key={i}
                                className={
                                  l.includes("joined") || l.includes("restored")
                                    ? "text-[#3ddc84]"
                                    : l.includes("left") || l.includes("Kicked") || l.includes("Stopping")
                                      ? "text-[#f5b84b]"
                                      : l.startsWith(">")
                                        ? "text-[#ff6a4f]"
                                        : ""
                                }
                              >
                                {l}
                              </p>
                            ))}
                          </div>
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              const c = cmd.trim();
                              if (!c) return;
                              setLog((l) => [...l, `> ${c}`]);
                              push(
                                c === "list"
                                  ? `There are ${players} of a max of 20 players online: ${online.join(", ")}`
                                  : c.startsWith("say ")
                                    ? `[Server] ${c.slice(4)}`
                                    : `Unknown command "${c.split(" ")[0]}". Try "list" or "say hello".`,
                              );
                              setCmd("");
                            }}
                            className="flex items-center gap-2 border-t border-white/10 px-4 py-2.5"
                          >
                            <span className="font-mono text-[12px] text-[#ff6a4f]" aria-hidden>&gt;</span>
                            <label className="sr-only" htmlFor="console-input">{t.consoleInput}</label>
                            <input
                              id="console-input"
                              value={cmd}
                              onChange={(e) => setCmd(e.target.value)}
                              placeholder={t.consoleHint}
                              autoComplete="off"
                              className="w-full bg-transparent font-mono text-[12px] text-white outline-none placeholder:text-[#6c6c70]"
                            />
                          </form>
                        </div>
                      )}

                      {tab === "files" && (
                        <div>
                          <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-surface px-4 py-2.5 text-[12px] text-muted">
                            <span>/home/container</span>
                            <span>sftp://jkt-04.ryoza.id:2022</span>
                          </div>
                          <ul className="divide-y divide-line text-small">
                            {files.map((f, i) => (
                              <li key={f.name} className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface/60">
                                {f.dir ? <Folder className="size-4 text-accent-text" aria-hidden /> : <File className="size-4 text-muted" aria-hidden />}
                                <span className="flex-1 font-medium">{f.name}</span>
                                <span className="w-20 text-right text-muted tabular-nums">{f.size}</span>
                                <span className="hidden w-24 text-right text-muted sm:block">{t.fileWhen[i]}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {tab === "backups" && (
                        <ul className="divide-y divide-line">
                          {t.backups.map((b, i) => (
                            <li key={b} className="flex flex-wrap items-center justify-between gap-3 py-3 text-small">
                              <span className="flex items-center gap-3">
                                <DatabaseBackup className="size-4 text-accent-text" aria-hidden />
                                <span className="font-medium">{b}</span>
                                <span className="text-muted">1.{3 - (i % 3)} GB · {t.automatic}</span>
                              </span>
                              <button type="button" onClick={() => restore(b)} className="press rounded-lg border border-line px-3 py-1.5 font-semibold hover:border-accent hover:text-accent-text">
                                {t.restore}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}

                      {tab === "players" &&
                        (players === 0 ? (
                          <p className="rounded-xl border border-dashed border-line px-4 py-10 text-center text-small text-muted">{t.nobody}</p>
                        ) : (
                          <ul className="grid gap-x-8 sm:grid-cols-2">
                            {online.map((n) => (
                              <li key={n} className="flex items-center gap-3 border-b border-line py-2.5 text-small">
                                <span className="grid size-8 place-items-center rounded-lg text-[12px] font-semibold text-black" style={{ background: color(n) }}>{n[0]}</span>
                                <span className="flex-1">
                                  <span className="block font-medium">{n}</span>
                                  <span className="block text-[12px] text-muted tabular-nums">{12 + names.indexOf(n) * 3} ms</span>
                                </span>
                                <button type="button" onClick={() => kick(n)} aria-label={t.kick(n)} className="press grid size-8 place-items-center rounded-lg text-muted hover:bg-surface-2 hover:text-down">
                                  <UserX className="size-4" aria-hidden />
                                </button>
                              </li>
                            ))}
                          </ul>
                        ))}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ul className="reveal mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[Terminal, Play, FolderOpen, Users].map((Icon, i) => (
            <li key={i} className="flex gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-surface-2 text-accent-text">
                <Icon className="size-4" aria-hidden />
              </span>
              <div>
                <h3 className="font-semibold">{t.perks[i][0]}</h3>
                <p className="mt-1 text-small text-muted">{t.perks[i][1]}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Ctrl({ onClick, disabled, icon: Icon, label, tone }: { onClick: () => void; disabled: boolean; icon: typeof Play; label: string; tone?: "accent" | "danger" }) {
  const c = tone === "accent" ? "bg-accent text-accent-ink" : tone === "danger" ? "border border-line hover:border-down hover:text-down" : "border border-line hover:border-muted";
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={`press flex items-center gap-1.5 rounded-lg px-3 py-2 text-small font-semibold disabled:cursor-not-allowed disabled:opacity-40 ${c}`}>
      <Icon className="size-3.5" aria-hidden />
      {label}
    </button>
  );
}

function Stat({ icon: Icon, label, value, children }: { icon: typeof Cpu; label: string; value: string; children: React.ReactNode }) {
  return (
    <div className="bg-bg p-4">
      <p className="flex items-center gap-2 text-small text-muted">
        <Icon className="size-3.5" aria-hidden />
        {label}
      </p>
      <p className="mt-1 text-lead font-semibold tabular-nums">{value}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function Bar({ pct }: { pct: number }) {
  return (
    <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-2">
      <div className="h-full rounded-full bg-accent transition-[width] duration-700" style={{ width: `${pct}%` }} />
    </div>
  );
}
