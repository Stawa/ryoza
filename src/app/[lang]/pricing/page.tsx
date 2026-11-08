import type { Metadata } from "next";
import { getLang } from "@/lib/i18n-server";
import { Faq } from "@/components/landing/faq";
import { Pricing } from "@/components/landing/pricing";

export async function generateMetadata(): Promise<Metadata> {
  return (await getLang()) === "id"
    ? { title: "Harga", description: "Paket server game dengan perlindungan DDoS, backup dan control panel lengkap." }
    : { title: "Pricing", description: "Game server plans with DDoS protection, backups and a full control panel." };
}

export default function PricingPage() {
  return (
    <>
      <Pricing asPage />
      <Faq />
    </>
  );
}
