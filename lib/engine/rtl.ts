/**
 * RTL, Arabic Numerals, Hijri Date, and CLDR 6 Plural Forms Helper
 * Following Spec Section 9 (20 EN/AR Rules)
 */

export function toArabicIndic(input: number | string): string {
  const str = String(input);
  const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return str.replace(/\d/g, (d) => arabicDigits[Number(d)]);
}

export function formatHijriDate(date: Date): string {
  return new Intl.DateTimeFormat("ar-OM-u-ca-islamic-umalqura", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function isolateBdi(text: string): string {
  // Unicode Left-to-Right Isolate (LRI) \u2066 and Pop Directional Isolate (PDI) \u2069
  return `\u2066${text}\u2069`;
}

export type ArabicPluralCategory = "zero" | "one" | "two" | "few" | "many" | "other";

export function getArabicPluralCategory(n: number): ArabicPluralCategory {
  if (n === 0) return "zero";
  if (n === 1) return "one";
  if (n === 2) return "two";
  const mod100 = n % 100;
  if (mod100 >= 3 && mod100 <= 10) return "few";
  if (mod100 >= 11 && mod100 <= 99) return "many";
  return "other";
}
