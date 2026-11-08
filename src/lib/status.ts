// Status page data. shortcut: static mock data, replace with a monitoring API when the backend exists.

import { l, type L } from "./i18n";

export type Status = "up" | "degraded" | "down" | "maintenance";

export type Service = {
  name: L;
  group: L;
  status: Status;
  uptime: string; // last 90 days
  incidents: Partial<Record<number, Exclude<Status, "up">>>; // days-ago -> worst status that day
};

const platform = l("Platform", "Platform");
const billing = l("Pembayaran", "Billing");
const regions = l("Region", "Regions");
const network = l("Jaringan", "Network");
const jkt = l("Jakarta (JKT-1)", "Jakarta (JKT-1)");
const sg = l("Singapura (SG-1)", "Singapore (SG-1)");
const qris = l("QRIS & pembayaran bank", "QRIS & bank payments");
const api = l("Public API", "Public API");

export const services: Service[] = [
  { name: l("Website & Dashboard", "Website & Dashboard"), group: platform, status: "up", uptime: "100.00%", incidents: {} },
  { name: api, group: platform, status: "up", uptime: "99.94%", incidents: { 18: "down" } },
  { name: qris, group: billing, status: "up", uptime: "99.97%", incidents: { 5: "degraded" } },
  { name: l("Pembayaran kripto", "Crypto payments"), group: billing, status: "up", uptime: "100.00%", incidents: {} },
  { name: jkt, group: regions, status: "up", uptime: "99.99%", incidents: { 41: "maintenance", 67: "degraded" } },
  { name: sg, group: regions, status: "degraded", uptime: "99.91%", incidents: { 0: "degraded", 29: "degraded" } },
  { name: l("Surabaya (SBY-1)", "Surabaya (SBY-1)"), group: regions, status: "up", uptime: "100.00%", incidents: {} },
  { name: l("DNS", "DNS"), group: network, status: "up", uptime: "100.00%", incidents: {} },
];

export type Announcement = {
  title: L;
  kind: "incident" | "maintenance";
  state: "investigating" | "identified" | "monitoring" | "scheduled" | "resolved";
  severity: Exclude<Status, "up">;
  affected: L[];
  updates: { at: L; text: L }[]; // newest first, times in WIB
};

export const announcements: Announcement[] = [
  {
    title: l("Disk I/O lambat di beberapa node Singapura", "Slow disk I/O on some Singapore nodes"),
    kind: "incident",
    state: "identified",
    severity: "degraded",
    affected: [sg],
    updates: [
      { at: l("8 Nov 2026, 10:05 WIB", "8 Nov 2026, 10:05 WIB"), text: l("Penyebabnya storage controller yang rusak di salah satu host SG-1. Server yang terdampak sedang kami pindahkan ke host lain tanpa dimatikan. Tidak ada data yang hilang.", "A failing storage controller on one SG-1 host is the cause. We are live-migrating affected servers to healthy hosts. No data loss.") },
      { at: l("8 Nov 2026, 09:12 WIB", "8 Nov 2026, 09:12 WIB"), text: l("Kami sedang mengecek laporan disk yang lambat di sebagian server SG-1.", "We are investigating reports of slow disk performance on a subset of SG-1 servers.") },
    ],
  },
  {
    title: l("Upgrade jaringan di Jakarta", "Network upgrade in Jakarta"),
    kind: "maintenance",
    state: "scheduled",
    severity: "maintenance",
    affected: [jkt],
    updates: [
      { at: l("12 Nov 2026, 01:00–03:00 WIB", "12 Nov 2026, 01:00–03:00 WIB"), text: l("Kami akan mengganti core switch di JKT-1. Selama jadwal ini, mungkin ada packet loss sampai 5 menit per rak.", "We are replacing core switches in JKT-1. Expect up to 5 minutes of packet loss per rack during the window.") },
    ],
  },
  {
    title: l("Konfirmasi pembayaran QRIS tertunda", "QRIS payment confirmations delayed"),
    kind: "incident",
    state: "resolved",
    severity: "degraded",
    affected: [qris],
    updates: [
      { at: l("3 Nov 2026, 15:40 WIB", "3 Nov 2026, 15:40 WIB"), text: l("Beres. Semua pembayaran yang tertunda sudah terkonfirmasi dan tagihannya sudah lunas.", "Resolved. All delayed payments were confirmed and invoices marked as paid.") },
      { at: l("3 Nov 2026, 14:52 WIB", "3 Nov 2026, 14:52 WIB"), text: l("Penyedia pembayaran kami sedang lambat mengirim konfirmasi. Uangmu tetap masuk, hanya status tagihannya telat berubah.", "Our payment provider reports delayed callbacks. Payments are received, but invoices update late.") },
    ],
  },
  {
    title: l("Public API error", "Public API returning errors"),
    kind: "incident",
    state: "resolved",
    severity: "down",
    affected: [api],
    updates: [
      { at: l("21 Okt 2026, 20:31 WIB", "21 Oct 2026, 20:31 WIB"), text: l("Beres. Deploy yang bermasalah sudah di-rollback. Total gangguan: 23 menit.", "Resolved. A bad deploy was rolled back. Total impact: 23 minutes.") },
      { at: l("21 Okt 2026, 20:08 WIB", "21 Oct 2026, 20:08 WIB"), text: l("API sedang mengembalikan error 5xx. Dashboard dan server tetap aman.", "The API is returning 5xx errors. Dashboard and servers are not affected.") },
    ],
  },
];
