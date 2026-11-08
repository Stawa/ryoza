// Content for the landing page: game servers first, with web and database hosting alongside.
// Anything marked `placeholder` is not real yet: replace it before launch.
// Visible text is `L` ({ id, en }); pick the visitor's language with `text[lang]`.

import { l, type L, type Lang } from "./i18n";

export type NavLink = { href: string; label: L; desc?: L; icon?: "game" | "bot" | "web" | "db" | "map" };
export type NavItem = NavLink & { children?: NavLink[] };

export const nav: NavItem[] = [
  {
    href: "/#games",
    label: l("Hosting", "Hosting"),
    children: [
      { href: "/#host-game", label: l("Server game", "Game servers"), desc: l("Minecraft, Rust, Palworld, dan banyak lagi", "Minecraft, Rust, Palworld and more"), icon: "game" },
      { href: "/#host-bot", label: l("Hosting bot", "Bot hosting"), desc: l("Bot Discord & Telegram, aplikasi Node dan Python", "Discord and Telegram bots, Node and Python apps"), icon: "bot" },
      { href: "/#host-web", label: l("Web hosting", "Web hosting"), desc: l("Pakai subdomain gratis atau domain sendiri", "Free subdomain or your own domain"), icon: "web" },
      { href: "/#host-db", label: l("Database", "Databases"), desc: l("MySQL, MariaDB, PostgreSQL, dan Redis", "MySQL, MariaDB, PostgreSQL and Redis"), icon: "db" },
    ],
  },
  { href: "/#features", label: l("Fitur", "Features") },
  { href: "/#reviews", label: l("Ulasan", "Reviews") },
  { href: "/#pricing", label: l("Harga", "Pricing") },
  { href: "/#faq", label: l("FAQ", "FAQ") },
];

export const links = {
  discord: "#",
  youtube: "#",
  x: "#",
  instagram: "#",
  terms: "/terms",
  privacy: "/privacy",
  support: "mailto:support@ryoza.id",
};

export type Game = {
  slug: string;
  name: string;
  genre: L;
  icon: string; // square app icon
};

export const games: Game[] = [
  { slug: "minecraft", icon: "/games/minecraft-icon.jpg", name: "Minecraft", genre: l("Sandbox · Java & Bedrock", "Sandbox · Java & Bedrock") },
  { slug: "terraria", icon: "/games/terraria-icon.jpg", name: "Terraria", genre: l("Petualangan · tModLoader", "Adventure · tModLoader") },
  { slug: "palworld", icon: "/games/palworld-icon.jpg", name: "Palworld", genre: l("Survival · Co-op", "Survival · Co-op") },
  { slug: "ark", icon: "/games/ark-icon.jpg", name: "ARK: Survival Ascended", genre: l("Survival · Cluster", "Survival · Clusters") },
  { slug: "valheim", icon: "/games/valheim-icon.jpg", name: "Valheim", genre: l("Survival · Co-op Viking", "Survival · Viking co-op") },
  { slug: "cs2", icon: "/games/cs2-icon.jpg", name: "Counter-Strike 2", genre: l("Kompetitif · 128 tick", "Competitive · 128 tick") },
];

// Everything the searchable list on the home page shows. Icons: Steam / simple-icons (CC0).
export type HostKind = "game" | "bot" | "web" | "db";
export type CatalogItem = { name: string; kind: HostKind; detail: L; icon: string; logo?: boolean }; // logo: one-colour SVG, tinted by CSS

const moreGames: [slug: string, name: string, id: string, en: string][] = [
  ["rust", "Rust", "Plugin Oxide & Carbon, map custom", "Oxide and Carbon plugins, custom maps"],
  ["7dtd", "7 Days to Die", "Mod dan world custom", "Mods and custom worlds"],
  ["zomboid", "Project Zomboid", "Mod Workshop, save awet lama", "Workshop mods, long-running saves"],
  ["satisfactory", "Satisfactory", "Dedicated server buat pabrikmu", "Dedicated factory servers"],
  ["gmod", "Garry's Mod", "Addon & gamemode dari Workshop", "Workshop addons and gamemodes"],
  ["factorio", "Factorio", "Server headless, mod portal siap pakai", "Headless server with the mod portal"],
  ["enshrouded", "Enshrouded", "World survival co-op", "Co-op survival worlds"],
  ["unturned", "Unturned", "Map Workshop, RocketMod & OpenMod", "Workshop maps, RocketMod and OpenMod"],
  ["dst", "Don't Starve Together", "Caves, shard, dan mod", "Caves, shards and mods"],
  ["vrising", "V Rising", "Server PvE dan PvP", "PvE and PvP castle servers"],
  ["sotf", "Sons of the Forest", "Dedicated server buat co-op", "Co-op dedicated server"],
  ["corekeeper", "Core Keeper", "World bawah tanah co-op", "Co-op underground worlds"],
];

