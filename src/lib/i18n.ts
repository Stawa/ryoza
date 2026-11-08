// Languages the site speaks. The choice lives in the `lang` cookie, so URLs stay the same in every language.
export const langs = ["id", "en"] as const;
export type Lang = (typeof langs)[number];
export const defaultLang: Lang = "id";
export const langCookie = "lang";

export const isLang = (v: unknown): v is Lang => langs.includes(v as Lang);

/** One piece of text in every language. */
export type L = Record<Lang, string>;
export const l = (id: string, en: string): L => ({ id, en });

/** BCP 47 locale for dates and numbers. */
export const locale: Record<Lang, string> = { id: "id-ID", en: "en-GB" };
