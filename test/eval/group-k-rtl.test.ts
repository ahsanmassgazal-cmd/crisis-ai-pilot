import { describe, it, expect } from "vitest";
import {
  toArabicIndic,
  formatHijriDate,
  isolateBdi,
  getArabicPluralCategory,
} from "@/lib/engine/rtl";

describe("Group K: RTL, Numerals, Hijri Dates & 6 Plural Forms (Spec Section 9)", () => {
  it("converts Western digits to Arabic-Indic digits accurately", () => {
    expect(toArabicIndic(0)).toBe("٠");
    expect(toArabicIndic(41)).toBe("٤١");
    expect(toArabicIndic("1248")).toBe("١٢٤٨");
    expect(toArabicIndic("INC-2026-001")).toBe("INC-٢٠٢٦-٠٠١");
  });

  it("formats dates into Islamic Hijri Calendar (Umm al-Qura)", () => {
    const testDate = new Date("2026-03-29T12:00:00Z");
    const hijri = formatHijriDate(testDate);
    expect(hijri).toBeTruthy();
    // 2026 corresponds to Hijri 1447 (formatted in Arabic-Indic digits)
    expect(hijri).toContain("١٤٤٧");
  });

  it("isolates phone numbers and IDs with directional isolation markers", () => {
    const phone = "+968 0000 1049";
    const isolated = isolateBdi(phone);
    expect(isolated).toBe(`\u2066${phone}\u2069`);
    expect(isolated.startsWith("\u2066")).toBe(true);
    expect(isolated.endsWith("\u2069")).toBe(true);
  });

  it("classifies numbers into the exact 6 CLDR Arabic plural forms (0, 1, 2, 3..10, 11..99, 100+)", () => {
    // 0 -> zero
    expect(getArabicPluralCategory(0)).toBe("zero");

    // 1 -> one
    expect(getArabicPluralCategory(1)).toBe("one");

    // 2 -> two
    expect(getArabicPluralCategory(2)).toBe("two");

    // 3..10 -> few
    expect(getArabicPluralCategory(3)).toBe("few");
    expect(getArabicPluralCategory(5)).toBe("few");
    expect(getArabicPluralCategory(10)).toBe("few");

    // 11..99 -> many
    expect(getArabicPluralCategory(11)).toBe("many");
    expect(getArabicPluralCategory(25)).toBe("many");
    expect(getArabicPluralCategory(99)).toBe("many");

    // 100, 101, 102, 200, 1000 -> other
    expect(getArabicPluralCategory(100)).toBe("other");
    expect(getArabicPluralCategory(200)).toBe("other");
    expect(getArabicPluralCategory(1000)).toBe("other");
  });
});
