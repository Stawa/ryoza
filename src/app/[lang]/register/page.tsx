import type { Metadata } from "next";
import { getLang } from "@/lib/i18n-server";
import { AuthForm } from "@/components/auth-form";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getLang()) === "id" ? "Daftar" : "Sign up" };
}

export default function RegisterPage() {
  return <AuthForm mode="register" />;
}
