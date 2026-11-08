import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import { isLang, type Lang } from "./i18n";

/**
 * The visitor's language, for server components. Client components use `useLang()`.
 * It comes from the `[lang]` route segment, which src/proxy.ts fills in from the cookie, so pages stay prerendered.
 */
export async function getLang(): Promise<Lang> {
  const v = await lang();
  if (!isLang(v)) notFound();
  return v;
}
