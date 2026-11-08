import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";

type DiscordUser = { id: string; username: string; global_name: string | null; avatar: string | null; email?: string; verified?: boolean };

export async function GET(req: Request) {
  const url = new URL(req.url);
  const fail = (reason: string) => NextResponse.redirect(new URL(`/login#error=${reason}`, url.origin));

  const jar = await cookies();
  const expected = jar.get("discord_state")?.value;
  jar.delete({ name: "discord_state", path: "/api/auth/discord" });
  const code = url.searchParams.get("code");
  if (!code || !expected || url.searchParams.get("state") !== expected) return fail("discord");

  try {
    const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID!,
        client_secret: process.env.DISCORD_CLIENT_SECRET!,
        grant_type: "authorization_code",
        code,
        redirect_uri: `${url.origin}/api/auth/discord/callback`,
      }),
    });
    if (!tokenRes.ok) return fail("discord");
    const { access_token } = (await tokenRes.json()) as { access_token: string };

    const meRes = await fetch("https://discord.com/api/users/@me", { headers: { Authorization: `Bearer ${access_token}` } });
    if (!meRes.ok) return fail("discord");
    const me = (await meRes.json()) as DiscordUser;

    const uid = `discord:${me.id}`;
    const profile = {
      displayName: me.global_name ?? me.username,
      photoURL: me.avatar ? `https://cdn.discordapp.com/avatars/${me.id}/${me.avatar}.png` : undefined,
    };
    const admin = adminAuth();
    try {
      await admin.updateUser(uid, profile);
    } catch {
      // first sign-in. Email is only stored when Discord has verified it; a clash with another account is not fatal.
      const email = me.verified ? me.email : undefined;
      await admin.createUser({ uid, ...profile, email, emailVerified: !!email }).catch(() => admin.createUser({ uid, ...profile }));
    }

    const token = await admin.createCustomToken(uid, { provider: "discord" });
    // fragment, not query: it never reaches server logs or the Referer header
    return NextResponse.redirect(new URL(`/login#token=${encodeURIComponent(token)}`, url.origin));
  } catch {
    return fail("discord");
  }
}
