import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/legal-page";
import type { Lang } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";

// placeholder: the Indonesian text is a translation of the English one. Have both reviewed by a lawyer before launch.
const content: Record<Lang, { title: string; description: string; intro: string; updated: string; sections: LegalSection[] }> = {
  id: {
    title: "Kebijakan Privasi",
    description: "Data pribadi apa yang dikumpulkan Ryoza, untuk apa, dan pilihan yang Anda miliki.",
    intro: "Apa yang kami kumpulkan, mengapa kami membutuhkannya, dan apa yang dapat Anda minta kami lakukan dengannya. Kami mengumpulkan sesedikit mungkin untuk menjalankan server Anda.",
    updated: "8 November 2026",
    sections: [
      {
        id: "overview",
        title: "Ringkasan",
        body: (
          <p>
            Kebijakan ini menjelaskan data pribadi apa yang dikumpulkan Ryoza saat Anda menggunakan situs web, control panel, dan server game kami, bagaimana kami menggunakannya, dan hak Anda berdasarkan Undang-Undang Pelindungan Data Pribadi (UU No. 27 Tahun 2022). Ryoza adalah pengendali data ini.
          </p>
        ),
      },
      {
        id: "collect",
        title: "Data yang kami kumpulkan",
        body: (
          <ul>
            <li><strong>Data akun:</strong> nama, alamat email, dan password Anda yang di-hash.</li>
            <li><strong>Data tagihan:</strong> tagihan, jenis metode pembayaran, dan referensi transaksi. Detail kartu, bank, dan dompet digital ditangani oleh penyedia pembayaran kami; kami tidak pernah melihat nomor rekening lengkap atau PIN Anda.</li>
            <li><strong>Data layanan:</strong> pengaturan server, log console, alamat IP yang terhubung ke server Anda, dan aktivitas panel.</li>
            <li><strong>Data support:</strong> pesan yang Anda kirim kepada kami melalui tiket, email, atau Discord.</li>
            <li><strong>Data teknis:</strong> jenis browser, perangkat, dan halaman yang dikunjungi, dikumpulkan melalui cookie esensial.</li>
          </ul>
        ),
      },
      {
        id: "use",
        title: "Bagaimana kami menggunakannya",
        body: (
          <ul>
            <li>Untuk membuat akun Anda, menjalankan server Anda, dan memproses pembayaran.</li>
            <li>Untuk menjaga keamanan platform, termasuk mendeteksi penipuan dan penyalahgunaan seperti serangan DDoS.</li>
            <li>Untuk menghubungi Anda terkait tagihan, insiden, pemeliharaan, dan perubahan ketentuan kami.</li>
            <li>Untuk mengirim kabar produk, hanya jika Anda memilih ikut. Anda dapat berhenti kapan saja.</li>
          </ul>
        ),
      },
      {
        id: "sharing",
        title: "Dengan siapa kami membagikannya",
        body: (
          <>
            <p>Kami tidak pernah menjual data pribadi Anda. Kami hanya membagikannya kepada:</p>
            <ul>
              <li>penyedia pembayaran yang memproses pembayaran QRIS, virtual account, e-wallet, dan kripto;</li>
              <li>mitra pusat data dan jaringan yang menghosting infrastruktur kami;</li>
              <li>pihak berwenang, jika diwajibkan oleh hukum Indonesia.</li>
            </ul>
          </>
        ),
      },
      {
        id: "retention",
        title: "Berapa lama kami menyimpannya",
        body: (
          <p>
            Data akun disimpan selama akun Anda aktif. Catatan tagihan disimpan selama diwajibkan oleh hukum perpajakan. Data server dan backup dihapus setelah akun Anda ditutup atau server kedaluwarsa, mengikuti masa tenggang yang tertera di panel.
          </p>
        ),
      },
      {
        id: "cookies",
        title: "Cookie",
        body: (
          <p>Kami menggunakan cookie esensial untuk menjaga Anda tetap masuk serta mengingat tema dan bahasa pilihan Anda. Kami tidak menggunakan cookie iklan.</p>
        ),
      },
      {
        id: "rights",
        title: "Hak Anda",
        body: (
          <>
            <p>Anda dapat meminta kami untuk:</p>
            <ul>
              <li>memberikan salinan data pribadi Anda;</li>
              <li>memperbaiki data yang salah atau tidak lengkap;</li>
              <li>menghapus data Anda, atau menghentikan maupun membatasi cara kami memprosesnya;</li>
              <li>menarik persetujuan yang pernah Anda berikan.</li>
            </ul>
            <p>
              Kirim email ke <a href="mailto:privacy@ryoza.id">privacy@ryoza.id</a>. Kami membalas dalam batas waktu yang diwajibkan hukum.
            </p>
          </>
        ),
      },
      {
        id: "security",
        title: "Keamanan",
        body: (
          <p>
            Password disimpan dalam bentuk hash, koneksi ke panel dienkripsi, dan akses ke data pelanggan dibatasi hanya untuk staf yang membutuhkannya. Jika terjadi kebocoran yang memengaruhi data Anda, kami akan memberi tahu Anda dan otoritas terkait sesuai ketentuan hukum.
          </p>
        ),
      },
      {
        id: "changes",
        title: "Perubahan kebijakan ini",
        body: <p>Kami akan memuat setiap perubahan di sini dan mengirim email kepada Anda sebelum perubahan material mulai berlaku.</p>,
      },
    ],
  },
  en: {
    title: "Privacy Policy",
    description: "What personal data Ryoza collects, why, and the choices you have.",
    intro: "What we collect, why we need it, and what you can ask us to do with it. We collect as little as we can to run your servers.",
    updated: "8 November 2026",
    sections: [
      {
        id: "overview",
        title: "Overview",
        body: (
          <p>
            This policy explains what personal data Ryoza collects when you use our website, control panel and game servers, how we use it, and your rights under Indonesia&rsquo;s Personal Data Protection Law (UU No. 27 Tahun 2022). Ryoza is the controller of this data.
          </p>
        ),
      },
      {
        id: "collect",
        title: "Data we collect",
        body: (
          <ul>
            <li><strong>Account data:</strong> your name, email address and hashed password.</li>
            <li><strong>Billing data:</strong> invoices, payment method type and transaction references. Card, bank and wallet details are handled by our payment providers; we never see your full account numbers or PINs.</li>
            <li><strong>Service data:</strong> server settings, console logs, IP addresses that connect to your servers, and panel activity.</li>
            <li><strong>Support data:</strong> messages you send us by ticket, email or Discord.</li>
            <li><strong>Technical data:</strong> browser type, device and pages visited, collected through essential cookies.</li>
          </ul>
        ),
      },
      {
        id: "use",
        title: "How we use it",
        body: (
          <ul>
            <li>To create your account, run your servers and process payments.</li>
            <li>To keep the platform secure, including detecting fraud and abuse such as DDoS attacks.</li>
            <li>To contact you about billing, incidents, maintenance and changes to our terms.</li>
            <li>To send product news, only if you opt in. You can opt out at any time.</li>
          </ul>
        ),
      },
      {
        id: "sharing",
        title: "Who we share it with",
        body: (
          <>
            <p>We never sell your personal data. We share it only with:</p>
            <ul>
              <li>payment providers that process QRIS, virtual account, e-wallet and crypto payments;</li>
              <li>data-centre and network partners that host our infrastructure;</li>
              <li>authorities, when Indonesian law requires us to.</li>
            </ul>
          </>
        ),
      },
      {
        id: "retention",
        title: "How long we keep it",
        body: (
          <p>
            Account data is kept while your account is open. Billing records are kept for as long as tax law requires. Server data and backups are deleted after your account is closed or a server expires, following the grace period shown in the panel.
          </p>
        ),
      },
      {
        id: "cookies",
        title: "Cookies",
        body: (
          <p>We use essential cookies to keep you logged in and to remember your theme and language. We do not use advertising cookies.</p>
        ),
      },
      {
        id: "rights",
        title: "Your rights",
        body: (
          <>
            <p>You can ask us to:</p>
            <ul>
              <li>give you a copy of your personal data;</li>
              <li>correct data that is wrong or incomplete;</li>
              <li>delete your data, or stop or limit how we process it;</li>
              <li>withdraw consent you gave earlier.</li>
            </ul>
            <p>
              Email <a href="mailto:privacy@ryoza.id">privacy@ryoza.id</a>. We reply within the time the law requires.
            </p>
          </>
        ),
      },
      {
        id: "security",
        title: "Security",
        body: (
          <p>
            Passwords are stored hashed, connections to the panel are encrypted, and access to customer data is limited to staff who need it. If a breach affects your data, we will tell you and the relevant authority as the law requires.
          </p>
        ),
      },
      {
        id: "changes",
        title: "Changes to this policy",
        body: <p>We will post any change here and email you before a material change takes effect.</p>,
      },
    ],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const c = content[await getLang()];
  return { title: c.title, description: c.description };
}

export default async function PrivacyPage() {
  const c = content[await getLang()];
  return <LegalPage title={c.title} updated={c.updated} intro={c.intro} sections={c.sections} />;
}