const stack: [kind: HostKind, icon: string, name: L, id: string, en: string][] = [
  ["bot", "discord", l("Bot Discord", "Discord bots"), "discord.js, discord.py, JDA", "discord.js, discord.py, JDA"],
  ["bot", "telegram", l("Bot Telegram", "Telegram bots"), "grammY, Telegraf, python-telegram-bot", "grammY, Telegraf, python-telegram-bot"],
  ["bot", "openjdk", l("Bot musik", "Music bots"), "Lavalink & bot Java", "Lavalink and Java bots"],
  ["bot", "nodedotjs", l("Aplikasi Node.js", "Node.js apps"), "Proses Node atau Bun apa saja, nonstop 24/7", "Any Node or Bun process, 24/7"],
  ["bot", "python", l("Aplikasi Python", "Python apps"), "Script, worker, dan scheduler", "Scripts, workers and schedulers"],
  ["web", "wordpress", l("WordPress", "WordPress"), "Instal sekali klik, buat forum atau toko", "One-click install, forums and stores"],
  ["web", "html5", l("Situs statis", "Static sites"), "HTML, CSS, JS, deploy langsung dari Git", "HTML, CSS and JS, deployed from Git"],
  ["web", "laravel", l("PHP dan Laravel", "PHP and Laravel"), "PHP 8 dengan Composer", "PHP 8 with Composer"],
  ["web", "nextdotjs", l("Next.js dan Node", "Next.js and Node"), "Aplikasi server-rendered & API", "Server-rendered apps and APIs"],
  ["web", "django", l("Django dan Flask", "Django and Flask"), "Aplikasi web Python", "Python web apps"],
  ["db", "mysql", l("MySQL", "MySQL"), "Buat plugin, situs, dan bot", "For plugins, sites and bots"],
  ["db", "mariadb", l("MariaDB", "MariaDB"), "Pengganti MySQL, tinggal pakai", "Drop-in MySQL replacement"],
  ["db", "postgresql", l("PostgreSQL", "PostgreSQL"), "Buat aplikasi dan statistik", "For apps and stats"],
  ["db", "redis", l("Redis", "Redis"), "Cache, antrean, dan session", "Caches, queues and sessions"],
];

// `name` is a plain string for games (a title) and per-language for the rest, resolved by `catalogFor`.
type RawItem = Omit<CatalogItem, "name"> & { name: string | L };
const rawCatalog: RawItem[] = [
  ...games.map((g) => ({ name: g.name, kind: "game" as const, detail: g.genre, icon: g.icon })),
  ...moreGames.map(([slug, name, id, en]) => ({ name, kind: "game" as const, detail: l(id, en), icon: `/games/${slug}-icon.jpg` })),
  ...stack.map(([kind, icon, name, id, en]) => ({ name, kind, detail: l(id, en), icon: `/stack/${icon}.svg`, logo: true })),
];
export const catalogFor = (lang: Lang): CatalogItem[] => rawCatalog.map((c) => ({ ...c, name: typeof c.name === "string" ? c.name : c.name[lang] }));
export const catalogSize = rawCatalog.length;

// placeholder: confirm the domain free subdomains will live under.
export const subdomainRoot = "ryoza.id";

