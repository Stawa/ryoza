import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Discord isn't a built-in Firebase provider: we run its OAuth here and hand the browser a Firebase custom token.
export async function GET(req: Request) {
  const state = crypto.randomUUID();
  (await cookies()).set("discord_state", state, { httpOnly: true, secure: true, sameSite: "lax", maxAge: 600, path: "/api/auth/discord" });

  const url = new URL("https://discord.com/oauth2/authorize");
  url.search = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID!,
    redirect_uri: `${new URL(req.url).origin}/api/auth/discord/callback`,
    response_type: "code",
    scope: "identify email",
    state,
    prompt: "none",
  }).toString();
  return NextResponse.redirect(url);
}
