import { NextResponse, type NextRequest } from "next/server";
import { defaultLang, isLang, langCookie, langs } from "@/lib/i18n";

// Visitors never see /id or /en: "/pricing" is served from "/<cookie language>/pricing" behind the same URL.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1];
  if (langs.some((l) => l === first)) return; // already rewritten, or someone typed /en/... by hand

  const v = request.cookies.get(langCookie)?.value;
  const url = request.nextUrl.clone();
  url.pathname = `/${isLang(v) ? v : defaultLang}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // pages only: skip API routes, Next internals and files with an extension (public assets, icons, manifest)
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
