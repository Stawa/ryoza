"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";
import { FirebaseError } from "firebase/app";
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  setPersistence,
  signInWithCustomToken,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { AuthBanner } from "./auth-banner";
import { useLang } from "./lang";

const input =
  "w-full rounded-xl border border-line bg-bg py-3 pr-3.5 pl-11 text-ink outline-none transition-[border-color,box-shadow] placeholder:text-muted/70 hover:border-muted/60 focus:border-accent focus:ring-4 focus:ring-accent/15";

// 0–4: one point each for length, mixed case, a digit, a symbol
const strength = (pw: string) => (pw.length < 8 ? (pw ? 1 : 0) : [/[a-z]/.test(pw) && /[A-Z]/.test(pw), /\d/.test(pw), /[^A-Za-z0-9]/.test(pw)].filter(Boolean).length + 1);
const copy = {
  id: {
    strength: ["", "Terlalu pendek", "Lemah", "Lumayan", "Kuat"],
    errors: {
      "auth/invalid-credential": "Email atau password salah.",
      "auth/invalid-email": "Format email sepertinya salah.",
      "auth/email-already-in-use": "Email ini sudah terdaftar. Silakan masuk.",
      "auth/weak-password": "Password terlalu pendek, minimal 8 karakter.",
      "auth/too-many-requests": "Terlalu banyak percobaan. Tunggu sebentar, lalu coba lagi.",
      "auth/account-exists-with-different-credential": "Email ini sudah terhubung dengan metode login lain. Silakan pakai metode itu.",
      "auth/popup-blocked": "Jendela login diblokir browser. Izinkan pop-up untuk situs ini, ya.",
      "auth/network-request-failed": "Koneksi bermasalah. Cek internetmu, lalu coba lagi.",
    } as Record<string, string>,
    unknown: "Ada yang nggak beres. Coba lagi, ya.",
    discordFailed: "Login dengan Discord gagal. Coba lagi, ya.",
    resetEmpty: "Isi email di atas dulu, lalu klik “Lupa password?” lagi.",
    resetSent: (email: string) => `Kalau ${email} terdaftar, link reset password sudah kami kirim.`,
    nav: "Akun",
    login: "Masuk",
    register: "Daftar",
    loginTitle: "Selamat datang lagi",
    registerTitle: "Bikin akun baru",
    loginText: "Masuk untuk kelola server dan tagihanmu.",
    registerText: "Daftarnya gratis. Kamu baru bayar saat bikin server.",
    orEmail: "atau pakai email",
    name: "Nama lengkap",
    email: "Email",
    password: "Password",
    forgot: "Lupa password?",
    pwLogin: "Password kamu",
    pwRegister: "Minimal 8 karakter",
    hide: "Sembunyikan password",
    show: "Tampilkan password",
    pwRule: "Pakai minimal 8 karakter, campur huruf, angka, dan simbol.",
    remember: "Ingat saya",
    agree: ["Saya setuju dengan ", "Ketentuan Layanan", " dan ", "Kebijakan Privasi", "."],
    newHere: "Belum punya akun? ",
    haveAccount: "Sudah punya akun? ",
    createLink: "Daftar sekarang",
  },
  en: {
    strength: ["", "Too short", "Weak", "Good", "Strong"],
    errors: {
      "auth/invalid-credential": "Wrong email or password.",
      "auth/invalid-email": "That email address doesn't look right.",
      "auth/email-already-in-use": "An account with this email already exists. Log in instead.",
      "auth/weak-password": "Pick a longer password: 8 characters or more.",
      "auth/too-many-requests": "Too many attempts. Wait a minute and try again.",
      "auth/account-exists-with-different-credential": "This email is already linked to another sign-in method. Use that one.",
      "auth/popup-blocked": "Your browser blocked the sign-in window. Allow pop-ups for this site.",
      "auth/network-request-failed": "Network error. Check your connection.",
    } as Record<string, string>,
    unknown: "Something went wrong. Please try again.",
    discordFailed: "Discord sign-in failed. Please try again.",
    resetEmpty: "Enter your email above, then press “Forgot password?” again.",
    resetSent: (email: string) => `If ${email} has an account, a reset link is on its way.`,
    nav: "Account",
    login: "Log in",
    register: "Create account",
    loginTitle: "Welcome back",
    registerTitle: "Create your account",
    loginText: "Log in to manage your servers and invoices.",
    registerText: "Free to sign up. You only pay when you launch a server.",
    orEmail: "or with email",
    name: "Full name",
    email: "Email",
    password: "Password",
    forgot: "Forgot password?",
    pwLogin: "Your password",
    pwRegister: "At least 8 characters",
    hide: "Hide password",
    show: "Show password",
    pwRule: "Use 8 or more characters with a mix of letters, numbers and symbols.",
    remember: "Keep me logged in",
    agree: ["I agree to the ", "Terms of Service", " and ", "Privacy Policy", "."],
    newHere: "New to Ryoza? ",
    haveAccount: "Already have an account? ",
    createLink: "Create an account",
  },
};
const providers = [
  ["Google", () => new GoogleAuthProvider()],
  ["GitHub", () => new GithubAuthProvider()],
] as const;