// placeholder: SAMPLE reviews for layout only. Replace with real, permitted customer feedback before launch.
export const reviews: { name: string; hosts: L; icon: string; text: L; stars: number }[] = [
  { name: "Raka", hosts: l("SMP Minecraft", "Minecraft SMP"), icon: "/games/minecraft-icon.jpg", stars: 5, text: l("Pindahin SMP kami cuma semalam. Bayar pakai QRIS, server udah nyala sebelum kopiku habis.", "Moved our SMP over in an evening. Paid with QRIS and the server was up before I finished my coffee.") },
  { name: "Nadia", hosts: l("Bot Discord", "Discord bot"), icon: "/stack/discord.svg", stars: 5, text: l("Dulu bot moderasi kami mati tiap malam di laptopku. Sekarang nyala terus, dan kalau crash langsung restart sendiri.", "Our moderation bot used to die every night on my laptop. Now it just runs, and restarts itself if it crashes.") },
  { name: "Dimas", hosts: l("Guild Palworld", "Palworld guild"), icon: "/games/palworld-icon.jpg", stars: 5, text: l("Ping dari Jakarta mantap. Ganti rate lewat panel cuma dua menit.", "Ping from Jakarta is great. Changing the rates in the panel took two minutes.") },
  { name: "Putri", hosts: l("Website komunitas", "Community website"), icon: "/stack/wordpress.svg", stars: 4, text: l("Forum kami sementara pakai subdomain gratis. Nanti mau pasang domain sendiri kelihatannya gampang.", "Our forum runs on the free subdomain for now. Connecting our own domain later looks easy.") },
  { name: "Fajar", hosts: l("Server Rust", "Rust server"), icon: "/games/rust-icon.jpg", stars: 5, text: l("Dulu tiap wipe day bikin deg-degan. Sekarang ada backup dan restart terjadwal, jadi santai aja.", "Wipe day used to be stressful. Backups and scheduled restarts made it boring, in a good way.") },
  { name: "Ayu", hosts: l("Bot Telegram", "Telegram bot"), icon: "/stack/telegram.svg", stars: 5, text: l("Bot toko kami dan database MySQL-nya satu tempat, jadi pesanan nggak pernah nyangkut.", "Our shop bot and its MySQL database sit together, so orders never get lost.") },
  { name: "Bima", hosts: l("Realm Valheim", "Valheim realm"), icon: "/games/valheim-icon.jpg", stars: 5, text: l("Pasang mod BepInEx langsung dari panel, nggak perlu ngoprek file config sama sekali.", "Installed BepInEx mods from the panel without touching a single config file.") },
  { name: "Kevin", hosts: l("World Terraria", "Terraria world"), icon: "/games/terraria-icon.jpg", stars: 4, text: l("Pas setup tModLoader-ku berantakan, support langsung bantu di Discord dalam hitungan menit.", "Support answered on Discord in a few minutes when I broke my tModLoader setup.") },
];

// placeholder: plan structure only. Real prices and specs are filled in later.
export const planCategories = [
  {
    id: "game",
    label: l("Server game", "Game servers"),
    specs: [l("RAM", "Memory"), l("CPU", "CPU"), l("Storage NVMe", "NVMe storage"), l("Slot pemain", "Player slots")],
    includes: [l("Proteksi DDoS", "DDoS protection"), l("Backup otomatis", "Automated backups"), l("Installer mod dan plugin", "Mod and plugin installer"), l("Akses penuh ke console & file", "Full console and file access")],
    plans: [
      { name: "Starter", for: l("Main bareng beberapa teman di satu world", "A few friends on one world"), popular: false },
      { name: "Community", for: l("Grup aktif yang pakai mod", "An active group with mods"), popular: true },
      { name: "Network", for: l("Server besar dan modpack", "Big servers and modpacks"), popular: false },
    ],
  },
  {
    id: "web",
    label: l("Web hosting", "Web hosting"),
    specs: [l("Storage NVMe", "NVMe storage"), l("Jumlah website", "Websites"), l("Bandwidth", "Bandwidth"), l("Akun email", "Email accounts")],
    includes: [l("Subdomain gratis atau domain sendiri", "Free subdomain or your own domain"), l("SSL gratis", "Free SSL certificates"), l("PHP, Node.js, dan situs statis", "PHP, Node.js and static sites"), l("Backup harian", "Daily backups")],
    plans: [
      { name: "Site", for: l("Satu situs komunitas atau portofolio", "One community site or portfolio"), popular: false },
      { name: "Studio", for: l("Beberapa situs, plus toko atau forum", "A few sites with a store or forum"), popular: true },
      { name: "Agency", for: l("Banyak situs dengan trafik tinggi", "Many sites, more traffic"), popular: false },
    ],
  },
  {
    id: "bot",
    label: l("Bot", "Bots"),
    specs: [l("RAM", "Memory"), l("CPU", "CPU"), l("Storage", "Storage"), l("Jumlah bot", "Bots")],
    includes: [l("Bot Discord dan Telegram", "Discord and Telegram bots"), l("Runtime Node.js, Python, dan Java", "Node.js, Python and Java runtimes"), l("Auto-restart kalau crash", "Auto-restart if it crashes"), l("Subdomain gratis buat webhook", "Free subdomain for webhooks")],
    plans: [
      { name: "Hobby", for: l("Satu bot kecil buat servermu", "One small bot for your server"), popular: false },
      { name: "Bot", for: l("Bot ramai yang pakai database", "A busy bot with a database"), popular: true },
      { name: "Fleet", for: l("Banyak bot dan worker", "Many bots and workers"), popular: false },
    ],
  },
  {
    id: "db",
    label: l("Database", "Databases"),
    specs: [l("RAM", "Memory"), l("Storage", "Storage"), l("Maks. koneksi", "Max connections"), l("Jumlah database", "Databases")],
    includes: [l("MySQL, MariaDB, PostgreSQL atau Redis", "MySQL, MariaDB, PostgreSQL or Redis"), l("Jaringan privat ke server game-mu", "Private network to your game servers"), l("Backup point-in-time", "Point-in-time backups"), l("Akses phpMyAdmin / Adminer", "phpMyAdmin / Adminer access")],
    plans: [
      { name: "Plugin DB", for: l("LuckPerms, CoreProtect, dan sejenisnya", "LuckPerms, CoreProtect and friends"), popular: false },
      { name: "App DB", for: l("Website, bot, dan statistik", "Websites, bots and stats"), popular: true },
      { name: "Cluster", for: l("Network dengan banyak server", "Networks with many servers"), popular: false },
    ],
  },
] as const;

