import Image from "next/image";
import Link from "next/link";

/** Brand logo from public/ryoza-kit: light artwork on the dark theme, dark artwork on the light theme. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`press flex shrink-0 items-center ${className}`}>
      <Image src="/ryoza-kit/logo-nav-light.png" alt="Ryoza" width={338} height={104} priority className="hidden h-9 w-auto dark:block" />
      <Image src="/ryoza-kit/logo-nav-dark.png" alt="Ryoza" width={338} height={104} priority className="h-9 w-auto dark:hidden" />
    </Link>
  );
}

/** The "r." mark from the brand icon, without its tile, for large decorative use. Takes currentColor. */
export function RMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="12 13 40 40" className={className} aria-hidden fill="currentColor">
      <rect x="18" y="19" width="10" height="29" />
      <path d="M23 33a14 14 0 0 1 14-14" fill="none" stroke="currentColor" strokeWidth="10" />
      <circle cx="44" cy="43" r="5" />
    </svg>
  );
}