// Google keeps its brand colours; GitHub and Discord are one-colour marks tinted with currentColor through a mask, like the footer socials
function ProviderIcon({ name }: { name: string }) {
  if (name === "Google") return <Image src="/auth/google.svg" alt="" width={18} height={18} className="size-[18px]" />;
  const url = `url(${name === "GitHub" ? "/auth/github.svg" : "/social/discord.svg"}) center / contain no-repeat`;
  return <span aria-hidden className="size-[18px] bg-current" style={{ mask: url, WebkitMask: url }} />;
}
const providerButton = "press flex items-center justify-center gap-2 rounded-full border border-line py-3 text-small font-semibold hover:bg-surface-2";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const isLogin = mode === "login";
  const [show, setShow] = useState(false);
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const router = useRouter();
  const score = strength(pw);
  const lang = useLang();
  const t = copy[lang];
  const describe = (e: unknown) => (e instanceof FirebaseError && t.errors[e.code]) || t.unknown;

  async function run(task: () => Promise<unknown>) {
    setBusy(true);
    setMsg("");
    try {
      await task();
      router.push("/account");
    } catch (e) {
      // closing the popup is a choice, not an error
      if (!(e instanceof FirebaseError && (e.code === "auth/popup-closed-by-user" || e.code === "auth/cancelled-popup-request"))) setMsg(describe(e));
      setBusy(false);
    }
  }

  // back from /api/auth/discord: #token=<custom token> or #error=discord.
  // The hash only exists in the browser, so it has to be read after mount.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const hash = new URLSearchParams(location.hash.slice(1));
    const token = hash.get("token");
    if (!token && !hash.has("error")) return;
    history.replaceState(null, "", location.pathname);
    if (token) run(() => signInWithCustomToken(auth, token));
    else setMsg(t.discordFailed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  async function resetPassword() {
    const email = (document.getElementById("email") as HTMLInputElement).value.trim();
    if (!email) return setMsg(t.resetEmpty);
    try {
      auth.languageCode = lang; // the reset email arrives in the language the visitor is reading
      await sendPasswordResetEmail(auth, email);
      setMsg(t.resetSent(email));
    } catch (e) {
      setMsg(describe(e));
    }
  }

  return (
    <div className="frame grid flex-1 gap-6 py-8 lg:grid-cols-2 lg:py-12">
      <AuthBanner mode={mode} />

      {/* right: the form */}
      <div className="flex items-center justify-center py-6 lg:py-10">
        <div className="rise w-full max-w-[420px]">
          <nav aria-label={t.nav} className="grid grid-cols-2 rounded-full border border-line bg-surface p-1 text-small font-semibold">
            {[
              ["/login", t.login, isLogin],
              ["/register", t.register, !isLogin],
            ].map(([href, label, on]) => (
              <Link
                key={href as string}
                href={href as string}
                aria-current={on ? "page" : undefined}
                className={`press rounded-full py-2.5 text-center ${on ? "bg-accent text-accent-ink" : "text-muted hover:text-ink"}`}
              >
                {label as string}
              </Link>
            ))}
          </nav>

          <h1 className="display mt-10 text-head">{isLogin ? t.loginTitle : t.registerTitle}</h1>
          <p className="mt-3 text-muted">{isLogin ? t.loginText : t.registerText}</p>

          <div className="mt-8 grid grid-cols-3 gap-2">
            {providers.map(([name, make]) => (
              <button
                key={name}
                type="button"
                disabled={busy}
                onClick={() => run(() => signInWithPopup(auth, make()))}
                className={`${providerButton} disabled:opacity-70`}
              >
                <ProviderIcon name={name} />
                {name}
              </button>
            ))}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- API route that redirects to Discord OAuth, needs a full navigation */}
            <a href="/api/auth/discord" className={providerButton}>
              <ProviderIcon name="Discord" />
              Discord
            </a>
          </div>
          <p className="mt-6 flex items-center gap-3 text-small text-muted before:h-px before:flex-1 before:bg-line after:h-px after:flex-1 after:bg-line">{t.orEmail}</p>

          <form
            className="mt-6 space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              const email = String(f.get("email")).trim();
              const password = String(f.get("password"));
              run(async () => {
                if (isLogin) {
                  await setPersistence(auth, f.get("remember") ? browserLocalPersistence : browserSessionPersistence);
                  await signInWithEmailAndPassword(auth, email, password);
                } else {
                  const { user } = await createUserWithEmailAndPassword(auth, email, password);
                  await updateProfile(user, {
                    displayName: String(f.get("name")).trim(),
                  });
                }
              });
            }}
          >
            {!isLogin && (
              <Field id="name" label={t.name} icon={User}>
                <input id="name" name="name" required autoComplete="name" placeholder="Ayu Lestari" className={input} />
              </Field>
            )}
            <Field id="email" label={t.email} icon={Mail}>
              <input id="email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" className={input} />
            </Field>
            <Field
              id="password"
              label={t.password}
              icon={Lock}
              aside={
                isLogin ? (
                  <button type="button" onClick={resetPassword} className="text-small font-normal text-muted hover:text-ink">
                    {t.forgot}
                  </button>
                ) : null
              }
            >
              <input
                id="password"
                name="password"
                type={show ? "text" : "password"}
                required
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                minLength={isLogin ? undefined : 8}
                aria-describedby={isLogin ? undefined : "pw-rule"}
                autoComplete={isLogin ? "current-password" : "new-password"}
                placeholder={isLogin ? t.pwLogin : t.pwRegister}
                className={`${input} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                aria-label={show ? t.hide : t.show}
                aria-pressed={show}
                className="absolute top-1/2 right-2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-muted hover:bg-surface-2 hover:text-ink"
              >
                {show ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
              </button>
            </Field>

            {!isLogin && (
              <div id="pw-rule" className="-mt-2">
                <div className="grid grid-cols-4 gap-1.5" aria-hidden>
                  {[1, 2, 3, 4].map((n) => (
                    <span key={n} className={`h-1 rounded-full transition-colors ${score >= n ? (score <= 2 ? "bg-degraded" : "bg-accent") : "bg-surface-2"}`} />
                  ))}
                </div>
                <p className="mt-2 text-small text-muted">{pw ? `${t.strength[score]}. ` : ""}{t.pwRule}</p>
              </div>
            )}

            {isLogin ? (
              <label className="flex items-center gap-2.5 text-small">
                <input type="checkbox" name="remember" defaultChecked className="size-4 accent-[var(--accent)]" />
                {t.remember}
              </label>
            ) : (
              <label className="flex items-start gap-2.5 text-small text-muted">
                <input type="checkbox" required className="mt-0.5 size-4 shrink-0 accent-[var(--accent)]" />
                <span>
                  {t.agree[0]}
                  <Link href="/terms" className="text-ink underline underline-offset-4 hover:text-accent-text">
                    {t.agree[1]}
                  </Link>
                  {t.agree[2]}
                  <Link href="/privacy" className="text-ink underline underline-offset-4 hover:text-accent-text">
                    {t.agree[3]}
                  </Link>
                  {t.agree[4]}
                </span>
              </label>
            )}

            <button
              type="submit"
              disabled={busy}
              className="press group flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3.5 font-semibold text-accent-ink hover:brightness-95 disabled:opacity-70"
            >
              {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
              {isLogin ? t.login : t.register}
              {!busy && <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />}
            </button>
            <p role="status" className="rounded-lg border border-degraded/60 px-3 py-2 text-small text-degraded empty:hidden">
              {msg}
            </p>
          </form>

          <p className="mt-8 text-center text-small text-muted">
            {isLogin ? t.newHere : t.haveAccount}
            <Link href={isLogin ? "/register" : "/login"} className="font-semibold text-ink hover:text-accent-text">
              {isLogin ? t.createLink : t.login}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ id, label, icon: Icon, aside, children }: { id: string; label: string; icon: typeof Mail; aside?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label htmlFor={id} className="text-small font-semibold">
          {label}
        </label>
        {aside}
      </div>
      <div className="relative">
        <Icon className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted" aria-hidden />
        {children}
      </div>
    </div>
  );
}
