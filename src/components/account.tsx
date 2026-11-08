"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, Loader2, LogOut, Server as ServerIcon } from "lucide-react";
import { signOut, type User } from "firebase/auth";
import { collection, onSnapshot, orderBy, query, type Timestamp } from "firebase/firestore";
import { auth, db, useUser } from "@/lib/firebase";
import { locale, type Lang } from "@/lib/i18n";
import { useLang } from "./lang";

// Firestore shape. Written only by the backend (see firestore.rules); the browser just reads its own documents.
type Server = {
  id: string;
  name: string;
  game: string;
  location: string;
  plan: string;
  status: "running" | "stopped" | "suspended";
  renewsAt?: Timestamp;
  panelUrl?: string;
};
type Invoice = {
  id: string;
  number: string;
  description: string;
  amount: number; // whole rupiah
  status: "unpaid" | "paid";
  dueAt: Timestamp;
  paidAt?: Timestamp;
  payUrl?: string;
};

const rupiah = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format;
const statusDot: Record<Server["status"], string> = { running: "bg-up", stopped: "bg-muted", suspended: "bg-down" };

const copy = {
  id: {
    loading: "Memuat akunmu",
    eyebrow: "Akunmu",
    hi: (name: string) => `Halo, ${name || "kamu"}`,
    logout: "Keluar",
    activeServers: "Server aktif",
    amountDue: "Total tagihan",
    nextPayment: "Jatuh tempo berikutnya",
    nothingDue: "Belum ada tagihan",
    duePayments: "Tagihan yang perlu dibayar",
    overdue: "Lewat jatuh tempo sejak",
    due: "Jatuh tempo",
    payNow: "Bayar sekarang",
    linkComing: "Link pembayaran segera tersedia",
    servers: "Server",
    loadingServers: "Memuat server…",
    serversError: "Gagal memuat server. Coba muat ulang halaman, ya.",
    noServers: ["Kamu belum punya server. ", "Pilih paket", " dan nyalakan server pertamamu."],
    status: { running: "Berjalan", stopped: "Berhenti", suspended: "Ditangguhkan" },
    renews: "Diperpanjang",
    manage: "Kelola",
    billing: "Riwayat pembayaran",
    invoicesError: "Gagal memuat tagihan. Coba muat ulang halaman, ya.",
    loadingInvoices: "Memuat tagihan…",
    noInvoices: "Belum ada tagihan yang dibayar.",
    cols: ["No. tagihan", "Untuk", "Dibayar", "Jumlah"],
    profile: "Profil",
    name: "Nama",
    email: "Email",
    notVerified: " (belum diverifikasi)",
    signsIn: "Login lewat",
    since: "Bergabung sejak",
    password: "Email dan password",
  },
  en: {
    loading: "Loading your account",
    eyebrow: "Your account",
    hi: (name: string) => `Hi, ${name || "there"}`,
    logout: "Log out",
    activeServers: "Active servers",
    amountDue: "Amount due",
    nextPayment: "Next payment",
    nothingDue: "Nothing due",
    duePayments: "Due payments",
    overdue: "Overdue since",
    due: "Due",
    payNow: "Pay now",
    linkComing: "Payment link coming",
    servers: "Servers",
    loadingServers: "Loading servers…",
    serversError: "We couldn't load your servers. Refresh the page to try again.",
    noServers: ["You don't have any servers yet. ", "Pick a plan", " to launch your first one."],
    status: { running: "Running", stopped: "Stopped", suspended: "Suspended" },
    renews: "Renews",
    manage: "Manage",
    billing: "Billing history",
    invoicesError: "We couldn't load your invoices. Refresh the page to try again.",
    loadingInvoices: "Loading invoices…",
    noInvoices: "No paid invoices yet.",
    cols: ["Invoice", "For", "Paid", "Amount"],
    profile: "Profile",
    name: "Name",
    email: "Email",
    notVerified: " (not verified)",
    signsIn: "Signs in with",
    since: "Member since",
    password: "Email and password",
  },
};
type Copy = (typeof copy)["en"];

