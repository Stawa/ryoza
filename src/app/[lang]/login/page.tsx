import type { Metadata } from "next";
import { getLang } from "@/lib/i18n-server";
import { AuthForm } from "@/components/auth-form";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getLang()) === "id" ? "Masuk" : "Log in" };
}

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
