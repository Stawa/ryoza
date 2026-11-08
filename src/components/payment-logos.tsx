"use client";

import Image from "next/image";
import { paymentLogos } from "@/lib/site";
import { useLang } from "./lang";

const label = { id: "Metode pembayaran yang tersedia", en: "Accepted payment methods" };

const all = paymentLogos.flatMap((g) => g.items);

function Tile({ id, name, small = false, hidden = false }: { id: string; name: string; small?: boolean; hidden?: boolean }) {
  return (
    <li
      aria-hidden={hidden || undefined}
      className={`grid shrink-0 place-items-center bg-white ${small ? "h-9 w-[72px] rounded-lg px-2 shadow-sm" : "h-14 w-[132px] rounded-xl px-4 shadow-[0_1px_2px_rgba(0,0,0,.08)]"}`}
    >
      <Image
        src={`/payments/${id}.svg`}
        alt={hidden ? "" : name}
        width={small ? 64 : 104}
        height={small ? 24 : 36}
        unoptimized
        className={`${small ? "max-h-5" : "max-h-8"} w-auto max-w-full object-contain`}
      />
    </li>
  );
}

/** Payment brand logos on white tiles (the artwork is made for light backgrounds). */
export function PaymentLogos({ compact = false }: { compact?: boolean }) {
  const lang = useLang();
  if (compact)
    return (
      <ul className="flex flex-wrap gap-2" aria-label={label[lang]}>
        {all.map(([id, name]) => <Tile key={id} id={id} name={name} small />)}
      </ul>
    );

  // Marquee: the list twice in one track; the track slides half its width, left to right, forever.
  return (
    <div className="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <ul className="marquee flex w-max gap-3 group-hover:[animation-play-state:paused]" aria-label={label[lang]}>
        {all.map(([id, name]) => <Tile key={id} id={id} name={name} />)}
        {all.map(([id, name]) => <Tile key={`${id}-2`} id={id} name={name} hidden />)}
      </ul>
    </div>
  );
}