/** Live list of users/{uid}/{name}: rows are undefined while loading, null on error. `at` is when they arrived. */
function useCollection<T>(uid: string | undefined, name: string, order: string) {
  const [state, setState] = useState<{ rows?: T[] | null; at: number }>({ at: 0 });
  useEffect(() => {
    if (!uid) return;
    return onSnapshot(
      query(collection(db, "users", uid, name), orderBy(order)),
      (snap) => setState({ rows: snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T), at: Date.now() }),
      () => setState({ rows: null, at: Date.now() }),
    );
  }, [uid, name, order]);
  return state;
}

export function Account() {
  const user = useUser();
  const router = useRouter();
  const { rows: servers } = useCollection<Server>(user?.uid, "servers", "name");
  const { rows: invoices, at: now } = useCollection<Invoice>(user?.uid, "invoices", "dueAt");
  const lang = useLang();
  const t = copy[lang];
  const date = (ts?: Timestamp) => (ts ? ts.toDate().toLocaleDateString(locale[lang], { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Jakarta" }) : "—");

  useEffect(() => {
    if (user === null) router.replace("/login");
  }, [user, router]);

  if (!user)
    return (
      <div className="frame grid flex-1 place-items-center py-24 text-muted">
        <Loader2 className="size-6 animate-spin" aria-label={t.loading} />
      </div>
    );

  const unpaid = invoices?.filter((i) => i.status === "unpaid") ?? [];
  const paid = invoices?.filter((i) => i.status === "paid").reverse() ?? [];
  const due = unpaid.reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="frame flex-1 space-y-16 py-10 md:py-14">
      <header className="rise flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-small text-muted">{t.eyebrow}</p>
          <h1 className="display mt-2 text-head">{t.hi(user.displayName?.split(" ")[0] ?? "")}</h1>
        </div>
        <button
          type="button"
          onClick={() => signOut(auth).then(() => router.push("/"))}
          className="press flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-small font-semibold hover:bg-surface-2"
        >
          <LogOut className="size-4" aria-hidden />
          {t.logout}
        </button>
      </header>

      <dl className="grid gap-2 sm:grid-cols-3">
        <Stat label={t.activeServers} value={servers ? String(servers.filter((s) => s.status === "running").length) : "—"} />
        <Stat label={t.amountDue} value={invoices ? rupiah(due) : "—"} warn={due > 0} />
        <Stat label={t.nextPayment} value={unpaid[0] ? date(unpaid[0].dueAt) : t.nothingDue} />
      </dl>

      {unpaid.length > 0 && (
        <Section id="due" title={t.duePayments}>
          <ul className="divide-y divide-line rounded-2xl border border-degraded/50 bg-surface">
            {unpaid.map((i) => {
              const overdue = i.dueAt.toMillis() < now;
              return (
                <li key={i.id} className="flex flex-wrap items-center gap-x-6 gap-y-3 p-5">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{i.description}</p>
                    <p className="mt-1 text-small text-muted">
                      {i.number} · <span className={overdue ? "font-semibold text-down" : ""}>{overdue ? t.overdue : t.due} {date(i.dueAt)}</span>
                    </p>
                  </div>
                  <p className="display text-lg">{rupiah(i.amount)}</p>
                  {i.payUrl ? (
                    <a href={i.payUrl} className="press rounded-full bg-accent px-5 py-2.5 text-small font-semibold text-accent-ink hover:brightness-95">
                      {t.payNow}
                    </a>
                  ) : (
                    <span className="text-small text-muted">{t.linkComing}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </Section>
      )}

      <Section id="servers" title={t.servers}>
        {servers === undefined ? (
          <Placeholder>{t.loadingServers}</Placeholder>
        ) : servers === null ? (
          <Placeholder>{t.serversError}</Placeholder>
        ) : servers.length === 0 ? (
          <Placeholder>
            <ServerIcon className="mx-auto mb-3 size-6" aria-hidden />
            {t.noServers[0]}
            <Link href="/pricing" className="font-semibold text-ink underline underline-offset-4 hover:text-accent-text">
              {t.noServers[1]}
            </Link>
            {t.noServers[2]}
          </Placeholder>
        ) : (
          <ul className="grid gap-2 md:grid-cols-2">
            {servers.map((s) => {
              const known = s.status in statusDot ? s.status : "stopped";
              const [dot, label] = [statusDot[known], t.status[known]];
              return (
                <li key={s.id} className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{s.name}</p>
                      <p className="mt-1 text-small text-muted">
                        {s.game} · {s.location} · {s.plan}
                      </p>
                    </div>
                    <span className="flex shrink-0 items-center gap-2 text-small">
                      <span className={`size-2 rounded-full ${dot}`} aria-hidden />
                      {label}
                    </span>
                  </div>
                  <div className="mt-auto flex items-center justify-between gap-4 text-small">
                    <span className="text-muted">{t.renews} {date(s.renewsAt)}</span>
                    {s.panelUrl && (
                      <a href={s.panelUrl} className="press flex items-center gap-1.5 rounded-full border border-line px-4 py-2 font-semibold hover:bg-surface-2">
                        {t.manage}
                        <ArrowUpRight className="size-4" aria-hidden />
                      </a>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Section>

      <Section id="billing" title={t.billing}>
        {invoices === null ? (
          <Placeholder>{t.invoicesError}</Placeholder>
        ) : paid.length === 0 ? (
          <Placeholder>{invoices === undefined ? t.loadingInvoices : t.noInvoices}</Placeholder>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-line">
            <table className="w-full min-w-[520px] text-left text-small">
              <thead className="bg-surface text-muted">
                <tr>
                  <th className="px-5 py-3 font-medium">{t.cols[0]}</th>
                  <th className="px-5 py-3 font-medium">{t.cols[1]}</th>
                  <th className="px-5 py-3 font-medium">{t.cols[2]}</th>
                  <th className="px-5 py-3 text-right font-medium">{t.cols[3]}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {paid.map((i) => (
                  <tr key={i.id}>
                    <td className="px-5 py-3 font-semibold">{i.number}</td>
                    <td className="px-5 py-3">{i.description}</td>
                    <td className="px-5 py-3 text-muted">{date(i.paidAt ?? i.dueAt)}</td>
                    <td className="px-5 py-3 text-right">{rupiah(i.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      <Section id="profile" title={t.profile}>
        <Profile user={user} t={t} lang={lang} />
      </Section>
    </div>
  );
}

function Profile({ user, t, lang }: { user: User; t: Copy; lang: Lang }) {
  const providerName: Record<string, string> = { "google.com": "Google", "github.com": "GitHub", password: t.password };
  const methods = user.providerData.map((p) => providerName[p.providerId] ?? p.providerId);
  if (user.uid.startsWith("discord:")) methods.push("Discord");
  const rows: [string, string][] = [
    [t.name, user.displayName || "—"],
    [t.email, user.email ? `${user.email}${user.emailVerified ? "" : t.notVerified}` : "—"],
    [t.signsIn, methods.join(", ") || "—"],
    [t.since, user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString(locale[lang], { day: "numeric", month: "long", year: "numeric" }) : "—"],
  ];
  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-line bg-surface p-6 sm:flex-row sm:items-start">
      {user.photoURL ? (
        <Image src={user.photoURL} alt="" width={64} height={64} unoptimized className="size-16 shrink-0 rounded-full" />
      ) : (
        <span aria-hidden className="display grid size-16 shrink-0 place-items-center rounded-full bg-accent text-xl text-accent-ink">
          {(user.displayName || user.email || "?")[0].toUpperCase()}
        </span>
      )}
      <dl className="grid flex-1 gap-4 sm:grid-cols-2">
        {rows.map(([k, v]) => (
          <div key={k} className="min-w-0">
            <dt className="text-small text-muted">{k}</dt>
            <dd className="mt-1 break-words font-semibold">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Stat({ label, value, warn = false }: { label: string; value: string; warn?: boolean }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <dt className="text-small text-muted">{label}</dt>
      <dd className={`display mt-2 text-2xl ${warn ? "text-degraded" : ""}`}>{value}</dd>
    </div>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id}>
      <h2 id={id} className="display mb-5 text-xl">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Placeholder({ children }: { children: React.ReactNode }) {
  return <p className="rounded-2xl border border-dashed border-line px-5 py-10 text-center text-muted">{children}</p>;
}