// placeholder: example regions. Confirm the real list and measure latency before launch.
export const locations = [
  { code: "JKT", city: "Jakarta", country: l("Indonesia", "Indonesia") },
  { code: "SBY", city: "Surabaya", country: l("Indonesia", "Indonesia") },
  { code: "SIN", city: "Singapore", country: l("Singapura", "Singapore") },
];

export const gameFaqs: Record<Lang, [string, string][]> = {
  id: [
    ["Habis bayar, server langsung aktif?", "Iya. Setup jalan otomatis begitu pembayaranmu terkonfirmasi. Kamu tinggal pilih game dan region, lalu pantau prosesnya di panel sampai server online."],
    ["Bisa pasang mod dan plugin?", "Bisa banget. Panel sudah punya installer untuk loader populer seperti Paper, Fabric, Forge, tModLoader, dan BepInEx. Mau upload file sendiri lewat SFTP juga bisa."],
    ["Bisa upgrade paket di tengah jalan?", "Bisa, kapan saja lewat panel. File dan world-mu tetap aman di tempatnya, dan kamu cukup bayar selisihnya untuk sisa periode tagihan."],
    ["Server diatur dari mana?", "Semuanya dari control panel berbasis web: start dan stop, console real-time, file manager, backup, jadwal otomatis, sampai sub-user buat moderator."],
    ["Bisa hosting bot, website, atau database juga?", "Bisa. Fokus kami memang server game, tapi kamu juga bisa menjalankan bot Discord dan Telegram, website, serta database MySQL, MariaDB, PostgreSQL, atau Redis. Website dapat subdomain gratis, atau pakai domain sendiri lengkap dengan SSL gratis. Semuanya ada di jaringan privat yang sama, jadi bot dan plugin bisa akses database dengan cepat."],
    ["Kalau server crash, gimana?", "Panel otomatis mendeteksi crash dan me-restart server. Kalau world-mu rusak, tinggal pulihkan dari backup otomatis dengan sekali klik."],
    ["Cara hubungi support?", "Buka tiket dari panel, email ke support@ryoza.id, atau tanya langsung di Discord kami. Yang jawab manusia, bukan bot, dan mereka juga main game yang sama."],
  ],
  en: [
    ["How quickly can I deploy my server?", "Setup starts automatically as soon as your payment is confirmed. You pick the game and region, and the panel shows each step until the server is online."],
    ["Can I install mods and plugins?", "Yes. The panel has an installer for common loaders like Paper, Fabric, Forge, tModLoader and BepInEx, and you can always upload your own files over SFTP."],
    ["Can I upgrade my plan?", "Yes, at any time from the panel. Your files and worlds stay where they are, and you only pay the difference for the rest of the billing period."],
    ["How do I manage my server?", "Everything runs from the web control panel: start and stop, a live console, file manager, backups, schedules and sub-users for your moderators."],
    ["Can I host bots, websites or databases too?", "Yes. Game servers are our focus, but you can also run Discord and Telegram bots, websites and MySQL, MariaDB, PostgreSQL or Redis databases. Websites get a free subdomain, or you can connect your own domain with free SSL. Everything sits on the same private network, so bots and plugins reach your databases fast."],
    ["What happens if my server crashes?", "The panel detects the crash and restarts the server for you. If a world gets corrupted, roll back to any automated backup in one click."],
    ["How can I contact support?", "Open a ticket from the panel, email support@ryoza.id or ask in our Discord community. Real people answer, and they play these games too."],
  ],
};

// Logos in public/payments (Wikimedia Commons / cryptocurrency-icons). Trademarks of their owners.
export const paymentLogos: { group: string; items: [id: string, name: string][] }[] = [
  { group: "QRIS", items: [["qris", "QRIS"]] },
  { group: "Virtual account", items: [["bca", "BCA"], ["mandiri", "Mandiri"], ["bni", "BNI"], ["bri", "BRI"], ["cimb", "CIMB Niaga"], ["permata", "Permata Bank"], ["bsi", "BSI"]] },
  { group: "E-wallet", items: [["gopay", "GoPay"], ["ovo", "OVO"], ["dana", "DANA"]] },
  { group: "Crypto", items: [["usdt", "USDT"], ["btc", "Bitcoin"], ["eth", "Ethereum"], ["sol", "Solana"]] },
];
