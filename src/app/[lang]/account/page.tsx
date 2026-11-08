import type { Metadata } from "next";
import { getLang } from "@/lib/i18n-server";
import { Account } from "@/components/account";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getLang()) === "id" ? "Akun kamu" : "Your account", robots: { index: false } };
}

export default function AccountPage() {
  return <Account />;
}
