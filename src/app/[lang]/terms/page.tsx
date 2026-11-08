import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/legal-page";
import type { Lang } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";

// placeholder: the Indonesian text is a translation of the English one. Have both reviewed by a lawyer before launch.
const content: Record<Lang, { title: string; description: string; intro: string; updated: string; sections: LegalSection[] }> = {
  id: {
    title: "Ketentuan Layanan",
    description: "Ketentuan yang berlaku saat Anda menggunakan hosting server game Ryoza.",
    intro: "Aturan penggunaan Ryoza, ditulis agar mudah dibaca. Versi singkatnya: bayar sesuai yang Anda pakai, jangan merugikan orang lain, dan simpan sendiri backup dari hal yang penting.",
    updated: "8 November 2026",
    sections: [
      {
        id: "agreement",
        title: "Perjanjian",
        body: (
          <p>
            Ketentuan ini adalah perjanjian antara Anda dan Ryoza (&ldquo;kami&rdquo;). Dengan membuat akun atau menggunakan layanan kami, Anda menyetujuinya. Jika Anda menggunakan Ryoza atas nama sebuah organisasi, Anda menyatakan berwenang menyetujui ketentuan ini untuk organisasi tersebut.
          </p>
        ),
      },
      {
        id: "accounts",
        title: "Akun Anda",
        body: (
          <ul>
            <li>Anda harus berusia minimal 17 tahun, atau orang tua atau wali Anda menyetujui ketentuan ini untuk Anda.</li>
            <li>Rahasiakan detail login Anda. Anda bertanggung jawab atas semua yang dilakukan melalui akun Anda, termasuk oleh sub-user yang Anda undang.</li>
            <li>Berikan detail kontak yang benar agar kami dapat menghubungi Anda terkait tagihan dan insiden.</li>
          </ul>
        ),
      },
      {
        id: "services",
        title: "Layanan",
        body: (
          <>
            <p>Kami menyediakan server game, control panel, dan tool terkait. Paket, spesifikasi, dan harga tercantum di halaman harga kami dan dapat berubah; perubahan tidak pernah berlaku untuk periode yang sudah Anda bayar.</p>
            <p>Kami berupaya menjaga server tetap tersedia, tetapi tidak menjanjikan layanan tanpa gangguan. Pemeliharaan terjadwal dan insiden diumumkan di halaman status kami.</p>
          </>
        ),
      },
      {
        id: "payment",
        title: "Pembayaran dan tagihan",
        body: (
          <ul>
            <li>Harga dalam rupiah dan sudah termasuk pajak yang berlaku, kecuali dinyatakan lain.</li>
            <li>Kami menerima QRIS, virtual account bank, e-wallet, dan kripto tertentu. Pembayaran kripto harus dikirim sesuai jumlah dan dalam batas waktu yang tertera di tagihan.</li>
            <li>Layanan bersifat prabayar. Jika perpanjangan tidak dibayar, server ditangguhkan dan datanya dapat dihapus setelah masa tenggang yang tertera di panel.</li>
            <li>Pengembalian dana untuk waktu yang tidak terpakai dikreditkan ke saldo akun Anda, kecuali hukum mewajibkan lain.</li>
          </ul>
        ),
      },
      {
        id: "acceptable-use",
        title: "Penggunaan yang diperbolehkan",
        body: (
          <>
            <p>Anda tidak boleh menggunakan Ryoza untuk:</p>
            <ul>
              <li>melanggar hukum, atau melanggar hak cipta, merek dagang, atau hak lain milik siapa pun;</li>
              <li>menyerang, memindai, atau mengganggu sistem lain, termasuk serangan DDoS, atau mengirim spam;</li>
              <li>menambang kripto, atau menjalankan beban kerja yang tidak terkait hosting game pada paket game;</li>
              <li>menghosting konten yang mengeksploitasi anak, mempromosikan kekerasan, atau melecehkan orang lain.</li>
            </ul>
            <p>Kami dapat menangguhkan server tanpa pemberitahuan jika server tersebut membahayakan pelanggan lain atau jaringan kami.</p>
          </>
        ),
      },
      {
        id: "content",
        title: "Konten dan backup Anda",
        body: (
          <p>
            World, file, dan konfigurasi Anda tetap milik Anda. Anda hanya memberi kami izin yang diperlukan untuk menyimpan dan menjalankannya. Backup otomatis adalah kemudahan, bukan jaminan: simpan sendiri salinan dari apa pun yang tidak boleh hilang.
          </p>
        ),
      },
      {
        id: "third-party",
        title: "Game dan perangkat lunak pihak ketiga",
        body: (
          <p>
            Nama game dan perangkat lunak adalah milik pemiliknya masing-masing. Ryoza tidak berafiliasi dengan atau didukung oleh penerbit game mana pun. Anda bertanggung jawab mematuhi lisensi dan aturan server dari masing-masing game.
          </p>
        ),
      },
      {
        id: "liability",
        title: "Tanggung jawab",
        body: (
          <p>
            Sejauh diizinkan oleh hukum, total tanggung jawab kami atas klaim apa pun dibatasi sebesar jumlah yang Anda bayarkan kepada kami dalam tiga bulan sebelum klaim tersebut timbul, dan kami tidak bertanggung jawab atas kerugian tidak langsung seperti hilangnya keuntungan atau hilangnya data.
          </p>
        ),
      },
      {
        id: "ending",
        title: "Mengakhiri perjanjian",
        body: (
          <p>Anda dapat menutup akun kapan saja dari panel. Kami dapat mengakhirinya atas pelanggaran serius atau berulang terhadap ketentuan ini. Setelah akun ditutup, data server dihapus.</p>
        ),
      },
      {
        id: "law",
        title: "Hukum yang berlaku dan perubahan",
        body: (
          <p>
            Ketentuan ini tunduk pada hukum Republik Indonesia. Kami akan memberi tahu Anda melalui email paling lambat 14 hari sebelum perubahan material mulai berlaku.
          </p>
        ),
      },
    ],
  },
  en: {
    title: "Terms of Service",
    description: "The terms that apply when you use Ryoza game server hosting.",
    intro: "The rules for using Ryoza, written to be read. The short version: pay for what you use, don't harm others, and keep your own backups of what matters.",
    updated: "8 November 2026",
    sections: [
      {
        id: "agreement",
        title: "Agreement",
        body: (
          <p>
            These terms are an agreement between you and Ryoza (&ldquo;we&rdquo;, &ldquo;us&rdquo;). By creating an account or using any of our services, you accept them. If you use Ryoza on behalf of an organisation, you confirm you are allowed to accept these terms for it.
          </p>
        ),
      },
      {
        id: "accounts",
        title: "Your account",
        body: (
          <ul>
            <li>You must be at least 17 years old, or have a parent or guardian accept these terms for you.</li>
            <li>Keep your login details secret. You are responsible for everything done through your account, including by sub-users you invite.</li>
            <li>Give us accurate contact details so we can reach you about billing and incidents.</li>
          </ul>
        ),
      },
      {
        id: "services",
        title: "The service",
        body: (
          <>
            <p>We provide game servers, a control panel and related tools. Plans, specifications and prices are listed on our pricing page and may change; changes never apply to a period you have already paid for.</p>
            <p>We work to keep servers available but do not promise uninterrupted service. Planned maintenance and incidents are posted on our status page.</p>
          </>
        ),
      },
      {
        id: "payment",
        title: "Payment and billing",
        body: (
          <ul>
            <li>Prices are in Indonesian rupiah and include applicable taxes unless stated otherwise.</li>
            <li>We accept QRIS, bank virtual accounts, e-wallets and selected cryptocurrencies. A crypto payment must be sent at the amount and within the time shown on the invoice.</li>
            <li>Services are prepaid. If a renewal is not paid, the server is suspended and its data may be deleted after a grace period stated in the panel.</li>
            <li>Refunds of unused time are credited to your account balance unless the law requires otherwise.</li>
          </ul>
        ),
      },
      {
        id: "acceptable-use",
        title: "Acceptable use",
        body: (
          <>
            <p>You may not use Ryoza to:</p>
            <ul>
              <li>break any law, or infringe anyone&rsquo;s copyright, trademark or other rights;</li>
              <li>attack, scan or disrupt other systems, including DDoS attacks, or send spam;</li>
              <li>mine cryptocurrency, or run workloads unrelated to game hosting on game plans;</li>
              <li>host content that exploits minors, promotes violence or harasses others.</li>
            </ul>
            <p>We may suspend a server without notice when it puts other customers or our network at risk.</p>
          </>
        ),
      },
      {
        id: "content",
        title: "Your content and backups",
        body: (
          <p>
            Your worlds, files and configurations stay yours. You give us only the permission needed to store and run them. Automated backups are a convenience, not a guarantee: keep your own copies of anything you cannot afford to lose.
          </p>
        ),
      },
      {
        id: "third-party",
        title: "Games and third-party software",
        body: (
          <p>
            Game names and software are the property of their respective owners. Ryoza is not affiliated with or endorsed by any game publisher. You are responsible for following each game&rsquo;s own license and server rules.
          </p>
        ),
      },
      {
        id: "liability",
        title: "Liability",
        body: (
          <p>
            To the extent the law allows, our total liability for any claim is limited to the amount you paid us in the three months before it arose, and we are not liable for indirect losses such as lost profits or lost data.
          </p>
        ),
      },
      {
        id: "ending",
        title: "Ending the agreement",
        body: (
          <p>You can close your account at any time from the panel. We may end it for serious or repeated breaches of these terms. After closure, server data is deleted.</p>
        ),
      },
      {
        id: "law",
        title: "Governing law and changes",
        body: (
          <p>
            These terms are governed by the laws of the Republic of Indonesia. We will notify you by email at least 14 days before a material change takes effect.
          </p>
        ),
      },
    ],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const c = content[await getLang()];
  return { title: c.title, description: c.description };
}

export default async function TermsPage() {
  const c = content[await getLang()];
  return <LegalPage title={c.title} updated={c.updated} intro={c.intro} sections={c.sections} />;
}
